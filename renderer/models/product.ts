import { Model, DataTypes } from 'sequelize';

export const Product = (sequelize) => {
  class ProductModel extends Model {
    declare product_id: number;
    declare product_name: string;
    declare product_description: string;
    declare product_cost: number;
    declare product_price: number;
    declare product_stock: number;
  }

  ProductModel.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  });

  return ProductModel;
}
