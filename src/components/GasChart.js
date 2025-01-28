'use client'
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GasChart({ data }) {
  const chartData = {
    labels: data.map((entry) =>
      new Date(entry.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Gas Concentration (PPM)",
        data: data.map((entry) => entry.ppm),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Smooth curves
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "MQ135 Gas Concentration Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "PPM",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
