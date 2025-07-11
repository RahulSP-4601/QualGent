from models.category_model import Category
from sqlalchemy.orm import Session
from fastapi import HTTPException

def create_category(db: Session, name: str):
    category = Category(name=name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def get_categories(db: Session):
    return db.query(Category).all()

def update_category(db: Session, category_id: str, name: str):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category.name = name
    db.commit()
    db.refresh(category)
    return category

def delete_category(db: Session, category_id: str):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}

