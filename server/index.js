const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- Users Endpoints ---
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, username, email, phone, plan, status, join_date, expiry_date, img } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, username, email, phone, plan, status, join_date, expiry_date, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, username, email, phone, plan, status, join_date, expiry_date, img]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, username, email, phone, plan, status, join_date, expiry_date, img } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET name=$1, username=$2, email=$3, phone=$4, plan=$5, status=$6, join_date=$7, expiry_date=$8, img=$9 WHERE id=$10 RETURNING *',
      [name, username, email, phone, plan, status, join_date, expiry_date, img, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Exercises Endpoints ---
app.get('/api/exercises', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM exercises ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exercises', async (req, res) => {
  const { name, category, sets, reps, difficulty, calories, timing, image } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO exercises (name, category, sets, reps, difficulty, calories, timing, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, category, sets, reps, difficulty, calories, timing, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/exercises/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, sets, reps, difficulty, calories, timing, image } = req.body;
  try {
    const result = await db.query(
      'UPDATE exercises SET name=$1, category=$2, sets=$3, reps=$4, difficulty=$5, calories=$6, timing=$7, image=$8 WHERE id=$9 RETURNING *',
      [name, category, sets, reps, difficulty, calories, timing, image, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exercises/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM exercises WHERE id = $1', [id]);
    res.json({ message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Products Endpoints ---
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Food Items Endpoints ---
app.get('/api/food', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM food_items ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/food/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM food_items WHERE id = $1', [id]);
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Notifications Endpoints ---
app.get('/api/notifications', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notifications ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/read-all', async (req, res) => {
  try {
    await db.query('UPDATE notifications SET read = TRUE');
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
