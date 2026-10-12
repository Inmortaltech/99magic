const mysql = require('mysql2/promise');

// Directly define the connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',        // MySQL host
  user: 'magic_tricks',      // MySQL username
  password: 'admin@456#',    // MySQL password
  database: 'magic_tricks',  // Database name
  port: 3307,                // MySQL port (number!)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
