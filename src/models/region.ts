import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Region extends Model<InferAttributes<Region>, InferCreationAttributes<Region>> {
  declare id: number;
  declare lookupId: string;
  declare name: string;
}

Region.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  lookupId: {
    type: DataTypes.STRING(2),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  sequelize: sequelize,
  modelName: 'Region',
  tableName: 'regions',
  timestamps: false,
  underscored: true,
});

export default Region;
