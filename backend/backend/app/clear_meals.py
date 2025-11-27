from app.database import SessionLocal
from app.models import Meal

# Open a database session
session = SessionLocal()

# Delete all meals
deleted_count = session.query(Meal).delete()
session.commit()
session.close()

print(f"Successfully deleted {deleted_count} meals from the database!")
