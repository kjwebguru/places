const express = require("express");
const router = express.Router();
const placesController = require("../controllers/places-controller");

router.get("/:pid", placesController.getPlaceById);

router.get("/user/:uid", placesController.getPlacesByUserId);

router.post("/", placesController.createPlaces);

router.patch("/:pid", placesController.updatePlaces);

router.delete("/:pid", placesController.deletePlaces);

module.exports = router;
