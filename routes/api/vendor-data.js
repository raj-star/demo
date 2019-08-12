var express = require("express");
var router = express.Router();
const VendorProfile = require("../../models/vendors/VendorProfile");
const VendorSlider = require("../../models/vendors/VendorSlider");
const VendorService = require("../../models/vendors/VendorService");
const DisableTime = require("../../models/vendors/DisableTime");
const VendorStylist = require("../../models/vendors/VendorStylist");
const Service = require("../../models/admin/Service");
const Test = require("../../models/Test");

router.get("/test/route", function(req, res, next) {
  // // res.send("respond with a resource");
  Test.find((err, all) => {
    return res.send(all);
  });
  // return res.send("Success");
});

router.get("/", function(req, res, next) {
  // res.send("respond with a resource");
  VendorProfile.find((err, all) => {
    return res.send(all);
  });
});

router.get("/api/getVendorByVendorId/:id", function(req, res, next) {
  // res.send("respond with a resource");
  VendorProfile.find({vendor_id:req.params.id},(err, result) => {
    if(err){
      res.send({
          status:false,
          message:"Error : Server Error"
      });
      return;
    }
    res.send({
        status:true,
        result:result
    });
    return;
  });

});

router.get("/services/:id", function(req, res, next) {
  //id === vendor_id
  console.log(req.params.id);
  VendorService.find({ vendor_id: req.params.id }, function(err, service) {
    return res.send(service);
  });
});

router.get("/api/stylists/:id", function(req, res, next) {
  VendorStylist.find({ vendor_id: req.params.id }, function(err, results) {
    if (err) {
      return res.send({
        status: false,
        message: "Error : Error in getting vendor Stylist"
      });
    }
    return res.send(results);
  });
});
let getProfile;
let getSlider;
let getServices;
let allServices;
let disableTime;
let stylists;

router.get("/list/:id", function(req, res, next) {
  VendorSlider.find({ vendor_id: req.params.id }, function(err, results) {
    if (err) {
      return res.send({
        status: false,
        message: "Error : Error in getting vendor slider"
      });
    }
    getSlider = results;
  });

  VendorService.find({ vendor_id: req.params.id }, function(err, results) {
    if (err) {
      return res.send({
        status: false,
        message: "Error : Error in getting vendor services"
      });
    }
    getServices = results;
  });

  Service.find((err, services) => {
    if (err) {
      return res.send({
        status: false,
        message: "Error : Error in getting vendor services"
      });
    }
    allServices = services;
  });

  DisableTime.find({ vendor_id: req.params.id }, function(err, results) {
    if (err) {
      return res.send({
        status: false,
        message: "Error : Error in getting disable time"
      });
    }
    disableTime = results;
  });
  VendorStylist.find({ vendor_id: req.params.id }, function(err, results) {
    if (err) {
      return res.send({
        status: false,
        message: "Error : Error in getting vendor Stylist"
      });
    }
    stylists = results;
  });
  VendorProfile.findOne({ vendor_id: req.params.id }, function(err, results) {
    if (err) {
      return res.send({
        status: false,
        message: "Error : Error in getting vendor profile"
      });
    }
    getProfile = results;
    // return res.send({ getProfile });
    return res.send({
      getProfile,
      getSlider,
      getServices,
      allServices,
      disableTime,
      stylists
    });
  });


  

 
});
module.exports = router;
