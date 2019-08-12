const mongoose = require("mongoose");

const VendorStylistSchema = new mongoose.Schema(
  {
    vendor_id: String,
    image: String,
    name: String,
    title: String,
    experience: Number,
    speciality: String
  },
  { collection: "vendor_stylists" }
);

module.exports = mongoose.model("VendorStylist", VendorStylistSchema);
