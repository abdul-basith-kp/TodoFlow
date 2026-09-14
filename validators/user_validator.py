
from exceptions import ValidationError
from validators.general_validator import GeneralValidator
class UserValidator:
    def __init__(self, general_validator: GeneralValidator):
        self.gv = general_validator
    
    def validate_username(self, username):
        self.gv.validate_blank_input(username)
        if len(username) < 4:
            raise ValidationError("Username too short")

    def validate_password(self, password):
        self.gv.validate_blank_input(password)
        if len(password) < 4:
            raise ValidationError("Password too short")