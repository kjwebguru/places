const HttpError = require("../models/http-error");

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

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError(
      "Please enter valid credentials to create account",
      422
    );
  }
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => {
    return u.email === email;
  });

  if (hasUser) {
    throw new HttpError("User already exist please try to login", 401);
  }

  const createUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createUser);

  res.status(201).json({ createdUser: createUser });
};

const login = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError("Please enter valid email and password", 422);
  }

  const { email, password } = req.body;

  const loginUser = DUMMY_USERS.find((u) => {
    return u.email === email && u.password === password;
  });

  if (!loginUser) {
    throw new HttpError("Couldn't find user try again", 422);
  }

  res.json({ message: "You are logged in" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
