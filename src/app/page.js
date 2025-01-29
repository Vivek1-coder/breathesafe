'use client'

import { useEffect, useState } from "react";
import GasChart from "../components/GasChart";
import CircularAQI from "../components/CircularChart.jsx";
import {leaf} from "../../public/leaf.svg"

export default function Home() {
  const [gasData, setGasData] = useState([]);
  const [loadert, setloadert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadert2, setloadert2] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [input, setInput] = useState("");
  const [precautions, setPrecautions] = useState("");

  const fetchAQIResponse = async () => {
    setloadert(true);
    try {
      // Extract ppm values from gasData
      const ppmArray = gasData.map(data => data.ppm);

      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ppm: ppmArray }) // Send ppm array
      });

      const json = await res.json();
      setInput(json.output);
    } catch (error) {
      console.error("Error fetching data:", error);
      setInput("Failed to fetch data.");
    }
    setloadert(false);
    setLoading(false);
  };

  const fetchAQIPrecautions = async () => {
    setloadert2(true);
    try {
      // Extract ppm values from gasData
      const ppmArray = gasData.map(data => data.ppm);

      const res = await fetch("/api/precautions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ppm: ppmArray }) // Send ppm array
      });

      const json = await res.json();
      setPrecautions(json.output);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPrecautions("Failed to fetch data.");
    }
    setloadert2(false);
    setLoading2(false);
  };

 

  const boldText = (text) => {
    const parts = text.split(/(\*[^*]+\*)/g); // Split text at '~' boundaries
    return parts.map((part, index) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <strong key={index} className="font-extrabold">{part.slice(1, -1)}</strong>
      ) : (
        part
      )
    );
  };

  const formatToTable = (input) => {
    return input.split("///").map((point) => {
      const [mainPoint, ...subPoints] = point.split("~").map((p) => p.trim());
      return { mainPoint, subPoints };
    });
  };

  const tableData = formatToTable(input);
  const tableData2 = formatToTable(precautions);

  const colors = ["bg-orange-600","bg-blue-600",  "bg-gray-600","bg-green-600"];

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/getData");
      const data = await response.json();
      setGasData(data.gasData); // Access gasData from the response
      
    }
    
    fetchData();
  }, []);
  console.log(input)

  return (
    <div className="relative w-full h-full">
      <h1 className="w- text-center m-5 font-bold md:font-extrabold text-2xl md:text-5xl">Welcome to Breathe Sa🌿e</h1>
      
      <h1 className=" text-lg md:text-3xl text-center p-5">AQI of your home 🏡 </h1>
        <div className="flex flex-wrap w-full px-6 mt-4 md:justify-between gap-3">
        <div className="flex justify-center w-full md:w-1/3 bg-slate-500 bg-opacity-20 rounded-lg items-center ">
          <CircularAQI aqi={gasData[0]?.ppm || 0}/>
        </div>
        
        
        <div className="w-full md:w-3/5 md:h-1/2 bg-slate-500 bg-opacity-20 md:p-4 rounded-lg">
        {gasData.length > 0 ? (
          <GasChart data={gasData} />
        ) : (
          <p>Loading data...</p>
        )}
        </div>
        
        
      </div>

      <div className="w-full flex max-md:flex-wrap justify-between p-5">
        <div className="flex flex-col w-full md:w-2/5 px-1 pb-5 pt-2 bg-transparent bg-opacity-30  shadow-violet-400 shadow-lg md:m-5 mb-10 rounded-xl">
          <h1 className="text-xl text-center my-5">Precautions : </h1>
          <div className="flex justify-center">
            {loading2 && <button onClick={fetchAQIPrecautions} className="w-1/2 h-11 bg-blue-500 rounded-lg bg-opacity-85  hover:scale-105">{loadert2?"Generating...":"Get precautions from AI"}</button>}
            {!loading2 && <table className="w-full border-collapse border border-gray-400">
        <tbody>
          {tableData2.map((row, index) => (
            <tr key={index} className={`border border-gray-400 ${colors[index % colors.length]}`}>
              <td className="p-4 border border-gray-400">
                <h2 className="text-lg font-bold underline">{row.mainPoint}</h2>
                {row.subPoints.length > 0 && (
                  <ul className="list-disc pl-5 mt-2">
                    {row.subPoints.map((sub, subIndex) => (
                      <li key={subIndex}>{boldText(sub)}</li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
          </div>
        </div>
        <div className="flex flex-col w-full md:w-2/5 px-1 pb-5 pt-2 bg-transparent bg-opacity-50 shadow-lg shadow-green-400 md:m-5 mb-10  rounded-xl">
          <h1 className="text-xl text-center  my-5">What to do for a better future : </h1>
          <div className="flex justify-center">
            {loading && <button onClick={fetchAQIResponse} className="w-1/2 h-11 bg-green-500 rounded-lg bg-opacity-85  hover:scale-105">{loadert?"Generating...":"Generate using AI"}</button>}
            {!loading && <table className="w-full border-collapse border border-gray-400">
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className={`border border-gray-400 ${colors[index % colors.length]}`}>
              <td className="p-4 border border-gray-400">
                <h2 className="text-lg font-bold underline">{row.mainPoint}</h2>
                {row.subPoints.length > 0 && (
                  <ul className="list-disc pl-5 mt-2">
                    {row.subPoints.map((sub, subIndex) => (
                      <li key={subIndex}>{boldText(sub)}</li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
          </div>
        </div>
      </div>
    </div>
  );
}
