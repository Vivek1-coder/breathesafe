import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement } from "chart.js";
import 'chartjs-adapter-date-fns'; // Import the adapter

// Register the necessary chart elements
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale);

const GasChart = ({ data }) => {
  const chartData = {
    labels: data.map((dataPoint) => new Date(dataPoint.timestamp)), // Convert timestamps to Date objects
    datasets: [
      {
        label: 'Gas PPM',
        data: data.map((dataPoint) => dataPoint.ppm), // Map ppm values
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute', // You can change the unit as per your requirement (e.g., 'hour', 'day')
          tooltipFormat: 'll HH:mm',
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default GasChart;
