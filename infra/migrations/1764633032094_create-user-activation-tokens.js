exports.up = (pgm) => {
  // eslint-disable-next-line no-undef
  pgm.createTable("user_activation_tokens", {
    id: {
      type: "uuid",
      primarykey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    used_at: {
      type: "timestamptz",
      notNull: false,
    },

    user_id: {
      type: "uuid",
      notNull: true,
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
    },

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
// eslint-disable-next-line no-unused-vars
exports.down = false;
