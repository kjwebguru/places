const express = require("express");
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

const placesEndpoint = "/api/places";
const usersEndpoint = "/api/users";

const app = express();

app.use(bodyParser.json());

app.use(placesEndpoint, placesRoutes);
app.use(usersEndpoint, userRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find the route", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

app.listen(5000);
