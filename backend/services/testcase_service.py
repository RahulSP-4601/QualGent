from models.testcase_model import TestCase
from sqlalchemy.orm import Session
from fastapi import HTTPException

def create_test_case(db: Session, name: str, description: str, category_id: str):  # ✅ category_id is str here
    test_case = TestCase(name=name, description=description, category_id=category_id)
    db.add(test_case)
    db.commit()
    db.refresh(test_case)
    return test_case

def get_test_cases_by_category(db: Session, category_id: str):
    return db.query(TestCase).filter(TestCase.category_id == category_id).all()

def update_test_case(db: Session, test_id: int, name: str, description: str, category_id: str):
    test = db.query(TestCase).filter(TestCase.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test case not found")
    test.name = name
    test.description = description
    test.category_id = category_id
    db.commit()
    db.refresh(test)
    return test

def delete_test_case(db: Session, test_id: int):
    test = db.query(TestCase).filter(TestCase.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test case not found")
    db.delete(test)
    db.commit()
    return {"message": "Test case deleted successfully"}
