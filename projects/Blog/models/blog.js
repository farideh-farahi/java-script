const { Model, DataTypes } = require ("sequelize")

module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
        static associate(models) {
        Blog.belongsTo(models.User, {foreignKey:'writer', onDelete: 'CASCADE'})
        }
    }

Blog.init (
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    writer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model:'User',
            key: 'id'
        }
    },
    is_active : DataTypes.BOOLEAN
},
{
        sequelize,
        modelName: 'Blog',
        timestamps: true,
});
    return Blog;
}


