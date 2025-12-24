# Health Care System

## Project Overview

This is a full-stack Incident Management System built with **React** for the frontend and **Node.js** with **Express** for the backend, using **PostgreSQL (Supabase)** as the database.

The system allows staff to create and view incidents, while administrators can view, update, and track incidents along with audit logs.

It supports:
- Staff dashboard with incident creation and viewing
- Admin dashboard with incident management, filtering, and audit logs
- Reusable IncidentTable component with optional filtering and extra actions

--------------------------------------------------

## Architecture

Root  
├─ frontend  
│  ├─ src  
│  │  ├─ components  
│  │  │  ├─ IncidentTable  
│  │  │  ├─ IncidentForm  
│  │  │  ├─ AuditLogs  
│  │  │  └─ Header  
│  │  ├─ pages  
│  │  │  ├─ StaffDashboard  
│  │  │  ├─ AdminDashboard  
│  │  │  └─ Login  
│  │  └─ api  
│  │     └─ api.js  
│  └─ package.json  
├─ backend  
│  ├─ db  
│  │  └─ index (PostgreSQL connection setup)  
│  ├─ routes  
│  │  ├─ adminRouter  
│  │  ├─ staffRouter  
│  │  └─ authorization (common routes such as register and login)  
│  ├─ middlewares  
│  └─ package.json  
└─ .gitignore  

--------------------------------------------------

## Frontend

- React with Bootstrap for styling
- Reusable components
  - IncidentTable used in both Admin and Staff dashboards
  - AuditLogs modal
  - Header component
- API integration via a centralized api.js file

--------------------------------------------------

## Backend

- Node.js with Express
- RESTful API endpoints
  - /login for user authentication
  - /staff/incidents for staff incident creation and viewing
  - /admin/incidents for admin CRUD operations with filtering and audit logs

--------------------------------------------------

## Features

- User authentication
- Staff features
  - Create incidents
  - View their own incidents
- Admin features
  - View all incidents
  - Update incident status and notes
  - View audit logs for each incident
  - Filter incidents by status, severity, and reported_by
- Reusable and flexible IncidentTable component

--------------------------------------------------

## Setup Instructions

### Step 1: Clone the repository

git clone <repo-url>  
cd <repo-folder>  

### Step 2: Install dependencies

Frontend  
cd frontend  
npm install  

Backend  
cd backend  
npm install  

### Step 3: Set environment variables

Create `.env` files in both frontend and backend directories.

Backend environment variables (backend/.env)

PORT=  
DATABASE_URL=postgresql_url  
JWT_SECRET=your_jwt_secret  

Frontend environment variables (frontend/.env)

VITE_BASE_URL=your_local_api_url  

### Step 4: Run the applications

Backend  
cd backend  
npm run dev  

Frontend  
cd frontend  
npm run dev  

--------------------------------------------------

## Assumptions

- JWT-based authentication is implemented and stored in localStorage
- Admin and staff roles are predefined in the backend
- Audit logs are linked to incidents and track updates such as status changes and notes
- Incident severity values include low, medium, and high

--------------------------------------------------

## Future Improvements

- Improved UI and UX, including responsive design and dark mode
- Email or in-app notifications for incident updates
- Advanced search and multi-field filtering
- Unit and integration testing for both frontend and backend
- Toast notifications for confirmations and alerts
- Admin functionality to create new staff users and manage staff accounts, including deletion and login activity tracking
