import React, { useEffect, useState } from "react";
import WeatherApp from "./components/WeatherApp";

function App() {
  const [theme, setTheme] = useState("dark"); // "dark" | "light"

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen font-sans">
      <WeatherApp theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
