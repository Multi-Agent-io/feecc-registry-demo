"""Emulate input commands and post this command to a corresponding workbench endpoint."""

import os
from datetime import datetime

import requests
from loguru import logger
from termcolor import colored

API_ENDPOINT = os.getenv("HID_EVENT_ENDPOINT", "http://127.0.0.1:5000/workbench/hid-event")
EventDict = dict[str, str | dict[str, str]]

while True:
    try:
        print(
            "Select emulated action (1/2): \n",
            colored("1. Put ID card on the RFID scanner.\n", "green"),
            colored("2. Scan a sample barcode with a barcode scanner.", "blue"),
        )
        action: str = input()
        if action == "1":
            json_event: EventDict = {
                "string": "1111111111",
                "name": "Sample RFID Scanner",
                "timestamp": str(datetime.timestamp(datetime.now())),
                "info": {},
            }
            requests.post(url=API_ENDPOINT, json=json_event)
            logger.debug(f"Event relayed to endpoint {API_ENDPOINT}")
        elif action == "2":
            print(colored("Insert the device unique code"))
            code = input()
            json_event: EventDict = {
                "string": code,
                "name": "Sample Barcode Scanner",
                "timestamp": str(datetime.timestamp(datetime.now())),
                "info": {},
            }
            requests.post(url=API_ENDPOINT, json=json_event)
            logger.debug(f"Event relayed to endpoint {API_ENDPOINT}")
        else:
            print(colored("Input 1 or 2", "red"))
    except Exception as e:
        print(colored(f"Error: {e}", "red"))
