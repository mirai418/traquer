import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Availability extends Model<InferAttributes<Availability>, InferCreationAttributes<Availability>> {
  declare id: number;
  declare lookupId: string;
  declare name: string;
}

Availability.init({
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
  modelName: 'Availability',
  tableName: 'availabilities',
  timestamps: false,
  underscored: true,
});

export default Availability;
