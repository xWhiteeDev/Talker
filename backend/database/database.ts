import mysql, { type Pool } from 'mysql2/promise'
import dotEnv from 'dotenv'
dotEnv.config()

const cfg = {
    user: process.env['TALKER_SERVER_DB_USER'] ?? 'root',
    port: process.env['TALKER_SERVER_DB_PORT'] ?? 3306,
    password: process.env['TALKER_SERVER_DB_PASSWORD'],
    database: process.env['TALKER_SERVER_DB_DATABASE'],
    waitForConnections: true,
    connectionLimit: 15,
    namedPlaceholders: true

}

export function createPool(): Pool {
    if (!cfg.password || !cfg.database) {
        console.error('CRITICAL CONFIG POINT ISNT SET! PASSWORD OR DATABASE');
        process.exit(1)
    }
    const pool = mysql.createPool({ user: cfg.user, port: +cfg.port, password: cfg.password, database: cfg.database, waitForConnections: cfg.waitForConnections, connectionLimit: cfg.connectionLimit, namedPlaceholders: cfg.namedPlaceholders });
    return pool
}



