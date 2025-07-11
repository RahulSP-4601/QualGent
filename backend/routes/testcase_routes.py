from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controller.testcase_controller import TestCaseCreate
from services.testcase_service import create_test_case, get_test_cases_by_category, update_test_case, delete_test_case
from db.session import get_db

router = APIRouter()

@router.post("/test-cases")
def create(case: TestCaseCreate, db: Session = Depends(get_db)):
    return create_test_case(db, case.name, case.description, case.category_id)

@router.get("/categories/{category_id}/tests")
def get_by_category(category_id: str, db: Session = Depends(get_db)):
    return get_test_cases_by_category(db, category_id)

@router.put("/test-cases/{test_id}")
def update(test_id: int, case: TestCaseCreate, db: Session = Depends(get_db)):
    return update_test_case(db, test_id, case.name, case.description, case.category_id)

@router.delete("/test-cases/{test_id}")
def delete(test_id: int, db: Session = Depends(get_db)):
    return delete_test_case(db, test_id)
