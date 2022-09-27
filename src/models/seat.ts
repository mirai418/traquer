import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Seat extends Model<InferAttributes<Seat>, InferCreationAttributes<Seat>> {
  declare id: number;
  declare lookupId: string;
  declare name: string;
}

Seat.init({
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
  modelName: 'Seat',
  tableName: 'seats',
  timestamps: false,
  underscored: true,
});

export default Seat;
