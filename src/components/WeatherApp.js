import React, { useState } from "react";
import axios from "axios";

const WeatherApp = () => {
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
    <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
      {/* Floating gradient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-cyan-400/60 blur-3xl rounded-full top-0 -left-12 mix-blend-screen animate-orb-float" />
        <div className="absolute w-80 h-80 bg-purple-500/60 blur-3xl rounded-full bottom-10 -right-16 mix-blend-screen animate-orb-float" />
        <div className="absolute w-64 h-64 bg-orange-400/40 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen animate-orb-float" />
      </div>

      {/* Header */}
      <header className="text-center mb-8 sm:mb-10 animate-fade-in-down">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-[0.35em] uppercase bg-gradient-to-r from-sky-400 via-purple-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
          SANJI Weather
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Search real-time weather & 5-day forecast for any city 🌍
        </p>
      </header>

      {/* Search Section */}
      <section className="mb-6 animate-fade-in-up">
        <form
          className="flex flex-wrap items-center justify-center gap-3"
          onSubmit={handleSubmit}
        >
          <label htmlFor="city-input" className="sr-only">
            City name
          </label>
          <input
            id="city-input"
            type="text"
            placeholder="Enter city name (e.g. Chennai, Tokyo, Berlin)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 min-w-[260px] max-w-md px-4 py-2.5 rounded-full border border-slate-500/60 bg-slate-900/90 text-slate-100 placeholder:text-slate-500 outline-none transition transform focus:-translate-y-[1px] focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:shadow-[0_0_25px_rgba(56,189,248,0.3)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 text-white font-semibold tracking-[0.15em] uppercase shadow-[0_15px_40px_rgba(37,99,235,0.7)] transition transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(37,99,235,0.75)] active:translate-y-[1px] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait disabled:transform-none disabled:shadow-none text-xs sm:text-sm"
          >
            {loading ? "Fetching..." : "Get Weather"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-center text-sm text-red-200 animate-shake">
            {error}
          </p>
        )}
      </section>

      {/* Loading */}
      {loading && (
        <section className="mt-6 flex flex-col items-center gap-3 text-slate-100">
          <div className="w-11 h-11 rounded-full border-2 border-slate-400/40 border-t-sky-400 animate-spin-slow" />
          <p className="text-sm text-slate-300">Talking to the clouds… ☁️</p>
        </section>
      )}

      {/* Current weather card */}
      {weather && !loading && (
        <section className="mt-4 animate-slide-up">
          <article className="relative overflow-hidden rounded-3xl border border-slate-500/60 bg-slate-900/95 shadow-[0_22px_50px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(129,140,248,0.25),transparent_55%)] pointer-events-none" />
            <div className="relative p-6 sm:p-7 space-y-4">
              {/* Top: city + temp */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">
                    {getFormattedDate()}
                  </p>
                </div>
                <div className="text-right sm:text-right">
                  <span className="block text-3xl sm:text-4xl font-bold">
                    {Math.round(weather.main.temp)}°C
                  </span>
                  <span className="block text-xs sm:text-sm text-slate-200/90">
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>
              </div>

              {/* Middle: status + icon */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col gap-0.5">
                  <p className="text-base sm:text-lg font-semibold">
                    {weather.weather[0].main}
                  </p>
                  <p className="text-sm text-slate-300 capitalize">
                    {weather.weather[0].description}
                  </p>
                </div>
                <div className="text-4xl sm:text-5xl drop-shadow-[0_12px_22px_rgba(15,23,42,0.9)] animate-float">
                  {getEmoji(weather.weather[0].main)}
                </div>
              </div>

              {/* Details grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-slate-500/60 bg-slate-950/80 px-3 py-2.5 shadow-glow">
                  <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                    Humidity
                  </span>
                  <span className="block text-sm sm:text-base font-semibold">
                    {weather.main.humidity}%
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-500/60 bg-slate-950/80 px-3 py-2.5 shadow-glow">
                  <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                    Wind
                  </span>
                  <span className="block text-sm sm:text-base font-semibold">
                    {weather.wind.speed} m/s
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-500/60 bg-slate-950/80 px-3 py-2.5 shadow-glow">
                  <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                    Pressure
                  </span>
                  <span className="block text-sm sm:text-base font-semibold">
                    {weather.main.pressure} hPa
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-500/60 bg-slate-950/80 px-3 py-2.5 shadow-glow">
                  <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                    Min / Max
                  </span>
                  <span className="block text-sm sm:text-base font-semibold">
                    {Math.round(weather.main.temp_min)}° /{" "}
                    {Math.round(weather.main.temp_max)}°
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Forecast section */}
      {forecast.length > 0 && !loading && (
        <section className="mt-8 animate-fade-in-up">
          <h3 className="text-xs sm:text-sm uppercase tracking-[0.22em] text-slate-400 mb-3">
            5-Day Forecast
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {forecast.map((item) => (
              <article
                key={item.dt}
                className="min-w-[135px] sm:min-w-[150px] rounded-2xl border border-slate-500/50 bg-slate-950/90 shadow-[0_12px_28px_rgba(15,23,42,0.95)] px-3 py-3 text-center grid grid-rows-[auto_auto_auto_auto_auto] items-center transition transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_18px_40px_rgba(15,23,42,0.95)] hover:border-sky-400/80"
              >
                <p className="text-sm font-semibold text-slate-100">
                  {formatDay(item.dt_txt)}
                </p>
                <span className="text-2xl my-1">
                  {getEmoji(item.weather[0].main)}
                </span>
                <p className="text-lg font-bold text-slate-50">
                  {Math.round(item.main.temp)}°C
                </p>
                <p className="text-xs text-slate-200 mt-0.5">
                  {Math.round(item.main.temp_min)}° /{" "}
                  {Math.round(item.main.temp_max)}°
                </p>
                <p className="text-[0.7rem] text-slate-400 capitalize mt-1">
                  {item.weather[0].description}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!weather && !error && !loading && (
        <section className="mt-10 text-center animate-fade-in-up">
          <p className="text-sm sm:text-base text-slate-400">
            Start by searching for a city to see its live weather ✨
          </p>
        </section>
      )}
    </main>
  );
};

export default WeatherApp;
