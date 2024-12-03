import { Sequelize } from 'sequelize'
import { env } from '$env/dynamic/private'

console.log('Current NODE_ENV:', env.NODE_ENV || 'development')

const environment = env.NODE_ENV || 'development'

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: environment === 'production',
      trustServerCertificate: environment !== 'production',
    },
  },
  pool: {
    max: environment === 'production' ? 10 : 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: environment === 'development' ? console.log : false,
})
export default sequelize
