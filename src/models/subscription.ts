import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './user.js';

class Subscription extends Model<InferAttributes<Subscription>, InferCreationAttributes<Subscription>> {
  declare id: CreationOptional<number>;
  declare routeFrom: string | null;
  declare routeTo: string | null;
  declare startDate: Date | null;
  declare endDate: Date | null;
  declare statusId: number | null;
  declare seatId: number | null;
  declare availabilityId: number | null;
  declare lastCheckedAt: Date;
  declare userId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Subscription.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  routeFrom: {
    type: DataTypes.STRING(3),
    allowNull: true,
  },
  routeTo: {
    type: DataTypes.STRING(3),
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  seatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  availabilityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lastCheckedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'Subscription',
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true,
});

User.hasMany(Subscription, {
  as: 'subscriptions',
});
Subscription.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});
Subscription.removeAttribute('UserId');

export default Subscription;
