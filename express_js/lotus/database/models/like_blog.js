const { sequelize, DataTypes, Sequelize } = require("sequelize")
const sequelize = require("../sequelize")


const like_blog = sequelize.define('like_blog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Blog,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id', 
        },
        onDelete: 'CASCADE',
    },
    liked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'like_blog',
    timestamps: false,
});

module.exports = like_blog
