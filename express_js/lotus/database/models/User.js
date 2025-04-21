const { Sequelize , DataTypes } = require ("sequelize")
const sequelize = require("../sequelize")

const User = sequelize.define('users', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure passwords are mandatory
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'users',
    timestamps: true
})

module.exports = User