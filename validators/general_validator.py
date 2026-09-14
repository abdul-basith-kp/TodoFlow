from exceptions import ValidationError

class GeneralValidator:

    @staticmethod
    def validate_blank_input(text):
            if not text.strip():
                raise ValidationError("Input cannot be black")

    @staticmethod
    def validate_id(ID):
         
         if not isinstance(ID, int):
              raise ValidationError("id must be a number")
         if ID < 1:
              raise ValidationError("invalid id")