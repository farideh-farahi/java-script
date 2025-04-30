'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs',{
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false
    },
      content: {
        type: Sequelize.TEXT
      },
      writer: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model:'Users',
            key: 'id'
          }
       },
      is_active : Sequelize.BOOLEAN,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Blogs");
  }
};
