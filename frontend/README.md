# Financial Calculator Web App

## Overview
This is a full-stack, Dockerized web application that provides three interactive financial calculators, hosted on Railway. The calculators include:

Mortgage Calculator – Monthly payment breakdown
Income Tax Calculator – Estimates federal tax and effective tax rate
401(k) Retirement Calculator – Projects future retirement savings

### Live Demo
Deployed on Railway: https://calculator-application-production.up.railway.app

### Tech Stack
- Frontend: React (Next.js) + Tailwind CSS
- Backend: Python + Flask
- Charting: Chart.js via react-chartjs-2
- Containerization: Docker
- Hosting: Railway
- Port: 5001 (internal and external)

### Features
- Three calculators 
- Pie/Bar chart toggle 
- Form validation 
- Print/export support 
- Flask API handles calculations 
- Single Docker container deployment

### How to Run Locally

1. Clone the repository
```
git clone https://github.com/YOUR_USERNAME/financial-calculator.git
cd financial-calculator
```
2. Build and run with Docker
```
docker build -t financial-calculator .
docker run -p 5001:5001 financial-calculator
```

3. Access the app: http://localhost:5001


### Folder Structure
```
.
├── backend/
│   ├── main.py               # Flask app
│   └── requirements.txt      # Python deps
├── frontend/
│   ├── src/app/              # Next.js pages
│   ├── out/                  # Built static export
├── Dockerfile
```
### Project Scope
This project satisfies the "Extended Coverage" condition:
- Includes 3 financial calculators 
- Dockerized and hosted on Railway 
- Serves frontend and backend via a single container

