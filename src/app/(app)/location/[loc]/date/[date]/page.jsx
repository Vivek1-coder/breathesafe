'use client';
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import GasChart from "../../../../../../components/GasChart";
import CircularAQI from "../../../../../../components/CircularChart.jsx";
import PollutionChart from "../../../../../../components/GasChart";
import { 
  Calendar, 
  MapPin, 
  Activity, 
  Shield, 
  Lightbulb, 
  Bot, 
  Loader2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Air Quality Dashboard
        </h1>
      </div>
      
      <div className="flex items-center justify-center gap-4 text-gray-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="capitalize font-medium">{loc}</span>
        </div>
        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-green-400" />
          <span className="font-medium">{date}</span>
        </div>
      </div>
    </div>

    {/* Main Data Visualization Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Circular AQI Display */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-100">AQI Overview</h2>
          </div>
          
          <div className="flex justify-center items-center h-64">
            {aqiData.length > 0 ? (
              <CircularAQI data={aqiData} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-400">Loading AQI data...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pollution Chart */}
      <div className="lg:col-span-2">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-100">Pollution Trends</h2>
          </div>
          
          <div className="h-80">
            {aqiData.length > 0 ? (
              <PollutionChart gasData={aqiData} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* AI Recommendations Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Precautions Card */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b border-red-700/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-900/30 rounded-xl border border-red-700/30">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Safety Precautions</h2>
                <p className="text-sm text-gray-400">AI-powered health recommendations</p>
              </div>
            </div>
            {loading2 && (
              <div className="flex items-center gap-2 text-red-400">
                <Bot className="w-4 h-4 animate-pulse" />
                <span className="text-sm">AI Thinking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {loading2 ? (
            <div className="text-center py-8">
              <button 
                onClick={fetchAQIPrecautions} 
                disabled={loadert2}
                className="group relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loadert2 ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Precautions...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    <span>Get AI Precautions</span>
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tableData2.map((row, index) => (
                <div 
                  key={index} 
                  className="bg-red-900/10 border border-red-700/30 rounded-xl p-4 hover:bg-red-900/20 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-red-900/30 rounded-lg mt-1">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-300 mb-2">{row.mainPoint}</h3>
                      {row.subPoints.length > 0 && (
                        <ul className="space-y-1">
                          {row.subPoints.map((sub, subIndex) => (
                            <li key={subIndex} className="flex items-start gap-2 text-gray-300">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">{boldText(sub)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Future Actions Card */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-700/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-900/30 rounded-xl border border-green-700/30">
                <Lightbulb className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Future Actions</h2>
                <p className="text-sm text-gray-400">AI-powered improvement suggestions</p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-green-400">
                <Bot className="w-4 h-4 animate-pulse" />
                <span className="text-sm">AI Thinking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <button 
                onClick={fetchAQIResponse} 
                disabled={loadert}
                className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loadert ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Solutions...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Solutions</span>
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tableData.map((row, index) => (
                <div 
                  key={index} 
                  className="bg-green-900/10 border border-green-700/30 rounded-xl p-4 hover:bg-green-900/20 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-900/30 rounded-lg mt-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-300 mb-2">{row.mainPoint}</h3>
                      {row.subPoints.length > 0 && (
                        <ul className="space-y-1">
                          {row.subPoints.map((sub, subIndex) => (
                            <li key={subIndex} className="flex items-start gap-2 text-gray-300">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">{boldText(sub)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <RefreshCw className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-100">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30 hover:bg-blue-900/30 transition-colors">
          <RefreshCw className="w-5 h-5 text-blue-400" />
          <span className="text-gray-300">Refresh Data</span>
        </button>
        
        <button className="flex items-center gap-3 p-4 bg-purple-900/20 rounded-xl border border-purple-700/30 hover:bg-purple-900/30 transition-colors">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-gray-300">View Trends</span>
        </button>
        
        <button className="flex items-center gap-3 p-4 bg-green-900/20 rounded-xl border border-green-700/30 hover:bg-green-900/30 transition-colors">
          <Bot className="w-5 h-5 text-green-400" />
          <span className="text-gray-300">AI Analysis</span>
        </button>
      </div>
    </div>

    {/* Floating particles background effect */}
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-5 animate-float"
          style={{
            background: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#10B981' : '#F59E0B',
            width: `${Math.random() * 25 + 10}px`,
            height: `${Math.random() * 25 + 10}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 15}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  </div>
</div>
  );
};

export default DateDetailPage;





  

