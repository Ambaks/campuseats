from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Meal, User
from datetime import datetime

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Open a database session
session = SessionLocal()

# Fetch actual chef user IDs from the database
chef_users = {}
for username in ["Chef Marco", "Chef Yuki", "Chef Sofia", "Chef Arjun", "Chef Pierre", "Chef Anong"]:
    user = session.query(User).filter_by(username=username).first()
    if user:
        chef_users[username] = user.id
    else:
        print(f"Warning: User '{username}' not found in database. Please run seed_user_data.py first.")
        session.close()
        exit(1)

# Dummy meal data near University of the Cumberlands
meals_data = [
    {
        "name": "Spaghetti Carbonara",
        "description": "Classic Italian pasta with eggs, cheese, pancetta, and pepper.",
        "ingredients": "Spaghetti, eggs, pancetta, parmesan, black pepper",
        "price": 12.99,
        "image_url": "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2942&auto=format&fit=crop",
        "latitude": 36.7421,
        "longitude": -84.1655,
        "seller_id": chef_users["Chef Marco"],
        "timeslots": [{"start": "12:00", "end": "13:00"}, {"start": "18:00", "end": "19:00"}],
        "quantity": 10,
    },
    {
        "name": "Sushi Platter",
        "description": "Assorted fresh sushi rolls: tuna, salmon, avocado.",
        "ingredients": "Rice, seaweed, tuna, salmon, avocado, soy sauce, wasabi",
        "price": 18.50,
        "image_url": "https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=3174&auto=format&fit=crop",
        "latitude": 36.7448,
        "longitude": -84.1598,
        "seller_id": chef_users["Chef Yuki"],
        "timeslots": [{"start": "13:00", "end": "14:00"}, {"start": "19:00", "end": "20:00"}],
        "quantity": 15,
    },
    {
        "name": "Tacos al Pastor",
        "description": "Marinated pork tacos with pineapple, onions, and cilantro.",
        "ingredients": "Pork, pineapple, onions, cilantro, corn tortillas, spices",
        "price": 10.75,
        "image_url": "https://plus.unsplash.com/premium_photo-1681406994504-44743ccdfdd3?q=80&w=3087&auto=format&fit=crop",
        "latitude": 36.7315,
        "longitude": -84.1682,
        "seller_id": chef_users["Chef Sofia"],
        "timeslots": [{"start": "12:00", "end": "13:00"}, {"start": "18:00", "end": "19:00"}],
        "quantity": 20,
    },
    {
        "name": "Butter Chicken",
        "description": "Creamy, mildly spiced butter chicken with naan bread.",
        "ingredients": "Chicken, tomato puree, cream, butter, garlic, ginger, spices",
        "price": 15.75,
        "image_url": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=3084&auto=format&fit=crop",
        "latitude": 36.7395,
        "longitude": -84.1548,
        "seller_id": chef_users["Chef Arjun"],
        "timeslots": [{"start": "13:00", "end": "14:00"}, {"start": "19:00", "end": "20:00"}],
        "quantity": 12,
    },
    {
        "name": "Beef Bourguignon",
        "description": "French stew with tender beef, red wine, mushrooms, and carrots.",
        "ingredients": "Beef, red wine, mushrooms, carrots, onions, garlic, herbs",
        "price": 22.49,
        "image_url": "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/boeuf_bourguignon_25475_16x9.jpg",
        "latitude": 36.7501,
        "longitude": -84.1615,
        "seller_id": chef_users["Chef Pierre"],
        "timeslots": [{"start": "12:00", "end": "13:00"}, {"start": "18:00", "end": "19:00"}],
        "quantity": 8,
    },
    {
        "name": "Pad Thai",
        "description": "Thai stir-fried noodles with shrimp, peanuts, and bean sprouts.",
        "ingredients": "Rice noodles, shrimp, peanuts, bean sprouts, tamarind, eggs, tofu",
        "price": 14.25,
        "image_url": "https://plus.unsplash.com/premium_photo-1664472637341-3ec829d1f4df?q=80&w=3125&auto=format&fit=crop",
        "latitude": 36.7289,
        "longitude": -84.1575,
        "seller_id": chef_users["Chef Anong"],
        "timeslots": [{"start": "13:00", "end": "14:00"}, {"start": "19:00", "end": "20:00"}],
        "quantity": 18,
    },
    {
        "name": "Cassoulet Toulousain",
        "description": "Traditional slow-cooked casserole with white beans, duck confit, and sausage.",
        "ingredients": "White beans, duck confit, Toulouse sausage, pork, garlic, herbs",
        "price": 19.90,
        "image_url": "https://img-3.journaldesfemmes.fr/x2LrpniUv-bQGJDfCE0MEH4t6I0=/750x500/dae4aa0edb714213bdac3963fb1fb7a5/ccmcms-jdf/40014153.jpg",
        "latitude": 36.7458,
        "longitude": -84.1712,
        "seller_id": chef_users["Chef Anong"],
        "timeslots": [{"start": "12:00", "end": "14:00"}, {"start": "18:00", "end": "20:00"}],
        "quantity": 10,
    },
    {
        "name": "Ratatouille",
        "description": "Provençal stewed vegetable dish with tomatoes, zucchini, and eggplant.",
        "ingredients": "Tomatoes, zucchini, eggplant, bell peppers, onions, garlic, herbs",
        "price": 11.50,
        "image_url": "https://plus.unsplash.com/premium_photo-1713635953194-ab8a625b2477?q=80&w=3005&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "latitude": 36.7505,
        "longitude": -84.1523,
        "seller_id": chef_users["Chef Pierre"],
        "timeslots": [{"start": "12:00", "end": "13:30"}, {"start": "18:30", "end": "20:00"}],
        "quantity": 15,
    },
    {
        "name": "Croque Monsieur",
        "description": "Grilled ham and cheese sandwich with béchamel sauce.",
        "ingredients": "Bread, ham, cheese, béchamel sauce, butter",
        "price": 8.75,
        "image_url": "https://assets.afcdn.com/recipe/20170112/28965_w1024h1024c1cx1500cy1000.jpg",
        "latitude": 36.7328,
        "longitude": -84.1745,
        "seller_id": chef_users["Chef Arjun"],
        "timeslots": [{"start": "11:30", "end": "13:00"}, {"start": "17:30", "end": "19:00"}],
        "quantity": 25,
    },
    {
        "name": "Quiche Lorraine",
        "description": "Savory pie with bacon, cheese, and a creamy egg filling.",
        "ingredients": "Pastry crust, eggs, cream, bacon, cheese, nutmeg",
        "price": 9.50,
        "image_url": "https://images.unsplash.com/photo-1701197159530-80a188e34dfc?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "latitude": 36.7265,
        "longitude": -84.1608,
        "seller_id": chef_users["Chef Yuki"],
        "timeslots": [{"start": "12:00", "end": "13:30"}, {"start": "18:00", "end": "19:30"}],
        "quantity": 12,
    },
    {
        "name": "Bouillabaisse",
        "description": "Traditional Provençal fish stew with saffron and herbs.",
        "ingredients": "Assorted fish, shellfish, saffron, tomatoes, onions, garlic, herbs",
        "price": 24.00,
        "image_url": "https://www.google.com/url?sa=i&url=https%3A%2F%2Frecettesdeluxe.com%2Fbouillabaisse-recette-traditionnelle%2F&psig=AOvVaw2EB4sl5Flkrsh0JqSro889&ust=1747240363374000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCJ1NvvoI0DFQAAAAAdAAAAABAE",
        "latitude": 36.7241,
        "longitude": -84.1692,
        "seller_id": chef_users["Chef Yuki"],
        "timeslots": [{"start": "12:30", "end": "14:00"}, {"start": "19:00", "end": "20:30"}],
        "quantity": 6,
    },
    {
        "name": "Coq au Vin",
        "description": "Chicken braised with wine, lardons, mushrooms, and garlic.",
        "ingredients": "Chicken, red wine, bacon, mushrooms, onions, garlic, herbs",
        "price": 18.75,
        "image_url": "https://img.cuisineaz.com/400x300/2022/06/20/i184314-shutterstock-1264195879.webp",
        "latitude": 36.7485,
        "longitude": -84.1642,
        "seller_id": chef_users["Chef Marco"],
        "timeslots": [{"start": "12:00", "end": "13:30"}, {"start": "18:30", "end": "20:00"}],
        "quantity": 10,
    },
]
# Add 'unlimited': True to each meal
for meal in meals_data:
    meal["unlimited"] = True


# Insert meals into the database
for meal in meals_data:
    # Create a new Meal instance. The created_at column is automatically set by default.
    new_meal = Meal(**meal)
    session.add(new_meal)

session.commit()
session.close()
print("Meals successfully seeded into PostgreSQL!")
