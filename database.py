from dotenv import load_dotenv
from exceptions import DatabaseConnectionError
import os
import mysql.connector

load_dotenv()
class Database:

    def  __init__(self):
        self.create_tables()
        
    def create_tables(self):
        with self.get_connection() as conn:
            cur = conn.cursor()
            self.create_user_table(cur)
            self.create_tasks_table(cur)
            self.create_table_community_msgs(cur)
            conn.commit()

    def get_connection(self):
        try:
            return mysql.connector.connect(
                host=os.getenv("HOST"),
                user=os.getenv("USER"),
                password=os.getenv("PASSWORD"),
                database=os.getenv("DATABASE")
            )
        except:
            raise DatabaseConnectionError("Failed to connect to Database")

    def create_user_table(self, cur):
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users(
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(128) UNIQUE,
                password_hash VARCHAR(512)
            )""")

    def create_tasks_table(self, cur):
        cur.execute("""
        CREATE TABLE IF NOT EXISTS tasks(
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            title VARCHAR(64) NOT NULL,
            description TEXT NOT NULL,
            priority VARCHAR(10) NOT NULL 
                CHECK(priority IN('HIGH', 'MEDIUM', 'LOW')),
            due_date DATE NOT NULL,
            status VARCHAR(32) NOT NULL 
                DEFAULT 'PENDING'
                CHECK (status IN ('PENDING', 'COMPLETED', 'DELETED')),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE (user_id, title))""")

    def create_table_community_msgs(self, cur):
        cur.execute("""
        CREATE TABLE IF NOT EXISTS community_msgs(
            msg_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            msg VARCHAR(1024),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )""")


