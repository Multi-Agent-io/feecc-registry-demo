import pathlib
from os import getenv

import ipfshttpclient2 as ipfshttpclient
from loguru import logger

from .Messenger import messenger
from .utils import async_time_execution

PY_IPFS_HTTP_CLIENT_DEFAULT_ADDR: str = getenv("PY_IPFS_HTTP_CLIENT_DEFAULT_ADDR")
IPFS_GATEWAY_LINK_PREFIX: str = getenv("IPFS_GATEWAY_LINK_PREFIX")


@async_time_execution
async def publish_file(file_path: pathlib.Path) -> tuple[str, str]:
    """publish a provided file to IPFS using the Feecc gateway and return it's CID and URL"""

    file_path = pathlib.Path(file_path)
    try:
        with ipfshttpclient.connect(addr=PY_IPFS_HTTP_CLIENT_DEFAULT_ADDR) as client:
            cid: str = client.add(file_path)["Hash"]
            link: str = f"{IPFS_GATEWAY_LINK_PREFIX}{cid}"
            assert cid and link, "IPFS gateway returned no CID"
    except Exception as e:
        messenger.error("Ошибка во время загрузки файла в сеть IPFS.")
        logger.error(f"An error occurred while uploading file to IPFS: {e}")

    logger.info(f"File '{file_path} published to IPFS under CID {cid}'")

    return cid, link
