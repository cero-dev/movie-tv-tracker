const express = require("express");
const router = express.Router();
const cors = require("cors");

const {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getMovieSearch,
  addToFavorites,
  getFavorites,
  deleteFavorite,
} = require("../controllers/authController");

// Middleware
router.use(
  cors({
    credentials: true,
    origin: "movie-tv-tracker.onrender.com:5173",
  })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/moviesearch", getMovieSearch);
router.get("/favorites", getFavorites);
router.patch("/favorites/:movieId", deleteFavorite);

router.post("/logout", logoutUser);

router.post("/api/add-to-favorites", addToFavorites);

module.exports = router;
