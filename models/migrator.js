import database from "infra/database.js";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

let dbClient;

async function listPendingMigrations() {
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationsRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationsRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};
export default migrator;
