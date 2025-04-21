const { Sequelize } = require ("sequelize")

const sequelize = new Sequelize('lotus', 'postgres', 'postgres76555432', {
    host: "localhost",
    dialect: 'postgres',
    logging: false,
})

module.exports = sequelize