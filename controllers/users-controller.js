const HttpError = require("../models/http-error");
const User = require("../models/user");

const uuid = require("uuid/v4");

const { validationResult } = require("express-validator");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "kj",
    email: "kj@gmail.com",
    password: "mypass",
  },
];

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find users",
      500
    );
    return next(error);
  }

  if (!users || users.length === 0) {
    return next(new HttpError("No user found", 422));
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(
      new HttpError("Please enter valid credentials to create account", 422)
    );
  }
  const { name, email, password } = req.body;
  let hasUser;

  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("No results found", 500);
    return next(error);
  }

  if (hasUser) {
    return next(new HttpError("User already exist please try to login", 401));
  }

  const createUser = new User({
    name,
    email,
    password,
    image: "https://ibb.co/7RgZtm8",
    places: [],
  });

  try {
    await createUser.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, Could not create user", 500)
    );
  }

  res.status(201).json({ createdUser: createUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Please enter valid email and password", 422));
  }

  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email, password: password });
  } catch (err) {
    const error = new HttpError("No user found", 500);
    return next(error);
  }

  if (!user) {
    return next(HttpError("Couldn't find user try again", 422));
  }

  res.json({ message: "You are logged in" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
