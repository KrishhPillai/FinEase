# Finease - Finance With Ease

## Prerequisites

Make sure you have the following installed:

- Node.js (v14+)
- NPM or Yarn
- Firebase Account
- Python (for Flask backend)

## Project Structure

```
/auth-backend            # auth Backend server code
  └── /src          # Source code for backend
  └── firebaseService.json  # Firebase service configuration
  └── .env          # Environment variables for backend
/client             # Frontend - Next.js app
/ai-api-backend     # AI API Backend - Flask app (handles /mmi endpoint)
```

## Steps to Set Up the Backend

### 1. Clone the repository

### 2. Install Dependencies

For both backend and frontend, use the package manager of your choice to install all necessary dependencies:

#### Backend

In the `/auth-backend` directory, run:

```bash
npm install
# or
pnpm install
```

#### Frontend

In the `/client` directory, run:

```bash
npm install
# or
pnpm install
```

#### AI API Backend (Flask)

In the `/ai-api-backend` directory, set up a Python environment and install the required dependencies:


For Windows :-
```bash
python -m venv .venv 
.venv/Scripts/activate
pip install -r requirements.txt
```

For MacOS/Linux:-
```bash
python -m venv .venv 
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Add `firebaseService.json`

Copy the `firebaseService.json` file to the following path in your backend directory:

```
/auth-backend/src/firebaseService.json
```

### 4. Add `.env` File

Create a `.env` file in the `/auth-backend/src/` directory and add your environment variables. Rename the provided file to `.env`:

```
/auth-backend/src/.env
```

### 5. Import API Calls for Testing

You can import the provided Insomnia or Postman JSON file for API testing:

- If you're using Postman or Insomnia, simply import the JSON file provided.

### 6. API Routes

The following API routes are available for user registration, login, logout, and password reset:

- **Register User**

  ```
  POST /api/register
  ```

- **Login User**

  ```
  POST /api/login
  ```

- **Logout User**

  ```
  POST /api/logout
  ```

- **Reset Password**
  ```
  POST /api/reset-password
  ```

### 7. JSON Body for Login and Logout

For `login` and `logout` requests, use the following JSON structure:

```json
{
  "email": "example email",
  "password": "test password"
}
```

## Running the Backend

To run the backend server, use the following command:

```bash
node app.js
```

Your backend should now be up and running!

---

## Frontend Setup (Next.js)

1. Navigate to the `/client` directory.

2. Start the frontend Next.js server:

```bash
npm run dev
# or
pnpm dev
```

The frontend should now be live at `http://localhost:3000`.

### Firebase Authentication Integration

The Firebase authentication is handled in the `/auth-backend` folder. This module manages user registration, login, logout, and other authentication functionalities. It communicates with Firebase services to verify and authenticate users securely.

## AI API Backend Setup (Flask)

1. Navigate to the `/ai-api-backend` directory.

2. Ensure you have installed all Python dependencies by running:

```bash
pip install -r requirements.txt
```

3. The Flask API includes an endpoint to interact with the AI model:

- **AI Model Endpoint**  
  ```
  POST /mmi
  ```

   This endpoint will process the request and return AI-generated results. Make sure to send the appropriate data when making the POST request.

To run the Flask API, use:

```bash
python app.py
```

---

### Author

- **Krish Pillai**
- **Prabir Kalwani**
- **Snehil Sinha**
- **Aayush Shah**

