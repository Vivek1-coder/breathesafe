'use client';
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import GasChart from "../../../../../../components/GasChart";
import CircularAQI from "../../../../../../components/CircularChart.jsx";
import PollutionChart from "../../../../../../components/GasChart";


const DateDetailPage = () => {
  const { date, loc } = useParams();
  const [aqiData, setAqiData] = useState([]);
  const [loadert, setloadert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadert2, setloadert2] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [input, setInput] = useState("");
  const [precautions, setPrecautions] = useState("");

  const fetchAQIResponse = async () => {
    setloadert(true);
    try {
      // Extract ppm values from aqiData
      const co2Array = aqiData.map(data => data.co2);
      const pm1_0Array = aqiData.map(data => data.pm1_0);
      const pm2_5Array = aqiData.map(data => data.pm2_5);
      const pm10Array = aqiData.map(data => data.pm10);
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ co2: co2Array,pm1_0:pm1_0Array,pm2_5:pm2_5Array,pm10:pm10Array }) // Send ppm array
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
      // Extract ppm values from aqiData
      const co2Array = aqiData.map(data => data.co2);
      const pm1_0Array = aqiData.map(data => data.pm1_0);
      const pm2_5Array = aqiData.map(data => data.pm2_5);
      const pm10Array = aqiData.map(data => data.pm10);

      const res = await fetch("/api/precautions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ co2: co2Array,pm1_0:pm1_0Array,pm2_5:pm2_5Array,pm10:pm10Array }) // Send ppm array
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

    if (!date || !loc) return;
    // Simulating API call (Replace with actual fetch request)
    
    const fetchData = async () => {
      const response = await fetch(`/api/getData?loc=${loc}&date=${date}`);
      const data = await response.json();
    
      console.log("Fetched data:", data);
      console.log("Fetched gasdata:", data.gasdata);
      
      if (Array.isArray(data.gasdata) && data.gasdata.length > 0) {
        setAqiData(data.gasdata);
      } else {
        console.warn("No valid gasdata received.");
      }
    };
     fetchData();
     
    
  }, [date, loc]);

  

  return (
    <div className="relative w-full h-full">
      <h1 className="w- text-center m-5 font-bold md:font-extrabold text-2xl md:text-5xl">Breathe Sa🌿e</h1>
      
      <h1 className=" text-lg md:text-3xl text-center p-5">AQI of {loc} on {date}</h1>
        <div className="flex flex-wrap w-full px-6 mt-4 md:justify-between gap-3">
        <div className="flex justify-center w-full md:w-1/3 bg-slate-500 bg-opacity-20 rounded-lg items-center ">
        {console.log("AqiData",aqiData[aqiData.length - 1]?.co2)}
        {aqiData.length > 0  ? (
          <CircularAQI data={aqiData} />
        ) : (
          <p>Loading data...</p>
        )}
     
        </div>
        
        
        <div className="w-full md:w-3/5 md:h-1/2 bg-slate-500 bg-opacity-20 md:p-4 rounded-lg">
        {console.log("aqiData",aqiData)}
        {aqiData.length > 0  ? (
          <PollutionChart gasData={aqiData} />
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
};

export default DateDetailPage;





  

