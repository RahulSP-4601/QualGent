from pydantic import BaseModel

class TestCaseCreate(BaseModel):
    name: str
    description: str
    category_id: str  # FIXED: int, not str
