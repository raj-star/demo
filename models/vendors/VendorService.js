const mongooes = require("mongoose");

const VendorServiceSchema = new mongooes.Schema(
  {
    vendor_id: String,
    category_name: String,
    service_name: String,
    duration: Number,
    actual_price: String,
    discount_price: String,
    image: String,
    available_for: String,
    discount: String,
    discount_valid: Number,
    status: Boolean
  },
  { collection: "vendor_services" }
);

module.exports = mongooes.model("VendorService", VendorServiceSchema);
