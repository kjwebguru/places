const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const placesController = require("../controllers/places-controller");

router.get("/:pid", placesController.getPlaceById);

router.get("/user/:uid", placesController.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("description").notEmpty(),
  ],
  placesController.createPlaces
);

router.patch("/:pid", placesController.updatePlaces);

router.delete("/:pid", placesController.deletePlaces);

module.exports = router;
