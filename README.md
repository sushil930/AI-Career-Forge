# AI Career Forge

AI Career Forge is a web application designed to assist users in optimizing their resumes and matching them with suitable job descriptions using AI.

## Features

*   **User Authentication:** Secure signup and login functionality using Firebase Authentication.
*   **Resume Upload & Parsing:** Users can upload resumes in PDF or DOCX format.
*   **AI Resume Analysis:** Provides feedback and scoring on uploaded resumes using AI (likely Google Generative AI).
*   **AI Resume Builder:** Helps users generate professional resumes based on provided information.
*   **Job Matching:** Compares user resumes (uploaded or generated) against job descriptions to assess suitability.
*   **Resume Tips:** Offers general advice and best practices for resume writing.
*   **User Dashboard:** A central place for authenticated users to manage their resumes, generate cover letters (implied by dashboard structure), and access features.

## Technologies Used

**Frontend:**

*   **Framework/Library:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **UI Components:** shadcn/ui
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **State Management/Data Fetching:** TanStack Query (React Query)
*   **API Client:** Axios
*   **Authentication:** Firebase Client SDK

**Backend:**

*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Runtime:** Node.js
*   **Authentication:** Firebase Admin SDK (for token verification)
*   **AI:** Google Generative AI SDK (`@google/generative-ai`)
*   **Database:** Firebase Firestore (Likely, used for storing user data, resume metadata, generated content, etc., often paired with Firebase Authentication)
*   **File Handling:** Multer (uploads), Mammoth (docx parsing), pdf-parse (pdf parsing)
*   **API Testing:** Jest, Supertest

## Project Structure

The project is organized into two main parts:

*   `frontend` (root directory): Contains the React application built with Vite.
    *   `src/`: Main source code.
        *   `components/`: Reusable UI components (including shadcn/ui).
        *   `pages/`: Top-level page components for different routes.
        *   `lib/`: Core utilities like API client (`api.ts`), Firebase setup (`firebase.ts`).
        *   `context/`: React context providers (e.g., `AuthContext.tsx`).
        *   `App.tsx`: Main application component defining routes.
        *   `main.tsx`: Application entry point.
*   `backend/`: Contains the Node.js/Express API server.
    *   `src/`: Main source code.
        *   `controllers/`: Request handlers containing business logic.
        *   `routes/`: Defines API endpoints and maps them to controllers.
        *   `middleware/`: Custom middleware (e.g., `auth.middleware.ts` for token verification).
        *   `config/`: Configuration files (e.g., `multer.config.ts`, Firebase Admin setup).
        *   `models/`: Contains data models/schemas (e.g., for User, Resume, JobMatchResult) likely interacting with the database.
        *   `server.ts`: Express application setup and entry point.

## Models and Database

*   **Models:** The `backend/src/models/` directory likely defines the structure of data used in the application, such as User profiles, Resume details (metadata, parsed content, analysis results), and potentially Job descriptions or Match results. These models interface with the database.
*   **Database:** While not explicitly confirmed by viewing model files, the use of Firebase Authentication strongly suggests **Firebase Firestore** as the NoSQL database. It would likely store user account information, links to uploaded resumes (stored possibly in Firebase Storage or locally), parsed resume content, analysis scores, generated resume data, and job matching results.

## User Workflow

A typical user interaction with AI Career Forge follows these steps:

1.  **Authentication:**
    *   New users sign up for an account.
    *   Existing users log in.
2.  **Resume Management (Choose one or more):
    *   **Upload & Analyze:** Upload an existing resume (PDF/DOCX). The system parses it and provides AI-driven analysis and scoring.
    *   **Build:** Use the Resume Builder feature to create a new resume from scratch or based on provided information.
3.  **Job Matching:**
    *   Provide a job description.
    *   Select an uploaded or generated resume.
    *   The system analyzes the match between the resume and the job description, providing insights.
4.  **Review & Refine:**
    *   Based on analysis and matching results, users can refine their resumes using the builder or by uploading revised versions.
    *   Access general resume tips for guidance.
5.  **(Optional) Cover Letter:** Generate cover letters (feature implied by dashboard structure).

## API Endpoints Overview

The backend exposes RESTful API endpoints, primarily authenticated using Firebase ID tokens verified by the `auth.middleware.ts`.

Key route groups under `/api`:

*   `/auth`:
    *   `POST /signup`: User registration.
    *   `POST /login`: User login.
*   `/resumes` (Requires Authentication):
    *   `GET /`: Get list of uploaded resumes for the authenticated user.
    *   `POST /upload`: Upload a resume file (`resumeFile`) for parsing and storage.
    *   `POST /:resumeId/analyze`: Trigger AI analysis for a specific uploaded resume.
*   `/builder` (Requires Authentication):
    *   `GET /generated`: Get list of resumes generated by the builder for the user.
    *   `POST /generate`: Generate a new resume based on user input.
    *   `GET /download/:generatedResumeId`: Download a specific generated resume (likely as PDF).
*   `/match` (Requires Authentication):
    *   `POST /resume-job`: Compare a user's resume (by ID or potentially text) against a provided job description.
*   `/tips`:
    *   `GET /`: Fetch general resume writing tips (currently public, may require auth later).

*(Refer to `backend/src/routes/*.routes.ts` and corresponding controllers in `backend/src/controllers/` for detailed request/response structures and logic.)*

## Getting Started

### Prerequisites

*   Node.js and npm (or Bun)
*   Firebase Project: Set up a Firebase project for Authentication.
*   Google Cloud Project: Set up a project for Google Generative AI.
*   Environment Variables: Create `.env` files in both the root and `backend` directories.

### Environment Variables

**Root Directory (`.env`):**
