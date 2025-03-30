import React, { useState, useEffect } from "react";

const CircularChart = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pollutants = ["co2", "pm1_0", "pm2_5", "pm10"];
  const pollutantNames = {
    co2: "🌿 CO₂",
    pm1_0: "💨 PM1.0",
    pm2_5: "🌫 PM2.5",
    pm10: "🏭 PM10",
  };

  const latestData = data.length > 0 ? data[0] : null;
  const currentPollutant = pollutants[currentIndex];
  const currentValue = latestData ? latestData[currentPollutant] : 0;

  const thresholds = {
    co2: {
      max: 10000,
      levels: [
        { limit: 600, color: "#00e400", label: "✅ Good CO₂" },
        { limit: 1000, color: "#ffff00", label: "⚠️ Moderate CO₂" },
        { limit: 2000, color: "#ff7e00", label: "🌫 Unhealthy for Sensitive CO₂" },
        { limit: 5000, color: "#ff0000", label: "🚨 Unhealthy CO₂" },
        { limit: 10000, color: "#8f3f97", label: "🔥 Very Poor CO₂" },
        { limit: Infinity, color: "#7e0023", label: "☠️ Hazardous CO₂" },
      ],
    },
    pm1_0: {
      max: 150,
      levels: [
        { limit: 30, color: "#00e400", label: "✅ Good PM1.0" },
        { limit: 60, color: "#ffff00", label: "⚠️ Moderate PM1.0" },
        { limit: 90, color: "#ff7e00", label: "🌫 Unhealthy PM1.0" },
        { limit: 150, color: "#ff0000", label: "🚨 Very Unhealthy PM1.0" },
        { limit: Infinity, color: "#7e0023", label: "☠️ Hazardous PM1.0" },
      ],
    },
    pm2_5: {
      max: 250,
      levels: [
        { limit: 50, color: "#00e400", label: "✅ Good PM2.5" },
        { limit: 100, color: "#ffff00", label: "⚠️ Moderate PM2.5" },
        { limit: 150, color: "#ff7e00", label: "🌫 Unhealthy PM2.5" },
        { limit: 250, color: "#ff0000", label: "🚨 Very Unhealthy PM2.5" },
        { limit: Infinity, color: "#7e0023", label: "☠️ Hazardous PM2.5" },
      ],
    },
    pm10: {
      max: 500,
      levels: [
        { limit: 100, color: "#00e400", label: "✅ Good PM10" },
        { limit: 200, color: "#ffff00", label: "⚠️ Moderate PM10" },
        { limit: 300, color: "#ff7e00", label: "🌫 Unhealthy PM10" },
        { limit: 500, color: "#ff0000", label: "🚨 Very Unhealthy PM10" },
        { limit: Infinity, color: "#7e0023", label: "☠️ Hazardous PM10" },
      ],
    },
  };

  const { max, levels } = thresholds[currentPollutant];
  const { color: strokeColor, label: airQualityLabel } = levels.find(({ limit }) => currentValue <= limit);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(currentValue, max)) / max * circumference;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pollutants.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 md:h-80 flex items-center justify-center transition-all duration-700 ease-in-out">
      <svg className="w-full h-full rotate-90 transition-all duration-500 ease-in-out" viewBox="0 0 120 120">
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
          className="transition-all duration-700 ease-in-out"
        />
      </svg>
      <div className="absolute text-center text-white transition-all duration-500 ease-in-out">
        <p className="text-sm md:text-lg">{pollutantNames[currentPollutant]} Level</p>
        <p className="text-xl md:text-3xl font-bold">{currentValue || "N/A"}</p>
        <p className="text-lg md:text-xl">{airQualityLabel}</p>
      </div>
    </div>
  );
};

export default CircularChart;
