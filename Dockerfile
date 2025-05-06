# Stage 1: Build Frontend
FROM node:18 as frontend-builder
WORKDIR /app
COPY frontend/ ./frontend
RUN cd frontend && npm install && npm run build

# Stage 2: Flask Backend + Static Frontend
FROM python:3.10-slim

WORKDIR /app

# Install Flask + dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy Flask backend
COPY backend/ ./backend

# Copy built frontend static files
COPY --from=frontend-builder /app/frontend/out ./frontend/out

# Flask will serve the frontend
ENV FLASK_APP=backend/main.py
EXPOSE 5001

CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
