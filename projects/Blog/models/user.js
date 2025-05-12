'use strict';
const { Model } = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    User.hasMany(models.Blog, { foreignKey: "writer", onDelete: "CASCADE" })
    User.hasMany(models.LikeBlogs, { foreignKey: "user_id", as: "UserLikes" });

  }
  }
  User.init({
    id:{ 
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    username:{ 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
  });
  return User;
};