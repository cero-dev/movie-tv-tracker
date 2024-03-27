const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema({
  overview: String,
  poster_path: String,
  release_date: Date,
  title: String,
});

const movieModel = mongoose.model("Movie", movieSchema);

module.exports = movieModel;
