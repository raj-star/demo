var createError = require("http-errors");
var express = require("express");
const fs = require("fs");
const historyApiFallback = require("connect-history-api-fallback");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
// var indexRouter = require("./routes/index");
var getVendorData = require("./routes/api/vendor-data");

// var testAPIRouter = require("./routes/testAPI");
const config = require("./config/config");
const mongoose = require("mongoose");
const isDev = process.env.NODE_ENV !== "production";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

// Set up Mongoose
mongoose.set("useNewUrlParser", true);
mongoose.connect(isDev ? config.db_dev : config.db);
mongoose.Promise = global.Promise;

require("./routes/api/users")(app);
require("./routes/api/userServiceManagement")(app);

// app.use("/", indexRouter);
app.use("/getVendorData", getVendorData);
// app.use("/testAPI", testAPIRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use((req,res,next)=>{
  const error = new Error("Not Found");
  error.status(404);
  next(error);
});
app.use(function(err, req, res, next) {
 res.status(error.status || 500);
 res.json({
   error:{
     message:error.message,
   }
 });
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
