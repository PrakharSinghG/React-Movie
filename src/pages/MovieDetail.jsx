import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/api";
import "../css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  const director = movie.credits.crew.find((p) => p.job === "Director");
  const cast = movie.credits.cast.slice(0, 8);
  const reviews = movie.reviews.results.slice(0, 3);

  return (
    <div
      className="blurred-background"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="movie-detail">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="header">
          <div className="poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>

          <div className="info">
            <h1>{movie.title}</h1>

            {/* Genre Badges */}
            <div className="genre-badges">
              {movie.genres.map((genre) => (
                <span
                  className={`badge genre-${genre.name.toLowerCase()}`}
                  key={genre.id}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Rating Badge */}
            <div className="rating-badge">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray={`${(movie.vote_average / 10) * 100}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  {movie.vote_average.toFixed(1)}
                </text>
              </svg>
            </div>

            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p>
              <strong>Overview:</strong> {movie.overview}
            </p>
          </div>
        </div>

        <div className="section cast-section">
          <h2>Cast & Movie Makers</h2>
          <div className="cast-grid">
            {[...cast, director].filter(Boolean).map((person) => (
              <div className="cast-card" key={person.id || person.name}>
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : "https://via.placeholder.com/150x220?text=No+Image"
                  }
                  alt={person.name}
                />
                <a
                  href={`https://www.themoviedb.org/person/${person.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="name">{person.name}</p>
                </a>
                <p className="role">{person.character || person.job}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section review-section">
          <h2>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review" key={review.id}>
                <strong>{review.author}</strong>
                <p>{review.content.slice(0, 250)}...</p>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
