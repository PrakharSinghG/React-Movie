import React from "react";
import "../css/MovieCard.css";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();
  const isFav = isFavorite(movie.id);

  function onFavoriteClick(e) {
    e.stopPropagation(); // Prevent click from bubbling to card
    if (isFav) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  }

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${isFav ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;
