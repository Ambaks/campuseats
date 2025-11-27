from fastapi import FastAPI, Request
from app.database import engine, Base
from app import endpoints
from app.routes import payments
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusEats API",
    description="A peer-to-peer food marketplace platform for campus communities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up logging
logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# CORS Configuration
# Get allowed origins from environment variable, default to localhost for development
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    FRONTEND_URL,
    "http://localhost:3000",  # Development frontend
    "http://127.0.0.1:3000",  # Alternative localhost
]

# Add production URL if set
PRODUCTION_URL = os.getenv("PRODUCTION_URL")
if PRODUCTION_URL:
    allowed_origins.append(PRODUCTION_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Middleware to log requests & responses
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logging.info(f"Incoming request: {request.method} {request.url}")
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log response
            logging.info(
                f"{request.method} {request.url.path} - "
                f"Status: {response.status_code} - "
                f"Duration: {process_time:.3f}s"
            )
            
            return response
        except Exception as e:
            logging.error(f"Request failed: {request.method} {request.url.path} - Error: {str(e)}")
            raise

app.add_middleware(LoggingMiddleware)

# Include API routes
app.include_router(endpoints.router)
app.include_router(payments.router)

@app.get("/")
def read_root():
    """Root endpoint - API health check"""
    return {
        "message": "Welcome to CampusEats API!",
        "status": "healthy",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "campuseats-api"
    }
