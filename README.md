# TechStaffHub – HR Management System (HRMS)

## Project Overview
**TechStaffHub** is a web-based Human Resource Management System designed to centralize HR operations, automate attendance tracking, provide employee self-service capabilities, and support HR decision-making through dashboards and controlled access. The system improves efficiency, reduces manual workload, and ensures secure handling of employee information through role-based access control.

## Key Features

**Module 1 – User Authentication & Access Control**
- Secure login with encrypted credentials
- Role-based access control (RBAC)
- Password recovery

**Module 2 – Employee Records Management**
- Add employee record
- Manage employee profile

**Module 3 – Employee Self-Service Portal**
- View attendance
- View leave balances
- Submit leave requests
- View announcements

**Module 4 – Attendance Tracking**
- Automated time-in/time-out
- Manual adjustment requests (HR Approval)
- Attendance summaries

**Module 5 – HR Dashboard**
- Approve/reject leave requests
- Generate announcements
- AI resume summarization
- Job application processing

## User Types

| User Type             | Role        | Privileges                               |
|-----------------------|-------------|------------------------------------------|
| HR Staff              | Supervisor  | Full access to HR records                |
| Employee              | Staff       | View Attendance, leave, submit requests  | 
| Administrator (IT)    | IT Staff    | Manage configurations and users          |

## System Architecture

**Frontend:**
- ReactJS
- Tailwind CSS

**Backend:**
- Java Spring Boot

**Database:**
- PostgreSQL

**APIs:**
- REST API
- HTTPS secure communication

## Tech Stack & Versions

| Component          | Version |
|--------------------|---------|
| ReactJS            | 19.2.1  |
| Tailwind CSS       | 4.1.10  |
| Java Spring Boot   | 21      |
| PostgreSQL         | 18      |

## Deployment Instructions

TechStaffHub uses a split deployment architecture with the frontend hosted on Vercel and the backend hosted on Render. Both services are connected to GitHub repositories for automated continuous deployment.

### Deployment Architechture

- **Frontend (ReactJS)**:  Deployed on Vercel
- **Backend (Spring Boot API)**: Deployed on Render using Docker
- **Database (PostgreSQL)**: Hosted on Render's PostgreSQL service

### Deployment Workflow
**Step 1: GitHub Repository Setup**

1. Create two GitHub repositories (or use a monorepo structure): 
    - Frontend Repository: Contains the ReactJS application
    - Backend Repository: Contains the Spring Boot application with Dockerfile
2.	Ensure your code is pushed to the main branch of each repository

**Step 2: Backend Deployment on Render**

1.	Create a Render Account 
    -	Sign up at render.com
    -	Connect your GitHub account to Render
2.	Create PostgreSQL Database 
    -	Go to Render Dashboard
    -	Click "New +" → Select "PostgreSQL"
    -	Configure database settings and create
    -	Save the generated DATABASE_URL from the database info page
3.	Deploy Backend Service
    -	Click "New +" → Select "Web Service"
    -	Connect to your backend GitHub repository
    -	Configure the service: 
      -	Name: techstaffhub-backend (or your preferred name)
      -	Region: Select closest to your users
      -	Branch: main
      -	Root Directory: Leave empty (or specify if backend is in subdirectory)
      -	Runtime: Docker
      -	Dockerfile Path: ./Dockerfile (or path to your Dockerfile)
      -	Instance Type: Choose based on needs (Free tier available)
4.	Configure Environment Variables 
    -	In the service settings, go to "Environment" section
    -	Add the following environment variables: 
      -	DATABASE_URL: PostgreSQL connection 
      -	DB_USERNAME: Database username
      -	DB_PASSWORD: Database password
      -	anthropic.api.key: Your Anthropic API key
      -	BREVO_API_KEY: Email service API key
      -	BREVO_USERNAME: Email service username
      -	BREVO_PASSWORD: Email service password
      -	FRONTEND_URL: (Will add after Vercel deployment)
      -	JWT_SECRET_KEY: Your JWT secret key
5.	Deploy 
    -	Click "Create Web Service"
    -	Render will automatically: 
      -	Pull code from GitHub
      -	Build Docker image using your Dockerfile
      -	Deploy the container
      -	Generate a public URL
      -	Save this backend URL for frontend configuration
6.	Enable Auto-Deploy 
    -	In service settings, ensure "Auto-Deploy" is enabled
    -	Any push to the main branch will trigger automatic redeployment

**Step 3: Frontend Deployment on Vercel**

1.	Create a Vercel Account 

    -	Sign up at vercel.com
    -	Connect your GitHub account to Vercel
2.	Import Frontend Project 
    -	Click "Add New..." → "Project"
    -	Select your frontend GitHub repository
    -	Click "Import"
3.	Configure Project Settings 
    -	Framework Preset: Vite (or Create React App, depending on your setup)
    -	Root Directory: Leave as default (or specify if different)
    -	Build Command: npm run build (default)
    -	Install Command: npm install (default)
4.	Configure Environment Variables 
    -	In project settings, add environment variables: 
      -	VITE_API_URL: Your Render backend 
      -	Add any other frontend environment variables needed

5.	Deploy 
    -	Click "Deploy"
    -	Vercel will automatically: 
      -	Pull code from GitHub
      -	Install dependencies
      -	Build the React application
      -	Deploy to Vercel's CDN
      -	Generate a production URL
6.	Enable Auto-Deploy 

    -	By default, Vercel automatically deploys: 
      -	Production deployments from main branch
      -	Preview deployments from pull request




### Advantages of This Deployment Setup
- Fully automated deployment pipeline
- Zero manual server maintenance
- Scalable and containerized environment
- Consistent builds via Docker
- Secure handling of environment variables

#### Live Demo URL:
https://capstone-hrms.vercel.app/

## Dummy Accounts

| Role     | Username         | Password   |
|----------|------------------|------------|
| Employee | dummy.EMPLOYEE   | Welcome1!  |
| HR       | dummy.HR         | Welcome1!  |

## Core Workflows
1. Employee Onboarding
2. Leave Request Workflow
3. Attendance Tracing
4. Payroll Preparation Support
5. Recruitment Management
6. Performance Appraisal Workflow

---

