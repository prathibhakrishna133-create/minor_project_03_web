// OMDb API key: get a free key at https://www.omdbapi.com/apikey.aspx
// Paste your key between the quotation marks below.
const OMDB_API_KEY = "fcda9ff3";

const movieForm = document.querySelector("#movie-form");
const movieInput = document.querySelector("#movie-input");
const searchButton = document.querySelector("#movie-search-button");
const statusMessage = document.querySelector("#movie-status");
const resultsContainer = document.querySelector("#movie-results");

const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
};

async function searchMovies(title) {
  const url = new URL("https://www.omdbapi.com/");
  url.search = new URLSearchParams({ apikey: OMDB_API_KEY, s: title, type: "movie" });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not contact the movie service. Please try again.");
  const data = await response.json();
  if (data.Response === "False") throw new Error(data.Error || "No movies found. Try another title.");
  return data.Search ?? [];
}

async function getMovieDetails(imdbID) {
  const url = new URL("https://www.omdbapi.com/");
  url.search = new URLSearchParams({ apikey: OMDB_API_KEY, i: imdbID, plot: "short" });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load one movie's details.");
  const data = await response.json();
  if (data.Response === "False") throw new Error(data.Error || "Movie details unavailable.");
  return data;
}

function makeTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function renderMovie(movie) {
  const card = document.createElement("article");
  card.className = "movie-card";

  const posterWrap = document.createElement("div");
  posterWrap.className = "poster-wrap";
  if (movie.Poster && movie.Poster !== "N/A") {
    const poster = document.createElement("img");
    poster.className = "poster";
    poster.src = movie.Poster;
    poster.alt = `${movie.Title} movie poster`;
    poster.loading = "lazy";
    poster.onerror = () => {
      poster.remove();
      posterWrap.append(makeTextElement("span", "no-poster", "Poster not available"));
    };
    posterWrap.append(poster);
  } else {
    posterWrap.append(makeTextElement("span", "no-poster", "Poster not available"));
  }

  const info = document.createElement("div");
  info.className = "movie-info";
  info.append(makeTextElement("h2", "movie-title", movie.Title || "Untitled"));
  const meta = document.createElement("div");
  meta.className = "movie-meta";
  meta.append(makeTextElement("span", "", movie.Year || "Release year unavailable"));
  meta.append(makeTextElement("span", "rating", movie.imdbRating && movie.imdbRating !== "N/A" ? `★ ${movie.imdbRating}/10` : "Rating N/A"));
  info.append(meta);
  info.append(makeTextElement("span", "movie-type", movie.Type || "movie"));
  if (movie.Plot && movie.Plot !== "N/A") info.append(makeTextElement("p", "movie-plot", movie.Plot));
  card.append(posterWrap, info);
  return card;
}

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = movieInput.value.trim();
  if (!title) {
    setStatus("Please enter a movie title.", true);
    return;
  }
  if (OMDB_API_KEY === "YOUR_OMDB_API_KEY") {
    setStatus("Add your free OMDb API key in movie/movie.js before searching. See README.md.", true);
    return;
  }

  searchButton.disabled = true;
  searchButton.textContent = "Searching...";
  resultsContainer.replaceChildren();
  setStatus("Searching the movie database...");
  try {
    const matches = await searchMovies(title);
    // Fetch detailed records so ratings and plots can be displayed.
    const details = await Promise.all(matches.slice(0, 9).map(async (item) => {
      try { return await getMovieDetails(item.imdbID); }
      catch { return item; }
    }));
    resultsContainer.replaceChildren(...details.map(renderMovie));
    setStatus(`Showing ${details.length} result${details.length === 1 ? "" : "s"} for “${title}”.`);
  } catch (error) {
    setStatus(error.message || "Something went wrong. Please try again.", true);
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search movies";
  }
});
