import database from "infra/database.js";

async function status(request, response) {
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
}

export default status;
