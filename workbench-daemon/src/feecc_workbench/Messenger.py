import asyncio
import json
from collections.abc import AsyncGenerator
from dataclasses import dataclass, field
from enum import Enum
from typing import TypeAlias
from uuid import uuid4

from loguru import logger

from .Singleton import SingletonMeta

MessageApiDict: TypeAlias = dict[str, bool | str | int | dict[str, str]]


class MessageLevels(Enum):
    """Available message levels (similar to log levels)"""

    DEBUG = "default"
    INFO = "info"
    WARNING = "warning"
    SUCCESS = "success"
    ERROR = "error"


@dataclass(frozen=True, slots=True)
class Message:
    """A single message object"""

    message: str
    level: MessageLevels = MessageLevels.INFO

    def get_api_dict(self) -> MessageApiDict:
        message_dict = {
            "message": self.message,
            "variant": self.level.value,
            "persist": False,
            "preventDuplicate": True,
            "autoHideDuration": 5000,
            "anchorOrigin": {
                "vertical": "bottom",
                "horizontal": "left",
            },
        }

        match self.level:
            case MessageLevels.ERROR:
                message_dict["persist"] = True
                message_dict["preventDuplicate"] = False
            case MessageLevels.WARNING:
                message_dict["autoHideDuration"] = 10000

        return message_dict


@dataclass
class MessageBroker:
    """A single message broker. Provides awaitable interface for messages"""

    alive: bool = True
    broker_id: str = field(default_factory=lambda: uuid4().hex[:4])
    feed: asyncio.Queue[Message] = field(default_factory=asyncio.Queue)

    def __post_init__(self) -> None:
        logger.debug(f"Message broker {self.broker_id} created")

    async def send_message(self, message: Message) -> None:
        await self.feed.put(message)

    async def get_message(self) -> Message:
        return await self.feed.get()

    def kill(self) -> None:
        self.alive = False
        logger.debug(f"Broker {self.broker_id} killed.")


class Messenger(metaclass=SingletonMeta):
    """
    Messenger is a single entrypoint to get brokers and
    emit messages across all brokers at once.

    Interface mimics logger.

    Singleton object.
    """

    def __init__(self) -> None:
        self._brokers: list[MessageBroker] = []

    def get_broker(self) -> MessageBroker:
        """Get a new message broker and register it in the Messenger"""
        broker = MessageBroker()
        self._brokers.append(broker)
        return broker

    async def emit_message(self, level: MessageLevels, message: str) -> None:
        """Emit message across all brokers"""
        self._brokers = [br for br in self._brokers if br.alive]
        broker_cnt = len(self._brokers)
        message_ = Message(message, level)

        for i in range(broker_cnt):
            await self._brokers[i].send_message(message_)

        if broker_cnt:
            logger.info(f"Message '{message}' emitted to {broker_cnt} brokers")
        else:
            logger.warning(f"Message '{message}' not emitted: no recipients")

    def _emit_message_sync(self, message: str, level: MessageLevels) -> None:
        """A synchronous entrypoint to message emitting method"""
        task = self.emit_message(level, message)
        try:
            asyncio.create_task(task)
        except RuntimeError:
            asyncio.run(task)

    def default(self, message: str) -> None:
        """Emit 'default' level message"""
        self._emit_message_sync(
            level=MessageLevels.DEBUG,
            message=message,
        )

    def info(self, message: str) -> None:
        """Emit 'info' level message"""
        self._emit_message_sync(
            level=MessageLevels.INFO,
            message=message,
        )

    def success(self, message: str) -> None:
        """Emit 'success' level message"""
        self._emit_message_sync(
            level=MessageLevels.SUCCESS,
            message=message,
        )

    def warning(self, message: str) -> None:
        """Emit 'warning' level message"""
        self._emit_message_sync(
            level=MessageLevels.WARNING,
            message=message,
        )

    def error(self, message: str) -> None:
        """Emit 'error' level message"""
        self._emit_message_sync(
            level=MessageLevels.ERROR,
            message=message,
        )


messenger = Messenger()


async def message_generator() -> AsyncGenerator[str, None]:
    """Notification generator for SSE message streaming"""
    logger.info("SSE connection to message streaming endpoint established.")
    broker = messenger.get_broker()

    try:
        while True:
            message = await broker.get_message()
            message_dict = message.get_api_dict()
            yield json.dumps(message_dict)

    except asyncio.CancelledError:
        logger.info("SSE connection to message streaming endpoint closed")
        broker.kill()
