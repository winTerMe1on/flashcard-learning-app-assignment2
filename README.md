# Flashcard Learning App

## Project Overview

Flashcard Learning App is a single-page flashcard learning platform built for Assignment 2. The app helps students organise study content into decks, create flashcards, reveal answers while studying, and track their learning history.

The real-world problem is that students often keep revision questions, answers, and progress records in separate places. Flashcard Learning App puts these features into one web application so revision is easier to manage and demonstrate.

The application uses a React frontend, an Express backend, and MongoDB Atlas for database storage.

## Main Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT authentication
- User role system with `user` and `admin`
- Protected routes for logged-in users
- Deck create, read, update, and delete
- Flashcard create, read, update, and delete
- Flashcards linked to decks and users
- Live flashcard search by question or answer
- Reveal and hide flashcard answers
- Learning history recording when an answer is revealed
- Admin panel to view all users' learning history
- Responsive modern dashboard UI
- Single-page application behaviour on the frontend

## Tech Stack

| Area | Technology Used |
| :--- | :--- |
| Frontend | React + Vite |
| Styling | CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT + bcryptjs |
| Development tools | Nodemon and Vite |

## Database Design and Entities

The project uses four main database entities.

### User

Stores account information for registered users.

Main fields:

- `name`
- `email`
- `password`
- `role`

The password is hashed before being saved. The role can be `user` or `admin`.

### Deck

Stores a study topic or collection of flashcards.

Main fields:

- `title`
- `description`
- `owner`
- timestamps

Each deck belongs to one user.

### Flashcard

Stores each question and answer card.

Main fields:

- `question`
- `answer`
- `owner`
- `deck`
- `difficulty`
- timestamps

Each flashcard belongs to one user and one deck.

### LearningHistory

Stores learning actions performed by users.

Main fields:

- `user`
- `flashcard`
- `deck`
- `action`
- `viewedAt`
- timestamps

When a user reveals a flashcard answer, the frontend sends a request to record a learning history event.

## Folder Structure

```text
Assignment 2/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Layout.jsx
|   |   |   |-- ProtectedRoute.jsx
|   |   |-- context/
|   |   |   |-- AuthContext.jsx
|   |   |-- pages/
|   |   |   |-- Login.jsx
|   |   |   |-- Register.jsx
|   |   |   |-- Dashboard.jsx
|   |   |   |-- Decks.jsx
|   |   |   |-- Flashcards.jsx
|   |   |   |-- History.jsx
|   |   |   |-- AdminPanel.jsx
|   |   |-- services/
|   |   |   |-- api.js
|   |   |   |-- authApi.js
|   |   |   |-- deckApi.js
|   |   |   |-- flashcardApi.js
|   |   |   |-- historyApi.js
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- index.css
|   |   |-- main.jsx
|   |-- package.json
|
|-- server/
|   |-- config/
|   |   |-- db.js
|   |-- middleware/
|   |   |-- authMiddleware.js
|   |-- models/
|   |   |-- User.js
|   |   |-- Deck.js
|   |   |-- Flashcard.js
|   |   |-- LearningHistory.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- deckRoutes.js
|   |   |-- flashcardRoutes.js
|   |   |-- historyRoutes.js
|   |-- .env.example
|   |-- index.js
|   |-- package.json
|
|-- README.md
```

## Environment Variables

Create a `server/.env` file before running the backend.

Use `server/.env.example` as a guide. The values below are examples only:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/flashcard_app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace_with_a_long_random_secret
```

Do not upload the real `.env` file. It should contain private database details and the JWT secret.

| Variable | Purpose |
| :--- | :--- |
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

## How to Run the Backend

Open PowerShell:

```powershell
cd "D:\UTS\32516 Internet Programming\Assignment 2\server"
npm install
npm run dev
```

The backend normally runs on:

```text
http://localhost:5000
```

## How to Run the Frontend

Open another PowerShell window:

```powershell
cd "D:\UTS\32516 Internet Programming\Assignment 2\client"
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

The frontend uses Vite proxy settings to send `/api` requests to the backend.

