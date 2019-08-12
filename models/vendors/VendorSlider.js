const mongoose = require("mongoose");

const VendorSliderSchema = new mongoose.Schema(
  {
    vendor_id: String,
    image: String
  },
  { collection: "vendor_sliders" }
);

module.exports = mongoose.model("VendorSlider", VendorSliderSchema);
