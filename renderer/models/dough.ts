import { Model, DataTypes } from 'sequelize';

export const Dough = (sequelize) => {
  class DoughModel extends Model {
    declare dough_id: number;
    declare dough_name: string;
    declare dough_description: string;
    declare dough_stock: number;
  }

  DoughModel.init({
    dough_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dough_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dough_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dough_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Dough',
    tableName: 'doughs',
  });

  return DoughModel;
}
