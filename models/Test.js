const mongooes = require("mongoose");

const TestSchema = new mongooes.Schema(
  {
    name: String
  },
  { collection: "test" }
);

module.exports = mongooes.model("Test", TestSchema);
