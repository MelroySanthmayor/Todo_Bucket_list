from sqlalchemy import Column, Integer, String, Boolean
from todo.database import Base

class Todo (Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    priority = Column(Integer)
    completed = Column(Boolean)

    def __init__(self, title=None, priority=None):
        self.title = title
        self.priority = priority
        self.completed = False

    def get_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'priority':self.priority,
            'completed': self.completed,

        }



