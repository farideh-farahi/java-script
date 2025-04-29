'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [
      {
        username: "admin",
        password: "123", // ⚠️ Passwords should be **hashed**, see next step
        email: "admin@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user1",
        password: "123",
        email: "user1@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};