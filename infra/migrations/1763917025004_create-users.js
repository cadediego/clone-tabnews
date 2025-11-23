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
    //for reference: https://security.stackexchange.com/q/39849
    password: { type: "varchar(72)", notNull: true },
    created_at: { type: "timestamptz", default: pgm.func("now()") },
    updated_at: { type: "timestamptz", default: pgm.func("now()") },
  });
};

exports.down = false;
