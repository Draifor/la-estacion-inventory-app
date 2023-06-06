import { Model, DataTypes } from 'sequelize';

export const Supplier = (sequelize) => {
  class SupplierModel extends Model {
    declare supplier_id: number;
    declare supplier_name: string;
    declare telephone: string;
    declare address: string;
    declare type_id: number;
  }

SupplierModel.init({
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  supplier_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Supplier',
  tableName: 'suppliers',
});

  return SupplierModel;
};
