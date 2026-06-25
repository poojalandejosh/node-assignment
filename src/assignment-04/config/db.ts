import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
] as const;

const missingEnvVars = requiredEnvVars.filter(
  (key) => !process.env[key]?.trim()
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

if (Number.isNaN(dbPort)) {
  throw new Error('DB_PORT must be a valid number');
}

const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: dbPort,
    waitForConnections: true,
    connectionLimit: 10,
})
export default pool;