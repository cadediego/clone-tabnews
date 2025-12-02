exports.up = (pgm) => {
  // eslint-disable-next-line no-undef
  pgm.addColumn("users", {
    features: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },
  });
};
// eslint-disable-next-line no-unused-vars
exports.down = false;
