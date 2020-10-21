const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

const uuid = require("uuid/v4");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_DATA.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError(noPlaceError, 404);
    // return res.status(404).json(noPlaceError);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_DATA.filter((p) => {
    return p.creator === userId;
  });
  if (!places || places.length === 0) {
    return next(new HttpError(noUserPlaceError, 404));
    // return res.status(404).json(noUserPlaceError);
  }
  res.json({ places });
};

const createPlaces = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Please enter valid input", 422);
  }

  const { title, description, coordinates, address, creator } = req.body;

  const newPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_DATA.push(newPlace);

  res.status(201).json({ place: newPlace });
};

const updatePlaces = (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;
  const updatedPlace = DUMMY_DATA.find((p) => {
    return p.id === placeId;
  });
  const placeIndex = DUMMY_DATA.findIndex((p) => {
    return p.id === placeId;
  });
  console.log(placeIndex);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_DATA[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlaces = (req, res, next) => {
  const placeId = req.params.pid;
  if (
    !DUMMY_DATA.find((p) => {
      return p.id === placeId;
    })
  ) {
    throw new HttpError("Did not find place with this id", 404);
  }
  DUMMY_DATA = DUMMY_DATA.filter((p) => {
    return p.id === placeId;
  });
  res.status(200).json({ message: "Deleted place with placeId: " + placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlaces = createPlaces;
exports.updatePlaces = updatePlaces;
exports.deletePlaces = deletePlaces;
