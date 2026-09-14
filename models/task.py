
from dataclasses import dataclass



class Task:
   def __init__(
         self,
         id: int,
         user_id: int,
         title: str,
         description: str,
         priority: str,
         due_date: str,
         created_at: str,
         status: str):
      self.id = id
      self.user_id = user_id
      self.title = title
      self.description = description
      self.priority = priority
      self.due_date = due_date
      self.created_at = created_at
      self.status = status