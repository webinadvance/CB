import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  database: 'cb',
  username: 'sa',
  password: '846223497514102Aa!',
  host: 'srv_linux',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log,
})

export default sequelize
