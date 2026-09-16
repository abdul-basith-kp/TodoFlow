
from repositories.task_repository import TaskRepo
from validators.task_validator import TaskValidator
from constants.status import STATUS_DELETED, STATUS_COMPLETED, STATUS_PENDING

class TaskManager:
    def __init__(self, task_repo: TaskRepo, task_validator: TaskValidator):
        self.task_repo = task_repo
        self.db = task_repo.db
        self.tv = task_validator

    @staticmethod
    def _get_percent(num, total):
        if total == 0: return 0
        return (num/total)*100
    
    def add_task(self, user_id, title, description, priority, due_date):

        self.tv.gv.validate_id(user_id)
        self.tv.validate_title(title)
        self.tv.validate_description(description)
        self.tv.validate_priority(priority)
        self.tv.validate_due_date(due_date)

        with self.db.get_connection() as conn:
            cur = conn.cursor()
            self.task_repo.create_task(cur, user_id, title, description, priority, due_date)
            conn.commit()


    def get_task_by_task_id(self, task_id: int):

        with self.db.get_connection() as conn:
                cur = conn.cursor()
                task = self.task_repo.get_task_by_task_id(cur, task_id)
                return task
        
    def get_tasks_by_status_and_user_id(self, status, user_id: int):
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            tasks = self.task_repo.get_tasks_by_status_and_user_id(cur, status, user_id)
            return tasks

    def get_tasks_by_user_id(self, user_id: int):
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            tasks = self.task_repo.get_tasks_by_user_id(cur, user_id)
            return tasks

    def soft_delete_task(self, task_id: int, user_id: int):
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            self.task_repo.update_task_status(cur, task_id, user_id, STATUS_DELETED)
            conn.commit()

    def mark_task_completed(self, task_id, user_id):
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            self.task_repo.update_task_status(cur, task_id, user_id, STATUS_COMPLETED)
            conn.commit()

    def edit_task(
            self, 
            task_id: int, 
            user_id: int, 
            new_title: str, 
            new_description: str, 
            new_priority: str, 
            new_due_date: str):

        self.tv.gv.validate_id(task_id)
        self.tv.gv.validate_id(user_id)
        self.tv.validate_title(new_title)
        self.tv.validate_description(new_description)
        self.tv.validate_priority(new_priority)
        self.tv.validate_due_date(new_due_date)
        
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            self.task_repo.update_task(
                cur,
                task_id,
                user_id,
                new_title,
                new_description,
                new_priority,
                new_due_date 
            )
            conn.commit()

    def get_task_statistics(self, user_id):
        competed_count = 0
        pending_count = 0
        deleted_count = 0
        with self.db.get_connection() as conn:
            cur = conn.cursor()
            tasks = self.task_repo.get_tasks_by_user_id(cur, user_id)

            for task in tasks:
                if task.status == STATUS_COMPLETED:
                    competed_count += 1
                elif task.status == STATUS_PENDING:
                    pending_count += 1
                elif task.status == STATUS_DELETED:
                    deleted_count += 1
      
        total_count = competed_count + pending_count + deleted_count

        comleted_percent = round(self._get_percent(competed_count, total_count), 2)
        pending_percent = round(self._get_percent(pending_count, total_count), 2)
        deleted_percent = round(self._get_percent(deleted_count, total_count), 2)

        return {
            'completed-count': competed_count,
            'pending-count': pending_count,
            'deleted-count': deleted_count,
            'completed-percent': comleted_percent,
            'pending-percent': pending_percent,
            'deleted-percent': deleted_percent
            
        }