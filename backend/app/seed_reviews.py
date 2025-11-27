import psycopg2
import random
from faker import Faker
from datetime import datetime, UTC
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal, engine
from app.models import Review

session = SessionLocal()
faker = Faker()

# Get actual user IDs from the database
users = session.execute(text("SELECT id FROM users")).fetchall()
user_ids = [str(user[0]) for user in users]

# Get actual meal IDs from the database
meals = session.execute(text("SELECT id FROM meals")).fetchall()
meal_ids = [int(meal[0]) for meal in meals]

print(f"Found {len(user_ids)} users and {len(meal_ids)} meals in database")

# Create fake reviews
def seed_reviews(n=100):
    if not user_ids or not meal_ids:
        print("❌ No users or meals found. Please seed users and meals first.")
        return
    
    reviews = []
    for _ in range(n):
        review = Review(
            reviewer_id=random.choice(user_ids),  # Random user as reviewer
            chef_id=random.choice(user_ids),      # Random user as chef
            meal_id=random.choice(meal_ids),
            rating=random.randint(3, 5),
            review_text=faker.sentence(nb_words=12),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )
        reviews.append(review)

    session.add_all(reviews)
    session.commit()
    print(f"✅ Inserted {n} reviews.")

if __name__ == "__main__":
    seed_reviews(100)
    session.close()
