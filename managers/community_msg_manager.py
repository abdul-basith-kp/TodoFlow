

from repositories.community_msg_repo import communityMsgRepo
from managers.user_manager import UserManager


class CommunityMsgManager:

    def __init__(self, community_msg_repo: communityMsgRepo, user_manager: UserManager):
        self.community_msg_repo = community_msg_repo
        self.db = self.community_msg_repo.db
        self.um = user_manager

    def create_msg(self, user_id, msg):

        with self.db.get_connection() as conn:
            cur = conn.cursor()
            self.community_msg_repo.create_msg(cur, user_id, msg)

            conn.commit()

    def generate_mutated_username_(self, user_id, session_username):
        username = self.um.get_username_by_user_id(user_id)
        if username == session_username:
            return 'you'
        return username

    def get_msgs(self, session_username):
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            rows = self.community_msg_repo.get_messages(cur)
            return [{
            'msg_id': row[0],
            'user_id': row[1],
            'msg': row[2],
            'created_at': row[3],
            'username': self.generate_mutated_username_(row[1], session_username)
        } for row in rows]
            