const HttpError = require("../models/http-error");
const Place = require("../models/place");

const { validationResult } = require("express-validator");

const uuid = require("uuid/v4");

const geoLocation = require("../utils/location");

const noPlaceError = "Could not find a place with provided place id";

const noUserPlaceError = "Could not find places with provided user id";

let DUMMY_DATA = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.98171516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.98171516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
  {
    id: "p3",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.98171516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u2",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(noPlaceError, 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any place for this user",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new HttpError(noUserPlaceError, 404);
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlaces = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Please enter valid input", 422));
  }

  const { title, description, address, creator } = req.body;

  const coordinates = geoLocation(address);

  const newPlace = new Place({
    title,
    description,
    image: "https://ibb.co/7RgZtm8",
    location: coordinates,
    address,
    creator,
  });

  try {
    await newPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not save place please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlaces = async (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find place",
      500
    );
    return next(error);
  }
  if (!place) {
    return next(new HttpError("Did not find place", 404));
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not update place",
      500
    );
    return next(error);
  }
  res.status(200).json({
    place: place.toObject({
      getters: true,
    }),
  });
};

const deletePlaces = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find place",
      500
    );
    return next(error);
  }
  if (!place) {
    return next(new HttpError("Did not find place", 404));
  }
  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not delete place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place with placeId: " + placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlaces = createPlaces;
exports.updatePlaces = updatePlaces;
exports.deletePlaces = deletePlaces;
