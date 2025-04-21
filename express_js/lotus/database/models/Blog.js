const { Sequelize, DataTypes } = require ("sequelize");
const sequelize = require("../sequelize");

const Blog = sequelize.define('blogs',{

    id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull : false,
        references: {
            model : User,
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

},{
    tableName: 'Blogs',
    timestamps: true,
});

Blog.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = Blog