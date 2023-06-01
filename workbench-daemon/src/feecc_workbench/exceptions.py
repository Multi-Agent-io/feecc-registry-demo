class UnitNotFoundError(Exception):
    """An error raised when no unit can be found with the provided key"""


class EmployeeNotFoundError(Exception):
    """An error raised when no employee can be found with the provided key"""


class StateForbiddenError(Exception):
    """Raised when state transition is forbidden"""
