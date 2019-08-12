const mongooes = require("mongoose");

const ServiceSchema = new mongooes.Schema(
  {
    categories_id: String,
    service_name: String
  },
  { collection: "services" }
);

module.exports = mongooes.model("Service", ServiceSchema);
