
from database import Database
from models.task import Task

class TaskRepo:
    def __init__(self, db: Database):
        self.db = db

    def create_task(self, cur, user_id, title, description, priority, due_date):
        cur.execute("""
        INSERT INTO tasks
        (user_id, title, description, priority, due_date)
        VALUES
        (%s, %s, %s, %s, %s)""",(user_id, title, description, priority, due_date))
  
    def get_tasks_by_status_and_user_id(self, cur, status, user_id):
        cur.execute("""
        SELECT id, user_id, title, description, priority, due_date, created_at, status
        FROM tasks
        WHERE status = %s 
            AND user_id = %s
        ORDER BY id""", (status, user_id))
        rows = cur.fetchall()
        if not rows: return None
        return [Task(
            id=row[0],
            user_id=row[1],
            title=row[2],
            description=row[3],
            priority=row[4],
            due_date=row[5],
            created_at=row[6],
            status=row[7]
        ) for row in rows]

    def get_tasks_by_user_id(self, cur, user_id: int):
        cur.execute("""
        SELECT *
        FROM tasks
        WHERE user_id = %s""", (user_id, ))
        rows = cur.fetchall()
        if not rows: return None
        return [Task(*row) for row in rows]
    
    def update_task(
            self, 
            cur, 
            task_id: int, 
            user_id: int, 
            new_title: str, 
            new_decription: str, 
            new_priority: str, 
            new_due_date: str):
        cur.execute("""
        UPDATE tasks
        SET 
            title = %s,
            description = %s,
            priority = %s,
            due_date = %s
        WHERE
            id = %s
            AND
            user_id = %s
        """,(new_title, new_decription, new_priority, new_due_date, task_id, user_id))


    def update_task_status(self, cur, task_id, user_id, new_status):
        cur.execute("""
        UPDATE tasks
        SET status = %s
        WHERE id = %s 
            AND user_id = %s""", (new_status, task_id, user_id))
        
    