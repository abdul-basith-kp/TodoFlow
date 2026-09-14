from repositories.user_repository import UserRepo
from utils.password_encryption import PasswordEncryption
from validators.user_validator import UserValidator
from exceptions import AuthenticationError


class UserManager:

    def __init__(self, user_repo: UserRepo, user_validator: UserValidator):
        self.user_repo = user_repo
        self.db = user_repo.db
        self.user_validator = user_validator

    def register_user(self, username, password):
        self.user_validator.validate_username(username)
        self.user_validator.validate_password(password)
        with self.db.get_connection() as conn:
            cur = conn.cursor()

            password_hash = PasswordEncryption.create_hash(password)
            try:
                self.user_repo.create_user(cur, username, password_hash)
                conn.commit()
            except Exception as e:
                if 'users.username' in str(e):
                    raise AuthenticationError("user already exists")
                else:
                    raise AuthenticationError("Error occured while creating user")
        

    def login_user(self, username, password):
        self.user_validator.gv.validate_blank_input(username)
        self.user_validator.gv.validate_blank_input(password)

        with self.db.get_connection() as conn:
            cur = conn.cursor()
            user = self.user_repo.get_user_by_username(cur, username)
            if not user or not PasswordEncryption.verify_hash(password, user[2]):
                raise AuthenticationError("Please check your username and password")
            return user
            

    def get_user_by_username(self, username):
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            return self.user_repo.get_user_by_username(cur, username)
    
    def get_username_by_user_id(self, user_id):
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            user = self.user_repo.get_user_by_user_id(cur, user_id)

            return user[1]