import React from "react";

const CircularAQI = ({ aqi}) => {
  const getColor = (value) => {
    if (value <= 600) return "#00e400"; // Good (Green)
    if (value <= 1000) return "#ffff00"; // Moderate (Yellow)
    if (value <= 2000) return "#ff7e00"; // Unhealthy for Sensitive Groups (Orange)
    if (value <= 3000) return "#ff0000"; // Unhealthy (Red)
    if (value <= 5000) return "#8f3f97"; // Very Unhealthy (Purple)
    return "#7e0023"; // Hazardous (Maroon)
  };
  console.log(aqi)
  const strokeColor = getColor(aqi);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(aqi, 8000)) / 8000 * circumference;
  
  return (
    <div className="relative w-full h-48 md:h-80 flex items-center justify-center">
      <svg className="w-full h-full rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#333" strokeWidth="10" fill="transparent" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center text-white">
        <p className="text-sm md:text-lg">Air Quality Index</p>
        <p className="text-xl md:text-3xl font-bold">{aqi || "N/A"}</p>
        <p className="text-lg md:text-xl">
          {aqi <= 600
            ? "Good"
            : aqi <= 1000
            ? "Moderate"
            : aqi <= 2000
            ? "Unhealthy for Sensitive"
            : aqi <= 3000
            ? "Unhealthy"
            : aqi <= 5000
            ? "Very Poor"
            : "Hazardous"}
        </p>
      </div>
    </div>
  );
};

export default CircularAQI;
