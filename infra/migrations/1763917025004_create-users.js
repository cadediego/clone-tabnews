exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primarykey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // for reference: github uses 30 characters as length,
    username: { type: "varchar(30)", notNull: true, unique: true },
    //for reference: https://stackoverflow.com/a/1199238
    email: { type: "varchar(254)", notNull: true },
    password: { type: "varchar(60)", notNull: true },
    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  });
};

exports.down = false;
