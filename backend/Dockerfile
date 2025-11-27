# Use official Python image
FROM python:3.13

# Set the working directory inside the container
WORKDIR /app

# Copy the FastAPI project files into the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (should match your FastAPI app)
EXPOSE 8080

# Start the FastAPI app using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]