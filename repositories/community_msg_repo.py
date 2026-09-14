

from database import Database


class communityMsgRepo:

    def __init__(self, db: Database):
        self.db = db

    def create_msg(self, cur, user_id, msg):
        cur.execute("""
        INSERT INTO community_msgs
        (user_id, msg)
        VALUES
        (%s, %s)""", (user_id, msg))

    def get_messages(self, cur):
        cur.execute("""
        SELECT msg_id, user_id, msg, created_at
        FROM community_msgs
        """)
        rows = cur.fetchall()
        if not rows: return None
        return rows