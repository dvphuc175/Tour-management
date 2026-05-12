const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: '+07:00',
    dateStrings: true
});

// Ép mọi connection của pool dùng timezone Việt Nam.
// Cần thiết vì server MySQL trên Railway/cloud thường chạy UTC,
// khiến NOW()/CURDATE() trả về giờ UTC, lệch 7 tiếng so với giờ VN.
pool.on('connection', (connection) => {
    connection.query("SET time_zone = '+07:00'");
});

async function query(sql, params = []) { 
    const [rows] = await pool.execute(sql, params); 
    return rows; }

async function getConnection() { 
    return pool.getConnection(); } 
// Test connection
pool.getConnection()
     .then(() => 
        console.log('MySQL connected')) 
     .catch(err => 
        console.error('MySQL error:', err.message));

module.exports = { query, getConnection, pool };

