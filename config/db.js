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
    timezone: 'Asia/Ho_Chi_Minh' 
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

