import { Model, DataTypes } from 'sequelize';

export const Ingredient = (sequelize) => {
  class IngredientModel extends Model {
    declare ingredient_id: number;
    declare ingredient_name: string;
    declare ingredient_description: string;
    declare ingredient_price: number;
    declare ingredient_stock: number;
  }

  IngredientModel.init({
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ingredient_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredient_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredient_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ingredient_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Ingredient',
    tableName: 'ingredients',
  });

  return IngredientModel;
}
