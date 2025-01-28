'use client'
import { useEffect, useState } from "react";
import GasChart from "../components/GasChart";

export default function Home() {
  const [gasData, setGasData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/getData");
      const data = await response.json();
      setGasData(data.gasData); // Access gasData from the response
    }
    fetchData();
  }, []);

  return (
    <div className="relative w-full h-full">
      <h1 className="w- text-center m-5 font-extrabold text-5xl">Welcome to Breathe Safe</h1>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl text-center p-5">AQI of your home : </h1>
        {gasData.length > 0 ? (
          <GasChart data={gasData} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      <div className="w-full flex justify-between p-5">
        <div className="flex flex-col w-1/3 h-96 bg-blue-600 bg-transparent bg-opacity-30 shadow-md shadow-violet-400 m-5 rounded-xl">
          <h1 className="text-xl text-center m-3">Precautions : </h1>
          <div></div>
        </div>
        <div className="flex flex-col w-1/3 h-96 bg-green-500 bg-transparent bg-opacity-50 shadow-md shadow-violet-400 m-5 rounded-xl">
          <h1 className="text-xl text-center m-3">What to do for a better future : </h1>
          <div></div>
        </div>
      </div>
    </div>
  );
}
