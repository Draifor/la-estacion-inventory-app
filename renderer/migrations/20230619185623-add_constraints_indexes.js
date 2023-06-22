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
    await queryInterface.addConstraint("ingredient_doughs", {
      fields: ["ingredient_id"],
      type: "foreign key",
      name: "fk_ingredient_id",
      references: {
        table: "ingredient",
        field: "ingredient_id",
      },

      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("ingredient_doughs", {
      fields: ["dough_id"],
      type: "foreign key",
      name: "fk_dough_id",
      references: {
        table: "dough",
        field: "dough_id",
      },

      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("dough_products", {
      fields: ["dough_id"],
      type: "foreign key",
      name: "fk_dough_id",
      references: {
        table: "dough",
        field: "dough_id",
      },

      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("dough_products", {
      fields: ["product_id"],
      type: "foreign key",
      name: "fk_product_id",
      references: {
        table: "product",
        field: "product_id",
      },

      onDelete: "cascade",
      onUpdate: "cascade",
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
