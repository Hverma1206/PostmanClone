const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'rest_client.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the database.');
  
  db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err.message);
      return;
    }
    
    console.log('Database tables:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
      
      db.all(`SELECT * FROM ${table.name}`, [], (err, rows) => {
        if (err) {
          console.error(`Error querying ${table.name}:`, err.message);
          return;
        }
        
        console.log(`\nContents of ${table.name}:`);
        rows.forEach(row => {
          console.log(row);
        });
        console.log('\n-----------------------------------\n');
      });
    });
  });
});

process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
