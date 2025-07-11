from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from controller.category_controller import CategoryCreate
from services.category_service import (
    create_category,
    get_categories,
    update_category,
    delete_category
)
from db.session import get_db

router = APIRouter()

@router.post("/categories")
def create_new_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, category.name)

@router.get("/categories")
def fetch_all_categories(db: Session = Depends(get_db)):
    return get_categories(db)

@router.put("/categories/{category_id}")
def update_existing_category(category_id: str, category: CategoryCreate, db: Session = Depends(get_db)):
    return update_category(db, category_id, category.name)

@router.delete("/categories/{category_id}")
def delete_existing_category(category_id: str, db: Session = Depends(get_db)):
    return delete_category(db, category_id)
