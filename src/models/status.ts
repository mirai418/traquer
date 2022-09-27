import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Status extends Model<InferAttributes<Status>, InferCreationAttributes<Status>> {
  declare id: number;
  declare lookupId: string;
  declare name: string;
}

Status.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  lookupId: {
    type: DataTypes.STRING(1),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  sequelize: sequelize,
  modelName: 'Status',
  tableName: 'statuses',
  timestamps: false,
  underscored: true,
});

export default Status;
