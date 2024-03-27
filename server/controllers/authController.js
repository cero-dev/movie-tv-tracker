const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const test = (req, res) => {
  res.json("test is working");
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken already",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.json({
        error: "Passwords do not match",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");

  res.json({ message: "Logout successful" });
};

const getMovieSearch = async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=12bf16874623571d42352c3ae1282847&query=${query}`
    );

    const movies = response.data.results;

    res.json(movies);
  } catch (error) {
    console.error("Error fetching movie search results:", error);
    res.status(500).json({
      error: "An error occurred while fetching movie search results.",
    });
  }
};

const addToFavorites = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Invalid token" });
      } else {
        try {
          const user = await User.findById(decoded.id);
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          const { movieId } = req.body;

          user.favorites.push(movieId.toString());

          await user.save();

          const profile = {
            id: user.id,
            email: user.email,
            name: user.name,
            favorites: user.favorites,
          };

          res.json(profile);
        } catch (error) {
          console.error("Error adding movie to favorites:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    });
  } else {
    res.status(401).json({ error: "Authorization token not provided" });
  }
};

const getFavorites = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Invalid token" });
      } else {
        try {
          const user = await User.findById(decoded.id);
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          const favorites = user.favorites;

          res.json({ favorites });
        } catch (error) {
          console.error("Error fetching user favorites:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    });
  } else {
    res.status(401).json({ error: "Authorization token not provided" });
  }
};

const deleteFavorite = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Invalid token" });
      } else {
        try {
          const user = await User.findById(decoded.id);
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          const { movieId } = req.params;

          const index = user.favorites.indexOf(movieId.toString());
          if (index !== -1) {
            user.favorites.splice(index, 1);
            await user.save();
            res.json({ message: "Movie removed from favorites" });
          } else {
            res.status(404).json({ error: "Movie not found in favorites" });
          }
        } catch (error) {
          console.error("Error deleting movie from favorites:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    });
  } else {
    res.status(401).json({ error: "Authorization token not provided" });
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  logoutUser,
  getMovieSearch,
  addToFavorites,
  getFavorites,
  deleteFavorite,
};
