import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class AwardSeat extends Model<InferAttributes<AwardSeat>, InferCreationAttributes<AwardSeat>> {
  declare id: CreationOptional<number>;
  declare date: Date;
  declare routeFrom: string;
  declare routeTo: string;
  declare regionId: string;
  declare statusId: number;
  declare seatId: number;
  declare availabilityId: number;
  declare isLatest: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AwardSeat.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  routeFrom: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  routeTo: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  regionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  availabilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isLatest: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'AwardSeat',
  tableName: 'award_seats',
  timestamps: true,
  underscored: true,
});

export default AwardSeat;
