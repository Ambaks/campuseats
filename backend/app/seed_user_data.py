from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, User
import uuid

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Dummy chef data with first and last names
chefs_data = [
    {
        "first_name": "Marco",
        "last_name": "Rossi",
        "username": "Chef Marco",
        "profile_picture": "https://source.unsplash.com/featured/?chef,man",
        "rating": "4.3 (387)",
    },
    {
        "first_name": "Yuki",
        "last_name": "Tanaka",
        "username": "Chef Yuki",
        "profile_picture": "https://source.unsplash.com/featured/?chef,woman",
        "rating": "5.0 (3)",
    },
    {
        "first_name": "Sofia",
        "last_name": "Martinez",
        "username": "Chef Sofia",
        "profile_picture": "https://source.unsplash.com/featured/?chef",
        "rating": "4.7 (14)",
    },
    {
        "first_name": "Arjun",
        "last_name": "Patel",
        "username": "Chef Arjun",
        "profile_picture": "https://source.unsplash.com/featured/?chef,man",
        "rating": "4.8 (135)",
    },
    {
        "first_name": "Pierre",
        "last_name": "Dubois",
        "username": "Chef Pierre",
        "profile_picture": "https://source.unsplash.com/featured/?chef,man",
        "rating": "4.9 (53)",
    },
    {
        "first_name": "Anong",
        "last_name": "Sukjai",
        "username": "Chef Anong",
        "profile_picture": "https://www.shutterstock.com/image-photo/young-beautiful-asian-woman-chef-600nw-2317761803.jpg",
        "rating": "4.8 (22)",
    },
]

# Open a database session
session = SessionLocal()

# Create or update users in the database
for chef in chefs_data:
    user = session.query(User).filter_by(username=chef["username"]).first()
    if user:
        # Update existing user
        user.email = f"{chef['first_name'].replace('.', '')}@example.com",
        user.first_name = chef["first_name"]
        user.last_name = chef["last_name"]
        user.profile_picture = chef["profile_picture"]
        user.rating = chef["rating"]
    else:
        # Create new user
        user = User(
            id=str(uuid.uuid4()),
            email=f"{chef['first_name'].replace('.', '')}@example.com",
            username=chef["username"],
            first_name=chef["first_name"],
            last_name=chef["last_name"],
            profile_picture=chef["profile_picture"],
            rating=chef["rating"],
            role="seller",
            is_verified=False,
        )
        session.add(user)

session.commit()
session.close()
print("Users successfully seeded or updated in PostgreSQL!")
