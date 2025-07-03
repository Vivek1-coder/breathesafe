"use client";
import { useEffect, useState, useMemo } from "react";

// AQI level utility
const getAqiLevel = (aqi) => {
  if (aqi <= 50) return { level: "Good", color: "bg-green-100 text-green-800" };
  if (aqi <= 100) return { level: "Moderate", color: "bg-yellow-100 text-yellow-800" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: "bg-orange-100 text-orange-800" };
  if (aqi <= 200) return { level: "Unhealthy", color: "bg-red-100 text-red-800" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "bg-purple-100 text-purple-800" };
  return { level: "Hazardous", color: "bg-gray-800 text-white" };
};

const POLLUTANT_KEYS_TO_SKIP = ["overall_aqi"];

const AQIPage = () => {
  const [city, setCity] = useState("delhi");
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch AQI from backend
  const fetchAQI = async (cityName) => {
    setLoading(true);
    setError(null);
    setAqiData(null);
    try {
      const res = await fetch(`/api/airquality?city=${cityName}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setAqiData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // On first mount
  useEffect(() => {
    fetchAQI(city);
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim().toLowerCase();
    if (trimmed) fetchAQI(trimmed);
  };

  // Memoized overall AQI level
  const overallLevel = useMemo(() => {
    if (!aqiData?.overall_aqi) return null;
    return getAqiLevel(aqiData.overall_aqi);
  }, [aqiData]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Air Quality Checker</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 text-gray-800">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g., Mumbai)"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get AQI
        </button>
      </form>

      {loading && <p>Loading AQI data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {aqiData && overallLevel && (
        <div className="space-y-4">
          <div className="text-lg font-medium">
            Overall AQI for <strong className="capitalize">{city}</strong>:
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${overallLevel.color}`}
            >
              {aqiData.overall_aqi} – {overallLevel.level}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(aqiData)
              .filter(([key]) => !POLLUTANT_KEYS_TO_SKIP.includes(key))
              .map(([pollutant, values]) => {
                const level = getAqiLevel(values.aqi);
                return (
                  <div
                    key={pollutant}
                    className={`rounded-xl p-4 shadow-md ${level.color}`}
                  >
                    <h2 className="text-md font-bold uppercase">{pollutant}</h2>
                    <p>Concentration: {values.concentration.toFixed(2)}</p>
                    <p>AQI: {values.aqi}</p>
                    <p className="text-sm italic">{level.level}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AQIPage;
