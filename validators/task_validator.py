from validators.general_validator import GeneralValidator
from exceptions import ValidationError
from constants.priority import PRIORITIES
from datetime import datetime, date

class TaskValidator:

    def __init__(self, general_validator: GeneralValidator):
        self.gv = general_validator

    def validate_title(self, title):
        self.gv.validate_blank_input(title)

    def validate_description(self, description):
        self.gv.validate_blank_input(description)
        if len(description) > 512:
            raise ValidationError("description too long")
        
    def validate_priority(self, priotity):
        self.gv.validate_blank_input(priotity)
        if priotity not in PRIORITIES:
            raise ValidationError(f"Invalid tasked priority, must be in {PRIORITIES} ")
        
    def validate_due_date(self, due_date):
        self.gv.validate_blank_input(due_date)

        try:
            due_date = datetime.strptime(due_date, "%Y-%m-%d").date()
        except:
            raise ValidationError("date format must be yyyy-mm-dd")

        if due_date < date.today():
            raise ValidationError("due date cannot be in the past")

    