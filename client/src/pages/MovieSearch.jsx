import React, { useState, useEffect } from "react";
import axios from "axios";

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("/favorites");
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const searchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMmJmMTY4NzQ2MjM1NzFkNDIzNTJjM2FlMTI4Mjg0NyIsInN1YiI6IjYxN2IyY2M1M2Y3ZTFkMDA0MmNkNjIyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9K0tfZBb3x_BseBgtH16HROQTz_ypOx42MMYSG93tfw",
          },
          withCredentials: false,
        }
      );
      setSearchResults(
        response.data.results.map((movie) => ({
          ...movie,
          disabled: favorites.includes(movie.id.toString()),
        }))
      );
    } catch (error) {
      setError("An error occurred while fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (movieId) => {
    try {
      await axios.post("/api/add-to-favorites", { movieId });
      setFavorites([...favorites, movieId.toString()]);
    } catch (error) {
      console.error("Error adding movie to favorites:", error);
    }
  };

  return (
    <div className="movieSearchContent">
      <h1>Movie Search</h1>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter movie title..."
        />
        <button onClick={searchMovies}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="movieSearchContent">
        <h2>Search Results:</h2>
        <ul>
          {searchResults.map((movie) => (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
              <p>Release Date: {movie.release_date}</p>
              <button
                onClick={() => addToFavorites(movie.id)}
                disabled={favorites.includes(movie.id.toString())}
              >
                {favorites.includes(movie.id.toString())
                  ? "Already in Favorites"
                  : "Add to Favorites"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieSearch;
