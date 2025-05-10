const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class LikeBlogs extends Model {
    static associate(models) {
      LikeBlogs.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
      LikeBlogs.belongsTo(models.Blog, { foreignKey: "blog_id", onDelete: "CASCADE" });
    }
  }

  LikeBlogs.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "User", key: "id" } },
      blog_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Blog", key: "id" } },
      liked: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { sequelize, modelName: "LikeBlogs", timestamps: true }
  );

  return LikeBlogs;
};