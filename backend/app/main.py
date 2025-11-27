from fastapi import FastAPI, Request
from app.database import engine, Base
from app import endpoints
from app.routes import payments
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
import logging
import time

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers, including Authorization
)

# Middleware to log requests & responses
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        logging.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.2f}s")
        return response

app.add_middleware(LoggingMiddleware)

# Include API routes
app.include_router(endpoints.router)
app.include_router(payments.router)



@app.get("/")
def read_root():
    return {"message": "Welcome to CampusEats API!"}

