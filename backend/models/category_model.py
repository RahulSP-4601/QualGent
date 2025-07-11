from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from db.base_class import Base  # ✅ Keep this
import uuid
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    test_cases = relationship("TestCase", back_populates="category", cascade="all, delete")
