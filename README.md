# Postman akin assignment

A feature-rich API client for testing and debugging web services, built with React and Node.js.

## Overview

This project is a simplified clone of Postman that allows you to:
- Send HTTP requests (GET, POST, PUT, DELETE)
- Set request parameters (URL, headers, query params, JSON body)
- View formatted responses
- Save request history

## Project Structure

```
assignment/
├── src/                 # React frontend
│   ├── components/      # UI components
│   │   ├── headers.jsx  # Request headers component
│   │   ├── jsonBody.jsx # JSON body editor
│   │   ├── queryParams.jsx # Query parameters component
│   │   ├── requests.jsx # Main request form component
│   │   ├── response.jsx # Response display component
│   │   ├── tabs.jsx     # Tab navigation component
│   │   └── urlBar.jsx   # URL input component
│   ├── App.js           # Main app component
│   └── index.js         # React entry point
├── backend/             # Node.js backend
│   ├── src/             
│   │   ├── models/    # Database models
│   │   ├── routes/      # API endpoints
│   │   └── orm-config.js # Database configuration
│   ├── index.js         # Backend entry point
│   └── db.js            # Database utilities
└── .env                 # Environment variables
```

## Features

### Frontend
- **Request Builder**: Create and configure HTTP requests
- **Parameter Management**: Manage query parameters, headers, and JSON body
- **Response Viewer**: Display formatted responses with syntax highlighting
- **Table View**: View structured data in table format
- **Request History**: Access previous requests

### Backend
- **Request Proxy**: Forward client requests to target APIs
- **Request History**: Store and retrieve request history
- **Database**: SQLite storage for request data

## Technologies Used

- **Frontend**:
  - React
  - React Router
  - Axios
  - Tailwind CSS

- **Backend**:
  - Express.js
  - MikroORM
  - SQLite
  - Axios

## Setup and Installation

### Frontend Setup
1. Navigate to the project root directory
```bash
cd Postman-akin-Frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```
The application will be available at http://localhost:3000

### Backend Setup
1. Navigate to the backend directory
```bash
cd assignment/backend
```

2. Install dependencies
```bash
npm install
```

3. Start the backend server
```bash
npm start
```
The API will be available at http://localhost:5000

## Environment Variables

Create an `.env` file in the root directory with the following variables:
```
BACKEND_ENDPOINT=http://localhost:5000
```

For production, set this to your deployed backend URL.

## API Routes

- `POST /api/requests/send`: Send HTTP requests to external APIs
- `GET /api/history`: Get request history with pagination and filtering
- `GET /api/history/:id`: Get details of a specific request
