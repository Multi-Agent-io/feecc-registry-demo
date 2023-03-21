import datetime as dt
import os
import re
import socket
from pathlib import Path
from time import time
from typing import Any

from loguru import logger
from yarl import URL

TIMESTAMP_FORMAT = "%d-%m-%Y %H:%M:%S"


def time_execution(func: Any) -> Any:
    """This decorator shows the execution time of the function object passed"""

    def wrap_func(*args: Any, **kwargs: Any) -> Any:
        t1 = time()
        result = func(*args, **kwargs)
        t2 = time()
        logger.debug(f"Function {func.__name__!r} executed in {(t2 - t1):.4f}s")
        return result

    return wrap_func


def async_time_execution(func: Any) -> Any:
    """This decorator shows the execution time of the function object passed"""

    async def wrap_func(*args: Any, **kwargs: Any) -> Any:
        t1 = time()
        result = await func(*args, **kwargs)
        t2 = time()
        logger.debug(f"Function {func.__name__!r} executed in {(t2 - t1):.4f}s")
        return result

    return wrap_func


def get_headers(rfid_card_id: str) -> dict[str, str]:
    """return a dict with all the headers required for using the backend"""
    return {"rfid-card-id": rfid_card_id}


def is_a_ean13_barcode(string: str) -> bool:
    """define if the barcode scanner input is a valid EAN13 barcode"""
    return bool(re.fullmatch(r"\d{13}", string))


def timestamp() -> str:
    """generate formatted timestamp for the invocation moment"""
    return dt.datetime.now().strftime(TIMESTAMP_FORMAT)


def service_is_up(service_endpoint: str | URL) -> bool:  # noqa: CAC001
    """Check if the provided host is reachable"""
    if isinstance(service_endpoint, str):
        service_endpoint = URL(service_endpoint)

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        try:
            result = sock.connect_ex((service_endpoint.host, service_endpoint.port))
        except Exception as e:
            logger.debug(f"An error occured during socket connection attempt: {e}")
            result = 1

    return result == 0


def export_version() -> None:
    """Parse app version and export it into environment variables at runtime"""
    version_file = Path("version.txt")
    if version_file.exists():
        with version_file.open("r") as f:
            version = f.read()
            os.environ["VERSION"] = version.strip("\n")
