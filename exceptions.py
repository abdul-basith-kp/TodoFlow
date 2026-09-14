class ApplicationError(Exception):
    pass
class ValidationError(ApplicationError):
    pass
class AuthenticationError(ApplicationError):
    pass
class DatabaseConnectionError(ApplicationError):
    pass