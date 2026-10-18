const weatherForm = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const statusMessage = document.querySelector("#weather-status");
const resultPanel = document.querySelector("#weather-result");

const weatherDescriptions = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"], 45: ["Fog", "🌫️"], 48: ["Depositing rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Moderate drizzle", "🌦️"], 55: ["Dense drizzle", "🌧️"],
  56: ["Light freezing drizzle", "🌧️"], 57: ["Dense freezing drizzle", "🌧️"],
  61: ["Slight rain", "🌧️"], 63: ["Moderate rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  66: ["Light freezing rain", "🌧️"], 67: ["Heavy freezing rain", "🌧️"],
  71: ["Slight snow", "🌨️"], 73: ["Moderate snow", "🌨️"], 75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "🌨️"], 80: ["Rain showers", "🌦️"], 81: ["Moderate rain showers", "🌧️"],
  82: ["Violent rain showers", "⛈️"], 85: ["Snow showers", "🌨️"], 86: ["Heavy snow showers", "❄️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm with hail", "⛈️"], 99: ["Thunderstorm with heavy hail", "⛈️"]
};

const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
};

async function getCoordinates(city) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not contact the city search service. Please try again.");
  const data = await response.json();
  if (!data.results?.length) throw new Error("City not found. Check the spelling and try again.");
  return data.results[0];
}

async function getCurrentWeather(latitude, longitude) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude, longitude, current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    timezone: "auto"
  });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load weather data. Please try again later.");
  return response.json();
}

function displayWeather(place, data) {
  const current = data.current;
  const [description, icon] = weatherDescriptions[current.weather_code] ?? ["Unknown conditions", "🌡️"];
  document.querySelector("#location-name").textContent =
    [place.name, place.admin1, place.country].filter((part, index, arr) => part && arr.indexOf(part) === index).join(", ");
  document.querySelector("#local-time").textContent = `Local time: ${current.time.replace("T", " ")}`;
  document.querySelector("#weather-icon").textContent = icon;
  document.querySelector("#temperature").textContent = `${Math.round(current.temperature_2m)}°C`;
  document.querySelector("#condition").textContent = description;
  document.querySelector("#humidity").textContent = `${current.relative_humidity_2m}%`;
  document.querySelector("#wind").textContent = `${current.wind_speed_10m} km/h`;
  document.querySelector("#feels-like").textContent = `${Math.round(current.apparent_temperature)}°C`;
  resultPanel.hidden = false;
}

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Please enter a city name.", true);
    return;
  }
  searchButton.disabled = true;
  searchButton.textContent = "Searching...";
  resultPanel.hidden = true;
  setStatus("Getting current weather...");
  try {
    const place = await getCoordinates(city);
    const weather = await getCurrentWeather(place.latitude, place.longitude);
    displayWeather(place, weather);
    setStatus("Weather updated successfully.");
  } catch (error) {
    setStatus(error.message || "Something went wrong. Please try again.", true);
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
  }
});
