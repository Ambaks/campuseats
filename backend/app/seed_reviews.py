import psycopg2
import random
from faker import Faker
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Review

session = SessionLocal()
faker = Faker()

# Seller (chef) UUIDs
chefs = [
    "8b97cc9b-0a64-45f3-8fa1-eadb10882a2a",  # Marco
    "855a00cc-9702-47a9-9e23-a4039b62fafa",  # Yuki
    "3d754fbe-d4f7-47b4-90f0-6bd3b69b0da7",  # Sofia
    "52acac78-76ea-4238-b485-aba58da0068d",  # Arjun
    "251f8a82-37d9-4703-9e71-62bc16d0670b",  # Pierre
    "12597832-b865-4299-b671-8d9c0f6c04cb",  # Anong
]

# Buyer UUIDs
buyers = [
    "fh8agntNKVM0RjpMYnvjVPqRwsW2",
    "X6sFJ58SGUc8rMBKbEHVmQzQIlF2",
    "ODft1AAmnIZnCce7oRAnqnqxWjH2",
    "rcclTRbhEMgS6jbjVu6Htd9e3vI3",
    "AzWczRMEt0MhZXDbiNzke3fZOzf1",
    "TVQJWFd9yzWLwiqH2SYQG3YRll63"
]

# Meal IDs from your table
meal_ids = [54, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]

# Create fake reviews
def seed_reviews(n=100):
    reviews = []
    for _ in range(n):
        review = Review(
            reviewer_id=random.choice(buyers),
            chef_id=random.choice(chefs),
            meal_id=random.choice(meal_ids),        # <-- Random meal assigned here
            rating=random.randint(3, 5),
            review_text=faker.sentence(nb_words=12),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        reviews.append(review)

    session.add_all(reviews)
    session.commit()
    print(f"✅ Inserted {n} reviews.")

if __name__ == "__main__":
    seed_reviews(100)
    session.close()
