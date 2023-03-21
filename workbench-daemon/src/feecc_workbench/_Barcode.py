import barcode

class Barcode:
    def __init__(self, unit_code: str) -> None:
        self.unit_code: str = unit_code
        self.barcode: barcode.EAN13 = barcode.get("ean13", self.unit_code)
