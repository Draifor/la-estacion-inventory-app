"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("ingredient", {
      ingredient_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ingredient_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ingredient_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ingredient_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ingredient_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
