const mongooes = require("mongoose");

const DisableTimeSchema = new mongooes.Schema(
  {
    date: String,
    time: String,
    vendor_id: String
  },
  { collection: "disabled_times" }
);

module.exports = mongooes.model("DisableTime", DisableTimeSchema);
