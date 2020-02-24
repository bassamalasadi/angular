var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const restful = require("node-restful");
const methodOverride = require("method-override");
const cors = require("cors");
const config = require("./config");
const logge = require("./logge");
const index = require("./routes/index");
const users = require("./routes/users");
const products = require("./routes/products");
const app = express();

mongoose.Promise = global.Promise;

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    logge.info("connected to MongoDB");
  })
  .catch(error => {
    logge.error("error connection to MongoDB:", error.message);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.static("angular8-crud"));
app.use("/", index);
app.use("/users", users);
app.use("/api/v1/products", products);

var Category = (app.resource = restful
  .model(
    "category",
    mongoose.Schema({
      cat_name: String
    })
  )
  .methods(["get", "post", "put", "delete"]));

Category.register(app, "/category");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
