import { curryRight } from 'lodash-es';
import { DataTypes, QueryInterface } from 'sequelize';
import snakecaseKeys from 'snakecase-keys';
const shallowSnakecaseKeys = curryRight(snakecaseKeys)({deep: false});

const userDefinition = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
};

async function up({context: queryInterface}: {context: QueryInterface}) {
  await queryInterface.createTable('users', shallowSnakecaseKeys(userDefinition));
}

async function down({context: queryInterface}: {context: QueryInterface}) {
  await queryInterface.dropTable('users');
}

export {up, down};
