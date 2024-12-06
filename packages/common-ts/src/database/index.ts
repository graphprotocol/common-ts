import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

interface ConnectOptions {
  host: string;
  port?: number;
  username: string;
  password: string;
  database: string;
  sslEnabled?: boolean;
  logging?: (sql: string, timing?: number) => void;
  poolMin?: number;
  poolMax?: number;
}

/**
 * Establishes a database connection using Sequelize (PostgreSQL by default).
 * @param options - Configuration for the connection.
 * @returns Sequelize instance.
 */
export const connectDatabaseSequelize = async (options: ConnectOptions): Promise<Sequelize> => {
  const {
    host,
    port = 5432, // Default PostgreSQL port
    username,
    password,
    database,
    sslEnabled = false,
    logging,
    poolMin = 0,
    poolMax = 10,
  } = options;

  try {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host,
      port,
      username,
      password,
      database,
      ssl: sslEnabled,
      pool: {
        max: poolMax,
        min: poolMin,
      },
      logging,
    });

    // Test the connection
    await sequelize.authenticate();
    console.info('✅ Sequelize connection established successfully.');

    return sequelize;
  } catch (error) {
    console.error('❌ Error connecting to the database with Sequelize:', error.message);
    throw new Error('Failed to connect using Sequelize.');
  }
};

/**
 * Establishes a database connection using pure MySQL.
 * @param options - Configuration for the connection.
 * @returns MySQL connection instance.
 */
export const connectDatabaseMySQL = async (options: ConnectOptions): Promise<mysql.Connection> => {
  const {
    host,
    port = 3306, // Default MySQL port
    username,
    password,
    database,
    sslEnabled = false,
    logging,
  } = options;

  try {
    const connectionConfig: mysql.ConnectionOptions = {
      host,
      port,
      user: username,
      password,
      database,
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    };

    const connection = await mysql.createConnection(connectionConfig);

    // Test the connection
    await connection.ping();
    console.info('✅ MySQL connection established successfully.');

    // Log successful connection if logging function is provided
    if (logging) logging('MySQL connection established.');

    return connection;
  } catch (error) {
    console.error('❌ Error connecting to the database with MySQL:', error.message);
    throw new Error('Failed to connect using MySQL.');
  }
};

// Unified export for flexibility and scalability
export const DatabaseConnector = {
  sequelize: connectDatabaseSequelize,
  mysql: connectDatabaseMySQL,
};

/**
 * Example Usage:
 * 
 * import { DatabaseConnector } from './path-to-file';
 * 
 * // For Sequelize (PostgreSQL)
 * const sequelizeConnection = await DatabaseConnector.sequelize({
 *   host: 'localhost',
 *   username: 'user',
 *   password: 'password',
 *   database: 'my_database',
 * });
 * 
 * // For pure MySQL
 * const mysqlConnection = await DatabaseConnector.mysql({
 *   host: 'localhost',
 *   username: 'user',
 *   password: 'password',
 *   database: 'my_database',
 * });
 */
