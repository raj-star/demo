const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const VendorProfileSchema = new mongoose.Schema(
  {
    business_name: {
      type: String,
      default: ""
    },
    owner_name: {
      type: String,
      default: ""
    },
    owner_contact: {
      type: String,
      default: ""
    },
    landline_number: {
      type: String,
      default: ""
    },
    vendor_type: {
      type: String,
      default: ""
    },
    locality: {
      type: String,
      default: ""
    },
    zipcode: {
      type: String,
      default: ""
    },
    full_address: {
      type: String,
      default: ""
    },
    opening_time: {
      type: String,
      default: ""
    },
    closing_time: {
      type: String,
      default: ""
    },
    banner: {
      type: String,
      default: ""
    },
    vendor_id: {
      type: String,
      default: ""
    },
    working_day: {
      type: String,
      default: ""
    },
    updated_at: {
      type: String,
      default: ""
    },
    created_at: {
      type: String,
      default: ""
    },
    services: { type: String, ref: "vendor_services" }
  },
  { collection: "vendor_profiles" }
);

VendorProfileSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

VendorProfileSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model("VendorProfile", VendorProfileSchema);
