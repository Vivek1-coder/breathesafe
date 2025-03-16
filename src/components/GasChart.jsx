'use client'
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement } from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale);

const GasChart = ({ data }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter data to only include today's AQI readings
  const filteredData = data.filter((dataPoint) => {
    return new Date(dataPoint.timestamp).toISOString().split("T")[0] === today;
  });

  const chartAreaBackgroundPlugin = {
    id: "chartAreaBackground",
    beforeDraw: (chart) => {
      const { ctx, chartArea: { top, bottom, left, right }, scales: { y } } = chart;
      
      // Define AQI level colors with reduced opacity and labels
      const aqiLevels = [
        { limit: 600, color: "rgba(0, 228, 0, 0.5)", label: isSmallScreen ? "" : "Good" },
        { limit: 1000, color: "rgba(255, 255, 0, 0.5)", label: isSmallScreen ? "" : "Moderate" },
        { limit: 2000, color: "rgba(255, 126, 0, 0.5)", label: isSmallScreen ? "" : "Unhealthy for Sensitive Groups" },
        { limit: 3000, color: "rgba(255, 0, 0, 0.5)", label: isSmallScreen ? "" : "Unhealthy" },
        { limit: 5000, color: "rgba(143, 63, 151, 0.5)", label: isSmallScreen ? "" : "Very Unhealthy" },
        { limit: 20000, color: "rgba(126, 0, 35, 0.5)", label: isSmallScreen ? "" : "Hazardous" },
      ];

      let prevPosition = bottom;
      aqiLevels.forEach(({ limit, color, label }) => {
        const position = y.getPixelForValue(limit);
        ctx.fillStyle = color;
        ctx.fillRect(left, position, right - left, prevPosition - position);
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        ctx.fillText(label, right - 5, position + 9);
        prevPosition = position;
      });
    },
  };

  const chartData = {
    labels: filteredData.map((dataPoint) => new Date(dataPoint.timestamp)),
    datasets: [
      {
        label: "AQI",
        data: filteredData.map((dataPoint) => dataPoint.ppm),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          tooltipFormat: "yyyy-MM-dd HH:mm",
        },
      },
      y: {
        min: 0,
        max: 500,
        ticks: {
          stepSize: 50,
        },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (context) {
            const yValue = context.raw;
            return `AQI: ${yValue}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="md:h-full">
      <Line data={chartData} options={options} plugins={[chartAreaBackgroundPlugin]} />
    </div>
  );
};

export default GasChart;
