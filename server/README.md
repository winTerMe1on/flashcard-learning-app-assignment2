# Flashcard Server Setup

This backend is set up to use MongoDB Atlas.

## Environment

Create a `server/.env` file with:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/flashcard_app?retryWrites=true&w=majority&appName=Cluster0
```

Use your Atlas connection string and keep the database name as `flashcard_app`.

## Atlas Notes

- Create a database user in MongoDB Atlas.
- Add your current IP address to the Atlas network access list.
- Copy the Atlas connection string and replace the username and password.

## Run The Server

```bash
npm install
npm run dev
```

The Express API runs on `http://localhost:5000`.
