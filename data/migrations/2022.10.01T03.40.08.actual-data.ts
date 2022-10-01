import { curryRight } from 'lodash-es';
import { DataTypes, QueryInterface } from 'sequelize';
import snakecaseKeys from 'snakecase-keys';
const shallowSnakecaseKeys = curryRight(snakecaseKeys)({deep: false});

const awardSeatDefinition = {
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
};

const subscriptionDefinition = {
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
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
};

async function up({context: queryInterface}: {context: QueryInterface}) {
  await queryInterface.createTable('award_seats', shallowSnakecaseKeys(awardSeatDefinition));
  await queryInterface.createTable('subscriptions', shallowSnakecaseKeys(subscriptionDefinition));
}

async function down({context: queryInterface}: {context: QueryInterface}) {
  await queryInterface.dropTable('award_seats');
  await queryInterface.dropTable('subscriptions');
}

export {up, down};
