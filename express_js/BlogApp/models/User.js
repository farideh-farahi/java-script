const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {  
  const User = sequelize.define("User", {  
    id: {  
      type: DataTypes.INTEGER,  
      primaryKey: true,  
      autoIncrement: true,  
    },  
    username: {  
      type: DataTypes.STRING,  
      allowNull: false,  
      unique: true,  
    },  
    password: {  
      type: DataTypes.STRING,  
      allowNull: false,  
    },  
    email: {  
      type: DataTypes.STRING,  
      allowNull: true,  
      unique: true,  
      validate: {  
        isEmail: true,  
      },  
    },  
    token: {  
      type: DataTypes.STRING,  
    },  
  });
  User.associate = (models) => {
    User.hasMany(models.Blog, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return User;  
};