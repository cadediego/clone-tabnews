import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const UpdateAt = new Date().toISOString();

    const DbName = process.env.POSTGRES_DB;

    const db_version = await database.query("SHOW SERVER_VERSION;");
    const db_max_connections = await database.query("SHOW max_connections;");
    const db_open_connections = await database.query({
      text: "select count(*)::int from pg_stat_activity where datname= $1",
      values: [DbName],
    });
    const OpenConnections = db_open_connections.rows[0].count;

    const MaxConnections = db_max_connections.rows[0].max_connections;
    const Version = db_version.rows[0].server_version;
    response.status(200).json({
      update_date: UpdateAt,
      dependences: {
        database: {
          version: Version,
          max_connections: parseInt(MaxConnections),
          open_connections: OpenConnections,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("Error dentro do catch do controller");
    console.log(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