## API Overview

| Area | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| Authentication | POST | `/api/auth/register` | Register a new user |
| Authentication | POST | `/api/auth/login` | Login and receive a JWT |
| Authentication | GET | `/api/auth/me` | Get the logged-in user |
| Decks | GET | `/api/decks` | Get the user's decks |
| Decks | POST | `/api/decks` | Create a new deck |
| Decks | GET | `/api/decks/:id` | Get one deck |
| Decks | PUT | `/api/decks/:id` | Update a deck |
| Decks | DELETE | `/api/decks/:id` | Delete a deck |
| Flashcards | GET | `/api/flashcards` | Get flashcards |
| Flashcards | POST | `/api/flashcards` | Create a flashcard |
| Flashcards | GET | `/api/flashcards/:id` | Get one flashcard |
| Flashcards | PUT | `/api/flashcards/:id` | Update a flashcard |
| Flashcards | DELETE | `/api/flashcards/:id` | Delete a flashcard |
| Learning History | POST | `/api/history` | Record a learning action |
| Learning History | GET | `/api/history/me` | Get the logged-in user's history |
| Learning History | GET | `/api/history/admin` | Admin only: get all users' history |

## Security Notes

- Passwords are hashed using `bcryptjs` before being stored.
- JWT is used to authenticate protected backend routes.
- The frontend stores the JWT in `localStorage` for this assignment demo.
- Backend middleware checks `Authorization: Bearer <token>`.
- Normal users can only access their own decks, flashcards, and learning history.
- Admin users can view all learning history through the admin endpoint.
- Credentials and secrets are not hardcoded in the application code.
- The real `.env` file should not be uploaded to GitHub or submitted publicly.
- `.env.example` is provided only as a template.

## Workload Allocation

This assignment was completed individually.

| Student Name | Student ID | Responsibility |
| :--- | :--- | :--- |
| Yu Xue | 25937133 | Designed, implemented, tested, and documented the complete Flashcard Learning App. |

| Area | Work Completed |
| :--- | :--- |
| Project planning | Chose the Flashcard Learning App topic and designed the main workflow, including registration, deck management, flashcard study, learning history, and admin review. |
| Frontend development | Built the React + Vite single-page application, including login/register pages, dashboard, deck page, flashcard page, learning history page, admin panel, navigation layout, responsive UI, loading states, error messages, and polished styling. |
| Backend development | Built the Node.js + Express backend API, including authentication routes, deck routes, flashcard routes, learning history routes, middleware, and server configuration. |
| Database design | Designed and implemented MongoDB/Mongoose models for User, Deck, Flashcard, and LearningHistory, including relationships between users, decks, flashcards, and study records. |
| Authentication and security | Implemented password hashing with bcryptjs, JWT-based authentication, protected routes, admin-only access control, .env usage, and .gitignore protection for sensitive files. |
| CRUD functionality | Implemented and tested CRUD operations for decks and flashcards, including ownership checks so normal users can only manage their own data. |
| Learning history and admin feature | Implemented history recording when users reveal flashcard answers, user history display, and admin viewing of all users' learning history. |
| Testing and debugging | Tested user registration, login, deck CRUD, flashcard CRUD, search, answer reveal, learning history, admin panel, and GitHub submission setup. |
| Documentation and submission | Wrote the README file, database export file, setup instructions, API overview, security notes, demo flow, and GitHub repository preparation. |

## Demo Flow

1. Start the backend server.
2. Start the frontend Vite app.
3. Register a new user account.
4. Login and view the dashboard.
5. Create a deck, such as "JavaScript Basics".
6. Create flashcards inside the selected deck.
7. Use the live search field to filter flashcards.
8. Reveal a flashcard answer.
9. Open Learning History and confirm the reveal action was recorded.
10. Register or login as an admin user.
11. Open the Admin Panel and view all users' learning history.

## Summary

Flashcard Learning App meets the Assignment 2 requirements by using a modern React single-page frontend, an Express backend, MongoDB Atlas database storage, protected CRUD operations, multiple related entities, and a clear user/admin learning workflow.
