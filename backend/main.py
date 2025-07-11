from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.category_routes import router as category_router
from routes.testcase_routes import router as testcase_router
from routes.chat import router as chat_router  # ✅ Import chat router
from models.category_model import Base
from db.session import engine

app = FastAPI()

# Enable CORS so frontend can communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(category_router)
app.include_router(testcase_router)
app.include_router(chat_router)  # ✅ Register chat route
