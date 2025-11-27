from database import engine  # Adjust the import to your engine
from models import Base     # Make sure Base includes your Order model

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Tables created!")
