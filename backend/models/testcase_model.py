from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from db.base_class import Base

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    category_id = Column(String(36), ForeignKey("categories.id"))  # <-- FIXED TYPE

    category = relationship("Category", back_populates="test_cases")
