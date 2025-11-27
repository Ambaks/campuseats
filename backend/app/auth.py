from fastapi import Depends, HTTPException, UploadFile
from firebase_admin import auth, storage  , credentials
import uuid
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
import firebase_admin

# Initialize the Firebase Admin SDK with your service account credentials.
cred = credentials.Certificate("/Users/naiahoard/Desktop/CampusEats_MVP/backend/campuseats-bf7cc-firebase-adminsdk-fbsvc-07e06423b7.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'campuseats-bf7cc.firebasestorage.app'
})

security = HTTPBearer()

def verify_token(token: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase token and return decoded token data."""
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_user(
    token_data: dict = Depends(verify_token), 
    db: Session = Depends(get_db)
) -> User:
    """Retrieve the current authenticated user from the database."""
    user = db.query(User).filter(User.id == token_data["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def upload_image_and_get_url(image: UploadFile) -> str:

    print("Uploading image:", image.filename)
    # Generate a unique file name
    file_extension = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"

    # Upload to Firebase Storage
    bucket = storage.bucket()
    blob = bucket.blob(f"meals/{filename}")
    blob.upload_from_file(image.file, content_type=image.content_type)

    # Make the file publicly accessible
    blob.make_public()

    # Return the public URL
    return blob.public_url
