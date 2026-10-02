const fs = require('fs');
const path = require('path');
const db = require('./db');

const alterTable = async () => {
  try {
    // Check if username column exists, if not add it
    try {
      await db.query('ALTER TABLE users ADD COLUMN username VARCHAR(50)');
      console.log('Added username column');
    } catch (e) {
      if (e.code === '42701') {
        console.log('username column already exists');
      } else throw e;
    }

    // Check if expiry_date column exists, if not add it
    try {
      await db.query('ALTER TABLE users ADD COLUMN expiry_date DATE');
      console.log('Added expiry_date column');
    } catch (e) {
      if (e.code === '42701') {
        console.log('expiry_date column already exists');
      } else throw e;
    }

    // Update existing users with username and expiry_date
    await db.query(`
      UPDATE users SET
        username = COALESCE(username, split_part(email, '@', 1)),
        expiry_date = COALESCE(expiry_date, join_date + INTERVAL '1 year')
      WHERE username IS NULL OR expiry_date IS NULL
    `);
    console.log('Updated existing users');

    console.log('Database migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error migrating database:', err);
    process.exit(1);
  }
};

alterTable();
