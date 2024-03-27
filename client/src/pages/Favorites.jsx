import React, { useState, useEffect } from "react";
import axios from "axios";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/favorites");

        setFavorites(response.data.favorites);
      } catch (error) {
        setError("An error occurred while fetching favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const movieDetailsPromises = favorites.map((movieId) =>
        fetchMovieDetails(movieId)
      );
      const movieDetails = await Promise.all(movieDetailsPromises);
      setMovies(movieDetails.filter(Boolean));
    };

    fetchMovies();
  }, [favorites]);

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMmJmMTY4NzQ2MjM1NzFkNDIzNTJjM2FlMTI4Mjg0NyIsInN1YiI6IjYxN2IyY2M1M2Y3ZTFkMDA0MmNkNjIyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9K0tfZBb3x_BseBgtH16HROQTz_ypOx42MMYSG93tfw",
          },
          withCredentials: false,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      await axios.patch(`/favorites/${movieId}`);

      const response = await axios.get("/favorites");
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error("Error removing movie from favorites:", error);
    }
  };

  return (
    <div className="favoritesContent">
      <h1>Favorite Movies</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {movies.length > 0 ? (
          <ul>
            {movies.map((movieDetails) => (
              <li key={movieDetails.id}>
                <h3>{movieDetails.title}</h3>
                <p>{movieDetails.overview}</p>
                <p>Release Date: {movieDetails.release_date}</p>
                <button onClick={() => removeFromFavorites(movieDetails.id)}>
                  Remove from Favorites
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite movies found.</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;
