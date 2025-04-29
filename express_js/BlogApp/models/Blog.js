module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define("Blog", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {  
        type: DataTypes.INTEGER,  
        allowNull: false,  
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },  
  
    });
    Blog.associate = (models) => {
      Blog.belongsTo(models.User, { foreignKey: "userId" });
    };
  
    return Blog;
  };