# Minor Project 03 — Weather App + Movie Search App

This project follows the uploaded assignment requirements: two responsive web applications, public API integration, dynamic DOM updates, ES6+ JavaScript, `fetch`, promises, `async/await`, and error handling.

## Project structure

```text
minor_project_03_web/
├── index.html
├── README.md
├── css/
│   ├── home.css
│   └── shared.css
├── weather/
│   ├── index.html
│   ├── weather.css
│   └── weather.js
└── movie/
    ├── index.html
    ├── movie.css
    └── movie.js
```

## Run the project

1. Download and extract the project folder.
2. Open the folder in VS Code.
3. Install the **Live Server** extension if you do not already have it.
4. Right-click the root `index.html` and choose **Open with Live Server**.
5. Select Weather App or Movie Search from the home page.

Do not open the HTML files by double-clicking if the browser blocks API requests. Use Live Server instead.

## Weather App API

The Weather App uses the free Open-Meteo APIs and does not need an API key:
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Current weather: `https://api.open-meteo.com/v1/forecast`

It shows city, local time, temperature, condition, humidity, wind speed, and feels-like temperature. Try a city such as Bengaluru, London, or Tokyo.

## Movie Search API setup

The Movie Search App uses the OMDb API. A free API key is required.

1. Visit https://www.omdbapi.com/apikey.aspx
2. Request a free key and follow the provider's activation instructions.
3. Open `movie/movie.js` in VS Code.
4. Find this line near the top:

   ```js
   const OMDB_API_KEY = "YOUR_OMDB_API_KEY";
   ```

5. Replace `YOUR_OMDB_API_KEY` with your actual key, keeping the quotation marks. Example format:

   ```js
   const OMDB_API_KEY = "your_key_here";
   ```

6. Save the file and refresh the page.

**Important:** This beginner project keeps the API key in client-side JavaScript, so it is visible to anyone who views the source. Do not use a private or paid key in a public repository. For a classroom demo, use a key intended for this purpose and follow the provider's terms. A production app should keep secrets on a backend server.

## Requirements covered

- Search weather by city name.
- Display current temperature and weather conditions.
- Display humidity and wind speed (plus feels-like temperature).
- Search movies using a public movie database API.
- Display posters, movie details, ratings, and release years.
- Handle missing cities, invalid movie searches, network errors, and missing posters.
- Responsive user interface for desktop and mobile.
- ES6+ features: `const`, arrow functions, template literals, destructuring-compatible API data access, `async/await`, `fetch`, promises, event handling, and dynamic DOM rendering.
- Separate HTML, CSS, and JavaScript files.

## GitHub submission

From a terminal opened in this project folder:

```bash
git init
git add .
git commit -m "Complete Minor Project 03 Weather and Movie Apps"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Create an empty repository on GitHub first, then replace the example remote URL with your repository URL. Do not commit API keys to a public repository.
