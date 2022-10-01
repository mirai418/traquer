import { curryRight } from 'lodash-es';
import { DataTypes, QueryInterface } from 'sequelize';
import snakecaseKeys from 'snakecase-keys';
const shallowSnakecaseKeys = curryRight(snakecaseKeys)({deep: false});

const availabilityDefinition = {
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
};

const availabilitySeeds = [
  { id: 0, lookupId: '0', name: 'Not Available' },
  { id: 1, lookupId: '1', name: 'Waiting List' },
  { id: 2, lookupId: '2', name: 'Partially Available' },
  { id: 3, lookupId: '3', name: 'Available' },
];

const regionDefinition = {
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
};

const regionSeeds = [
  { id: 1, lookupId: 'Z2', name: 'South Korea' },
  { id: 2, lookupId: 'Z3', name: 'Asia (1)' },
  { id: 3, lookupId: 'Z4', name: 'Asia (2)' },
  { id: 4, lookupId: 'Z5', name: 'Hawaii' },
  { id: 5, lookupId: 'Z6', name: 'North America' },
  { id: 6, lookupId: 'Z7', name: 'Europe' },
  { id: 7, lookupId: 'ZA', name: 'Oceania' },
];

const seatDefinition = {
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
};

const seatSeeds = [
  { id: 1, lookupId: 'X', name: 'Economy' },
  { id: 2, lookupId: 'R', name: 'Premium Economy' },
  { id: 3, lookupId: 'I', name: 'Business' },
  { id: 4, lookupId: 'O', name: 'First' },
];

const statusDefinition = {
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
};

const statusSeeds = [
  { id: 1, lookupId: 'B', name: 'Bronze' },
  { id: 2, lookupId: 'S', name: 'Super Flyers Card' },
  { id: 3, lookupId: 'P', name: 'Platinum' },
  { id: 4, lookupId: 'D', name: 'Diamond' },
  { id: 5, lookupId: 'N', name: 'No Status' },
];

async function up({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.createTable('availabilities', shallowSnakecaseKeys(availabilityDefinition));
  await queryInterface.bulkInsert('availabilities', snakecaseKeys(availabilitySeeds));

  await queryInterface.createTable('regions', shallowSnakecaseKeys(regionDefinition));
  await queryInterface.bulkInsert('regions', snakecaseKeys(regionSeeds));

  await queryInterface.createTable('seats', shallowSnakecaseKeys(seatDefinition));
  await queryInterface.bulkInsert('seats', snakecaseKeys(seatSeeds));

  await queryInterface.createTable('statuses', shallowSnakecaseKeys(statusDefinition));
  await queryInterface.bulkInsert('statuses', snakecaseKeys(statusSeeds));
}

async function down({ context: queryInterface }: { context: QueryInterface }) {
  await queryInterface.dropTable('availabilities');
  await queryInterface.dropTable('regions');
  await queryInterface.dropTable('seats');
  await queryInterface.dropTable('statuses');
}

export { up, down };
