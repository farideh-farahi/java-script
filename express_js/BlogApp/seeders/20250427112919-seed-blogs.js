module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Blogs", [
      {
        title: "اولین بلاگ",
        content: "این یک تست است!",
        userId: 14, // فرض کن یوزر با id=1 قبلاً وجود دارد
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Blogs", null, {});
  },
};