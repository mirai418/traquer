import { DataTypes, QueryInterface } from 'sequelize';

async function up({context: queryInterface}: {context: QueryInterface}) {
  await queryInterface.addColumn('subscriptions', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  });
  await queryInterface.changeColumn('subscriptions', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: null,
  });
  await queryInterface.addConstraint('subscriptions', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'subscriptions_user_id_fkey',
    references: {
      table: 'users',
      field: 'id',
    },
  onDelete: 'cascade',
  onUpdate: 'cascade',
  });
}

async function down({context: queryInterface}: {context: QueryInterface}) {
  await queryInterface.removeConstraint('subscriptions', 'subscriptions_user_id_fkey');
  await queryInterface.removeColumn('subscriptions', 'user_id');
}

export {up, down};
