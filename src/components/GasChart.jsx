import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

// const gasData = [
//   { timestamp: "2025-03-28T10:00:00", pm1_0: 20, pm2_5: 55, pm10: 120 },
//   { timestamp: "2025-03-28T10:05:00", pm1_0: 40, pm2_5: 75, pm10: 180 },
//   { timestamp: "2025-03-28T10:10:00", pm1_0: 60, pm2_5: 110, pm10: 250 },
// ];

const PollutionChart = ({gasData}) => {
  console.log("gas",gasData)
  if(!gasData){
    gasData=[]
  }
const getSafetyLabel = (value, type) => {
  const thresholds = {
    pm1_0: [
      { limit: 30, label: "Good", color: "green" },
      { limit: 60, label: "Moderate", color: "yellow" },
      { limit: 90, label: "Unhealthy", color: "orange" },
      { limit: Infinity, label: "Hazardous", color: "red" },
    ],
    pm2_5: [
      { limit: 50, label: "Good", color: "green" },
      { limit: 100, label: "Moderate", color: "yellow" },
      { limit: 150, label: "Unhealthy", color: "orange" },
      { limit: Infinity, label: "Hazardous", color: "red" },
    ],
    pm10: [
      { limit: 100, label: "Good", color: "green" },
      { limit: 200, label: "Moderate", color: "yellow" },
      { limit: 300, label: "Unhealthy", color: "orange" },
      { limit: Infinity, label: "Hazardous", color: "red" },
    ],
  };

  const safety = thresholds[type].find(({ limit }) => value <= limit);
  return safety ? safety.label : "Unknown";
};

const chartData = {
  labels: gasData.map((data) => new Date(data.timestamp).toLocaleTimeString()),
  datasets: [
    {
      label: "PM1.0",
      data: gasData.map((data) => data.pm1_0),
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.2)",
    },
    {
      label: "PM2.5",
      data: gasData.map((data) => data.pm2_5),
      borderColor: "red",
      backgroundColor: "rgba(255, 0, 0, 0.2)",
    },
    {
      label: "PM10",
      data: gasData.map((data) => data.pm10),
      borderColor: "green",
      backgroundColor: "rgba(0, 255, 0, 0.2)",
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    x: {
      type: "category",
    },
    y: {
      min: 0,
      max: 500,
      ticks: { stepSize: 50 },
    },
  },
  plugins: {
    legend: { display: true },
    tooltip: {
      callbacks: {
        label: function (context) {
          const dataPoint = gasData[context.dataIndex]; // Get the full data row
          if (!dataPoint) return `${context.dataset.label}: ${context.raw}`;

          const pollutantKey = context.dataset.label.toLowerCase().replace(".", "_"); // Convert dataset label
          const pollutantValue = dataPoint[pollutantKey];

          if (pollutantValue === undefined) return `${context.dataset.label}: ${context.raw}`;

          const safetyLabel = getSafetyLabel(pollutantValue, pollutantKey);
          return `${context.dataset.label}: ${context.raw} (${safetyLabel})`;
        },
      },
    },
  },
};


  return <Line data={chartData} options={options} />;
};

export default PollutionChart;
