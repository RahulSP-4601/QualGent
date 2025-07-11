from session import get_db

db = next(get_db())
print("✅ Connected to MySQL successfully!")
