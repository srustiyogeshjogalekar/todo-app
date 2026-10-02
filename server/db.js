const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'gympro.db'));
db.pragma('journal_mode = WAL');

// Wrap better-sqlite3 to match pg interface with Promise support
module.exports = {
  query: async (text, params = []) => {
    try {
      // Convert PostgreSQL syntax to SQLite if needed
      let sqlText = text.replace(/\$(\d+)/g, '?');
      
      const stmt = db.prepare(sqlText);
      
      // Determine if this is a SELECT or a mutation
      if (sqlText.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...params);
        return { rows, rowCount: rows.length };
      } else if (sqlText.trim().toUpperCase().includes('RETURNING')) {
        // Handle INSERT/UPDATE with RETURNING clause
        const tableInfo = extractTableAndId(sqlText, params);
        const result = stmt.run(...params);
        
        let rows = [];
        if (result.changes > 0) {
          let lastId = tableInfo.id;
          
          // For INSERT, use lastInsertRowid
          if (sqlText.trim().toUpperCase().startsWith('INSERT')) {
            lastId = result.lastInsertRowid;
          }
          
          if (lastId && tableInfo.table) {
            const selectSql = `SELECT * FROM ${tableInfo.table} WHERE id = ?`;
            const selectStmt = db.prepare(selectSql);
            rows = selectStmt.all(lastId);
          }
        }
        return { rows, rowCount: result.changes };
      } else {
        // Regular mutation without RETURNING
        const result = stmt.run(...params);
        return { 
          rows: [],
          rowCount: result.changes 
        };
      }
    } catch (err) {
      throw err;
    }
  }
};

// Helper to extract table name and ID from SQL
function extractTableAndId(sql, params) {
  let table = '';
  let id = null;
  
  // Extract table name
  const tableMatch = sql.match(/(?:INSERT INTO|UPDATE)\s+(\w+)/i);
  if (tableMatch) {
    table = tableMatch[1];
  }
  
  // Extract ID from WHERE clause (for UPDATE)
  const whereMatch = sql.match(/WHERE\s+id\s*=\s*\?/i);
  if (whereMatch && params.length > 0) {
    // ID is the last parameter in UPDATE statements
    id = params[params.length - 1];
  }
  
  return { table, id };
}
