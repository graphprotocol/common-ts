import { Sequelize } from 'sequelize'

interface ConnectOptions {
  host: string
  port?: number
  username: string
  password: string
  database: string
}

export const connect = async (options: ConnectOptions) => {
  let { host, port, username, password, database } = options

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
  })

  // Test the connection
  await sequelize.authenticate()

  // All good, return the connection
  return sequelize
}
