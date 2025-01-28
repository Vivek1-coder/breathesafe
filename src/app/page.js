'use client'
import { useEffect, useState } from "react";
import GasChart from "../components/GasChart";

export default function Home() {
  const [gasData, setGasData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/getData");
      const data = await response.json();
      setGasData(data);
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>MQ135 Gas Sensor Data</h1>
      {gasData.length > 0 ? (
        <GasChart data={gasData} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
