# Stage 1: Build Frontend
FROM node:18 as frontend-builder
WORKDIR /app
COPY frontend/ ./frontend
RUN cd frontend && npm install && npm run build

# Stage 2: Flask Backend + Static Frontend
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask backend
COPY backend/ ./backend

# Copy built frontend static files
COPY --from=frontend-builder /app/frontend/out ./frontend/out

# Set environment variables
ENV FLASK_APP=backend/main.py

# Expose port (for local reference)
EXPOSE 5001

# Run using Gunicorn and dynamic port from Railway
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT:-5001} backend.main:app"]