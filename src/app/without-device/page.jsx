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
  const fetchAQI = async (city) => {
    setLoading(true);
    setError(null);
    setAqiData(null);
    try {
      const res = await fetch(`/api/airquality?city=${city}`);
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
  }, [city]);

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
<section className="min-h-screen p-6 sm:p-10 bg-black text-white">
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g., Mumbai, Delhi, New York)"
          className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-lg transition-all duration-300"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold text-lg transition-transform transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Checking...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Get AQI
          </span>
        )}
      </button>
    </form>
  </div>

  {loading && (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8 text-center mb-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-400/40 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4h1a5 5 0 015-5 5 5 0 015 5h1a4 4 0 010 8H7a4 4 0 01-4-4z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-300 text-lg">Fetching air quality data...</p>
      </div>
    </div>
  )}

  {error && (
    <div className="bg-red-500/10 border border-red-400/40 rounded-2xl p-6 mb-8 text-red-300">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-semibold">Error occurred</h3>
          <p>{error}</p>
        </div>
      </div>
    </div>
  )}

{/* Results Section */}
{aqiData && overallLevel && (
  <div className="space-y-8 animate-fadeIn">
    {/* Overall AQI Card */}
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Location Marker Icon in place of "📍" */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.418 0 8-3.134 8-7 0-4-3.582-7-8-7s-8 3-8 7c0 3.866 3.582 7 8 7z" />
            </svg>
            <h2 className="text-2xl font-bold capitalize mb-2">
              {city}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{aqiData.overall_aqi}</div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${overallLevel.color} bg-white/20`}>
              {overallLevel.level}
            </span>
          </div>
        </div>
        <p className="text-blue-100">Overall Air Quality Index</p>
      </div>
      
      {/* AQI Scale Indicator */}
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Good</span>
          <span>Moderate</span>
          <span>Unhealthy</span>
          <span>Hazardous</span>
        </div>
        <div className="relative h-3 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-full">
          <div 
            className="absolute top-0 w-4 h-4 bg-white border-2 border-gray-800 rounded-full transform -translate-y-0.5"
            style={{ left: `${Math.min((aqiData.overall_aqi / 500) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>

    {/* Pollutants Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(aqiData)
        .filter(([key]) => !POLLUTANT_KEYS_TO_SKIP.includes(key))
        .map(([pollutant, values], index) => {
          const level = getAqiLevel(values.aqi);
          return (
            <div
              key={pollutant}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-2 ${level.color.replace('text-', 'bg-').replace('bg-white', 'bg-gray-200')}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                    {pollutant}
                  </h3>
                  <div className={`w-3 h-3 rounded-full ${level.color.replace('text-', 'bg-').replace('bg-white', 'bg-gray-200')}`}></div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">AQI Value</span>
                    <span className="text-2xl font-bold text-gray-800">{values.aqi}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Concentration</span>
                    <span className="font-semibold text-gray-700">
                      {values.concentration.toFixed(2)} µg/m³
                    </span>
                  </div>
                  
                  <div className={`text-center py-2 px-4 rounded-lg font-semibold ${level.color}`}>
                    {level.level}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>

    {/* Health Recommendations */}
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
        {/* Info icon replacing the light bulb emoji */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 00-10 10c0 3.866 3.582 7 8 7 1.654 0 3.173-.532 4.4-1.422L15 18h2l-.6-1.422A7.965 7.965 0 0022 12a10 10 0 00-10-10z" />
        </svg>
        Health Recommendations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getHealthRecommendations(overallLevel.level).map((rec, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            {/* Render Icon */}
            {rec.icon}
            <p className="text-gray-700">{rec.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
</section>
  );
};

export default AQIPage;


const getHealthRecommendations = (level) => {
  const recommendations = {
    'Good': [
      { icon: '🚶‍♂️', text: 'Perfect for outdoor activities and exercise' },
      { icon: '🌱', text: 'Great air quality for everyone' }
    ],
    'Moderate': [
      { icon: '😷', text: 'Sensitive individuals should limit outdoor exposure' },
      { icon: '🏃‍♂️', text: 'Reduce prolonged outdoor exertion' }
    ],
    'Unhealthy for Sensitive Groups': [
      { icon: '⚠️', text: 'Children and elderly should stay indoors' },
      { icon: '🏠', text: 'Use air purifiers if available' }
    ],
    'Unhealthy': [
      { icon: '🚫', text: 'Avoid outdoor activities' },
      { icon: '😷', text: 'Wear masks when going outside' }
    ],
    'Very Unhealthy': [
      { icon: '🏠', text: 'Stay indoors with windows closed' },
      { icon: '💨', text: 'Use air purifiers and avoid outdoor exposure' }
    ],
    'Hazardous': [
      { icon: '🚨', text: 'Emergency conditions - stay indoors' },
      { icon: '🏥', text: 'Seek medical attention if experiencing symptoms' }
    ]
  };
  
  return recommendations[level] || recommendations['Moderate'];
};