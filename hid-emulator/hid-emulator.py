"""Emulate input commands and post this command to a corresponding workbench endpoint."""

import logging
from datetime import datetime
from sys import exit

import requests

logging.basicConfig(format="%(levelname)s:%(asctime)s:%(message)s", level=logging.INFO)
API_ENDPOINT = "http://127.0.0.1:5000/workbench/hid-event"


class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


while True:
    try:
        print(
            "Выберите эмулированное действие (1/2/3): \n",
            f"{bcolors.OKGREEN}1. Приложить карту сотрудника к RFID-сканеру.\n{bcolors.ENDC}",
            f"{bcolors.OKBLUE}2. Отсканировать штрих-код изделия (потребуется ввести штрих-код).\n{bcolors.ENDC}",
            f"{bcolors.OKBLUE}3. Выход.{bcolors.ENDC}",
        )
        action: str = input()
        if action == "1":
            json_event = {
                "string": "1111111111",
                "name": "Sample RFID Scanner",
                "timestamp": str(datetime.timestamp(datetime.now())),
                "info": {},
            }
            requests.post(url=API_ENDPOINT, json=json_event)
            # logging.info(f"Event relayed to endpoint {API_ENDPOINT}")
        elif action == "2":
            print("Введите уникальный номер изделия")
            code = input()
            json_event = {
                "string": code,
                "name": "Sample Barcode Scanner",
                "timestamp": str(datetime.timestamp(datetime.now())),
                "info": {},
            }
            requests.post(url=API_ENDPOINT, json=json_event)
            # logging.info(f"Event relayed to endpoint {API_ENDPOINT}")
        elif action == "3":
            exit()
        else:
            print(f"{bcolors.FAIL}Введите 1, 2 или 3{bcolors.ENDC}")
    except Exception as e:
        print(f"{bcolors.FAIL}Ошибка: {e}{bcolors.ENDC}")
