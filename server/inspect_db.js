const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'gympro.db'));

console.log('\n=== DATABASE INSPECTION ===\n');

// Get all tables
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name;
`).all();

console.log('Tables in database:');
tables.forEach(t => console.log(`  - ${t.name}`));

// Count records in each table
console.log('\nRecord counts:');
tables.forEach(t => {
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${t.name}`).get();
  console.log(`  ${t.name}: ${count.count} records`);
});

// Show sample data from exercises with explicit id column
console.log('\nExercises:');
const exercises = db.prepare('SELECT id, name, category, sets, reps, difficulty FROM exercises LIMIT 5').all();
if (exercises.length > 0) {
  console.log(JSON.stringify(exercises, null, 2));
} else {
  console.log('  (no records)');
}

// Show sample data from users with explicit id
console.log('\nUsers:');
const users = db.prepare('SELECT id, name, username, email FROM users LIMIT 5').all();
if (users.length > 0) {
  console.log(JSON.stringify(users, null, 2));
} else {
  console.log('  (no records)');
}

// Check ROWID as fallback
console.log('\nExercises with ROWID:');
const exercisesRowid = db.prepare('SELECT rowid, name FROM exercises LIMIT 3').all();
console.log(JSON.stringify(exercisesRowid, null, 2));

db.close();
console.log('\n=== END INSPECTION ===\n');
