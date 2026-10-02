# GymPro Admin Dashboard

GymPro is a React dashboard for managing gym members, exercises, nutrition items, product inventory, and notifications. The Express API stores data in a local SQLite database.

## Requirements

- Node.js and npm

## Setup

Run these commands from the project root to install the frontend dependencies:

```powershell
npm install
```

In a second terminal, install the backend dependencies and initialize the local database:

```powershell
cd server
npm install
node init_db.js
```

Run `node init_db.js` only for a new database or when you intentionally want to reset it. It deletes and recreates `server/gympro.db`, including the sample data in `server/init_db.sql`.

Start the API from the `server` directory. The frontend calls the API on port `5001`, so set that port when starting the backend:

```powershell
$env:PORT = "5001"
npm start
```

On macOS or Linux, use `PORT=5001 npm start` instead.

In another terminal, return to the project root and start the frontend:

```powershell
cd ..
npm start
```

The React development server opens at [http://localhost:3000](http://localhost:3000).

## Available Scripts

Run these from the project root:

- `npm start` starts the React development server.
- `npm test` runs the React test suite.
- `npm run build` creates a production build in `build/`.

Run `npm start` from `server/` to start the API after setting `PORT=5001`.

## Data

The backend creates its SQLite database at `server/gympro.db`. Database files are excluded from Git; each local environment initializes its own database with `node init_db.js`.
