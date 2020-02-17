import { Sequelize } from 'sequelize'

interface ConnectOptions {
  host: string
  port?: number
  username: string
  password: string
  database: string
  logging?: (sql: string, timing?: number) => void
}

export const connect = async (options: ConnectOptions) => {
  let { host, port, username, password, database, logging } = options

  // Use port 5432 by default
  port = port || 5432

  // Connect to the database
  let sequelize = new Sequelize({
    dialect: 'postgres',
    host,
    port,
    username,
    password,
    database,
    pool: {
      max: 10,
      min: 0,
    },
    logging,
  })

  // Test the connection
  await sequelize.authenticate()

  // All good, return the connection
  return sequelize
}
