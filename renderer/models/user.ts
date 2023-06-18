import { Model, DataTypes } from  'sequelize';

export const User = (sequelize) => {
  class UserModel extends Model {
    declare user_id: number;
    declare username: string;
    declare name: string;
    declare cellphone: string;
    declare password: string;
    declare role: string;
  }

UserModel.init({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cellphone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
});

  return UserModel;
};
