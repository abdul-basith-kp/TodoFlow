
from database import Database


class UserRepo:
    def __init__(self, db: Database):
        self.db = db

    def create_user(self, cur, username, password_hash):
        cur.execute("""
        INSERT INTO users 
        (username, password_hash) 
        VALUES (%s, %s)""", (username, password_hash))

    def get_user_by_username(self, cur, username):
        cur.execute("""
        SELECT id, username, password_hash
        FROM users
        WHERE username = %s""", (username,))
        row = cur.fetchone()
        return row

    def get_user_by_user_id(self, cur, id):
        cur.execute("""
        SELECT id, username, password_hash
        FROM users
        WHERE id = %s""", (id,))
        row = cur.fetchone()
        return row

    def get_all_users(self, cur):
        cur.execute("""
        SELECT id, username, password_hash
        FROM users
        """)
        rows = cur.fetchall()
        return rows

    def update_username(self, cur, user_id, username):
        cur.execute("""
        UPDATE users
        SET username = %s
        WHERE id = %s""", (username, user_id)
        )

    def update_password(self, cur, user_id, password_hash):
        cur.execute("""
        UPDATE users
        SET password_hash = %s
        WHERE id = %s""", (password_hash, user_id)
        )

    def delete_user(self, cur, user_id):
        cur.execute("""
        DELETE FROM users
        WHERE id = %s""", (user_id,))