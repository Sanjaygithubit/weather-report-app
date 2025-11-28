import React, { useState } from "react";
import axios from "axios";

const WeatherApp = ({ theme, onToggleTheme }) => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      setForecast([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentWeatherPromise = axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      const forecastPromise = axios.get(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      const [currentRes, forecastRes] = await Promise.all([
        currentWeatherPromise,
        forecastPromise,
      ]);

      setWeather(currentRes.data);

      const daily = forecastRes.data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);

      setForecast(daily);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("City not found. Try another city name.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleString(undefined, {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEmoji = (main) => {
    switch (main) {
      case "Rain":
        return "🌧️";
      case "Clouds":
        return "☁️";
      case "Clear":
        return "☀️";
      case "Snow":
        return "❄️";
      case "Thunderstorm":
        return "⛈️";
      case "Drizzle":
        return "🌦️";
      default:
        return "🌤️";
    }
  };

  const formatDay = (dtTxt) => {
    const date = new Date(dtTxt);
    return date.toLocaleDateString(undefined, { weekday: "short" });
  };

  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      {/* Floating gradient orbs */}
      <div className="pointer-events-none fixed -left-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/50 blur-3xl mix-blend-screen animate-orb-float" />
      <div className="pointer-events-none fixed -right-24 bottom-10 h-80 w-80 rounded-full bg-fuchsia-500/50 blur-3xl mix-blend-screen animate-orb-float [animation-delay:4s]" />
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/40 blur-3xl mix-blend-screen animate-orb-float [animation-delay:8s]" />

      {/* Header */}
      <header className="mb-8 animate-fade-in-down">
        <div className="mb-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="bg-gradient-to-tr from-sky-400 via-fuchsia-500 to-orange-400 bg-clip-text text-3xl font-extrabold uppercase tracking-[0.3em] text-transparent sm:text-4xl">
            SkySense Weather
          </h1>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-slate-500/70 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-100 shadow-lg shadow-slate-950/70 transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-500/70 dark:hover:border-sky-400 dark:hover:bg-slate-900
                       bg-white/90 text-slate-900 dark:bg-slate-900"
          >
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-400">
          Search real-time weather & 5-day forecast for any city 🌍
        </p>
      </header>

      {/* Search */}
      <section className="mb-6 animate-fade-in-up">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <label htmlFor="city-input" className="visually-hidden">
            City name
          </label>
          <input
            id="city-input"
            type="text"
            placeholder="Enter city name (e.g. Chennai, Tokyo, Berlin)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="min-w-[260px] flex-1 rounded-full border border-slate-500/70 bg-slate-900/90 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:shadow-[0_0_0_1px_rgba(56,189,248,0.8)] focus:bg-slate-900/95
                       dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-500/70 dark:focus:border-sky-400
                       bg-white/90 text-slate-900 dark:bg-slate-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_15px_40px_rgba(37,99,235,0.65)] transition hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_20px_45px_rgba(37,99,235,0.75)] active:translate-y-0 disabled:cursor-wait disabled:opacity-70 disabled:shadow-none"
          >
            {loading ? "Fetching..." : "Get Weather"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-center text-sm text-red-300 animate-shake dark:text-red-300">
            {error}
          </p>
        )}
      </section>

      {/* Loading */}
      {loading && (
        <section className="mt-4 flex flex-col items-center gap-2 text-slate-200 dark:text-slate-100">
          <div className="h-10 w-10 rounded-full border-4 border-slate-500/50 border-t-sky-400 animate-spin" />
          <p className="text-sm">Talking to the clouds… ☁️</p>
        </section>
      )}

      {/* Current Weather */}
      {weather && !loading && (
        <section className="mt-2 animate-slide-up">
          <article
            className="relative overflow-hidden rounded-3xl border border-slate-500/60 bg-slate-900/95 p-6 shadow-glass backdrop-blur-xl dark:bg-slate-900/95 dark:border-slate-500/60
                       bg-white/95 text-slate-900 dark:text-slate-100"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(129,140,248,0.25),transparent_55%)] opacity-90" />

            <div className="relative z-10 space-y-5">
              {/* Top: city + temp */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p className="mt-1 text-xs text-slate-300 dark:text-slate-400">
                    {getFormattedDate()}
                  </p>
                </div>
                <div className="text-right sm:text-right">
                  <span className="block text-4xl font-bold sm:text-5xl">
                    {Math.round(weather.main.temp)}°C
                  </span>
                  <span className="mt-1 block text-xs text-slate-200 dark:text-slate-300">
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>
              </div>

              {/* Middle: status + icon */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-base font-semibold">
                    {weather.weather[0].main}
                  </p>
                  <p className="text-sm capitalize text-slate-200 dark:text-slate-300">
                    {weather.weather[0].description}
                  </p>
                </div>
                <div className="text-4xl drop-shadow-[0_12px_22px_rgba(15,23,42,0.9)] animate-float">
                  {getEmoji(weather.weather[0].main)}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <DetailCard label="Humidity">
                  {weather.main.humidity}%
                </DetailCard>
                <DetailCard label="Wind">
                  {weather.wind.speed} m/s
                </DetailCard>
                <DetailCard label="Pressure">
                  {weather.main.pressure} hPa
                </DetailCard>
                <DetailCard label="Min / Max">
                  {Math.round(weather.main.temp_min)}° /{" "}
                  {Math.round(weather.main.temp_max)}°
                </DetailCard>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Forecast */}
      {forecast.length > 0 && !loading && (
        <section className="mt-8 animate-fade-in-up">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-400">
            5-Day Forecast
          </h3>
          <div className="forecast-scroll flex gap-3 overflow-x-auto pb-2">
            {forecast.map((item) => (
              <article
                key={item.dt}
                className="min-w-[140px] rounded-2xl border border-slate-500/50 bg-slate-900/90 p-3 text-center shadow-lg shadow-slate-950/90 backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl dark:bg-slate-900/90
                           bg-white/95 text-slate-900 dark:text-slate-100"
              >
                <p className="text-sm font-semibold">
                  {formatDay(item.dt_txt)}
                </p>
                <div className="my-1 text-2xl">{getEmoji(item.weather[0].main)}</div>
                <p className="text-base font-bold">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="mt-0.5 text-xs text-slate-300 dark:text-slate-300">
                  {Math.round(item.main.temp_min)}° /{" "}
                  {Math.round(item.main.temp_max)}°
                </p>
                <p className="mt-1 text-[11px] capitalize text-slate-400 dark:text-slate-400">
                  {item.weather[0].description}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!weather && !error && !loading && (
        <section className="mt-10 text-center text-sm text-slate-400 animate-fade-in-up">
          Start by searching for a city to see its live weather ✨
        </section>
      )}
    </main>
  );
};

const DetailCard = ({ label, children }) => (
  <div className="rounded-2xl border border-slate-500/60 bg-slate-900/85 p-3 shadow-md shadow-slate-950/80 dark:bg-slate-900/85
                 bg-slate-100/90 dark:bg-slate-900/85">
    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400">
      {label}
    </span>
    <span className="mt-1 block text-sm font-semibold">{children}</span>
  </div>
);

export default WeatherApp;
