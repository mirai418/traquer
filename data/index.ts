import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { readFileSync } from 'fs';
import { isString } from 'lodash-es';
import { promisify } from 'util';
import glob from 'glob';
const asyncGlob = promisify(glob);

import { Umzug, SequelizeStorage, InputMigrations, RunnableMigration } from 'umzug';
import { QueryInterface } from 'sequelize';

import sequelize from '../src/config/sequelize.js';

async function getMigrations(): Promise<InputMigrations<QueryInterface>> {
  const filenames = <string[]>await asyncGlob('**.ts', {
    cwd: path.join(process.cwd(), 'data', 'migrations'),
  });
  const migrations = [];
  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i].replace('.ts', '');
    const migration: RunnableMigration<QueryInterface> = await import(`./migrations/${filename}.js`);
    migrations.push({
      ...migration,
      name: filename,
    });
  }
  return migrations;
}

async function initUmzug(migrations: InputMigrations<QueryInterface>) {
  return new Umzug({
    migrations: migrations,
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({sequelize}),
    logger: console,
    create: {
      template: filepath => [
        [filepath, readFileSync('./data/migration-template.txt').toString()],
      ],
    },
  });
}

async function main() {
  try {
    const migrations = await getMigrations();
    const umzug = await initUmzug(migrations);
    const args = process.argv;
    if (args[2] === 'up') {
      await umzug.up();
    } else if (args[2] === 'down') {
      await umzug.down();
    } else if (args[2] === 'pending') {
      await umzug.pending();
    } else if (args[2] === 'executed') {
      await umzug.executed();
    } else if (args[2] === 'create' && isString(args[3])) {
      await umzug.create({
        name: `${args[3]}.ts`,
        folder: './data/migrations',
        skipVerify: true,
      });
    } else {
      console.error('Could not parse arguments');
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
