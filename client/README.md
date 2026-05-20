# Flashcard Learning App

## Problem The Website Solves

Many students need a simple way to create study notes and practise questions in one place. This website solves that problem by letting users add flashcards, reveal answers, edit cards, and delete cards when they are no longer needed. It helps students revise important content in a simple and organised way.

## Technical Stack

- Frontend: React with Vite
- Styling: Plain CSS using `App.css` and `index.css`
- Backend: Express.js
- Database: MongoDB Atlas with Mongoose
- Development setup: Vite for the frontend, Nodemon for the backend, and `.env` for environment variables

## Features

- Add a new flashcard with a question and answer
- View all flashcards on one page
- Click a flashcard to reveal or hide the answer
- Edit an existing flashcard
- Delete a flashcard
- Save flashcard data through the backend API to MongoDB Atlas
- Show simple loading and error messages when needed

## Folder Structure

```text
Assignment 1/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |   |-- FlashcardForm.jsx
|   |   |-- services/
|   |   |   |-- flashcardApi.js
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- index.css
|   |   |-- main.jsx
|   |-- package.json
|
|-- server/
|   |-- config/
|   |   |-- db.js
|   |-- models/
|   |   |-- Flashcard.js
|   |-- routes/
|   |   |-- flashcardRoutes.js
|   |-- index.js
|   |-- package.json
```

- `client` contains the React single-page application.
- `server` contains the Express backend and MongoDB connection.
- `components` holds reusable React components.
- `services` stores the frontend API requests.
- `models` defines the MongoDB data structure.
- `routes` contains the backend CRUD endpoints.

## Challenges Overcome

- Changing the form from a simple alert into a real flashcard system
- Managing React state for add, edit, delete, and reveal features together
- Connecting the frontend to a backend API step by step
- Setting up MongoDB Atlas and environment variables correctly
- Keeping the code simple enough to explain clearly in class

## Development Summary

This project was built as a beginner-friendly single-page flashcard learning app. The frontend handles the user interface and interactions, while the backend stores flashcard data in MongoDB Atlas. The project is designed to be simple, practical, and easy to explain for Assignment 1.
