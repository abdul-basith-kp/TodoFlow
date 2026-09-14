
import bcrypt

class PasswordEncryption:
    
    @staticmethod
    def create_hash(password):
        return bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(12)
            ).decode("utf-8")

    @staticmethod
    def verify_hash(password, password_hash):
        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"))