import { Model, DataTypes } from 'sequelize';

export const DoughProduct = (sequelize) => {
  class DoughProductModel extends Model {
    declare dough_product_id: number;
    declare dough_id: number;
    declare product_id: number;
    declare quantity: number;
    declare dough_product_stock: number;
  }

  DoughProductModel.init({
    dough_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dough_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dough_product_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'DoughProduct',
    tableName: 'dough_products',
  });

  return DoughProductModel;
}
