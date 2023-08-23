import { Sequelize } from 'sequelize'

interface ConnectOptions {
  host: string
  port?: number
  username: string
  password: string
  database: string
  logging?: (sql: string, timing?: number) => void
  poolMin?: number
  poolMax?: number
}

export const connectDatabase = async (options: ConnectOptions): Promise<Sequelize> => {
  const { host, username, password, database, logging } = options

  // Use port 5432 by default
  const port = options.port || 5432
  const poolMin = options.poolMin || 0
  const poolMax = options.poolMax || 10

  // Connect to the database
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host,
    port,
    username,
    password,
    database,
    pool: {
      max: poolMax,
      min: poolMin,
    },
    logging,
  })

  // Test the connection
  await sequelize.authenticate()

  // All good, return the connection
  return sequelize
}
