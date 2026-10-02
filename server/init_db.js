const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const initDb = () => {
  try {
    // Delete existing database to start fresh
    const dbPath = path.join(__dirname, 'gympro.db');
    const dbWalPath = dbPath + '-wal';
    const dbShmPath = dbPath + '-shm';
    
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    if (fs.existsSync(dbWalPath)) {
      fs.unlinkSync(dbWalPath);
    }
    if (fs.existsSync(dbShmPath)) {
      fs.unlinkSync(dbShmPath);
    }
    
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    
    const sql = fs.readFileSync(path.join(__dirname, 'init_db.sql'), 'utf8');
    
    // Split SQL statements by semicolon and execute each one
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      db.exec(statement);
    }
    
    console.log('Database initialized successfully.');
    db.close();
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initDb();
