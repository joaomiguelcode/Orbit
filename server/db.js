import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '82.40.22.100',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'Orbit',
  password: process.env.DB_PASSWORD || '10203040',
  database: process.env.DB_NAME || 'orbit_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Helper for executing queries with parameters
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
