"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  TrendingUp, 
  Wind, 
  Cloud, 
  Factory, 
  Leaf,
  AlertTriangle,
  Info,
  ChevronRight,
  Activity,
  Loader2
} from 'lucide-react';
const DateCalendarPage = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { loc } = useParams(); // Extract 'loc' from dynamic route

  useEffect(() => {
    const today = new Date();
    const last30Days = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      last30Days.push({ formattedDate, dayName, data: null });
    }

    setDates(last30Days);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const updatedDates = await Promise.all(
          dates.map(async (day) => {
            const response = await fetch(`/api/data?date=${day.formattedDate}&location=${loc}`);
            if (!response.ok) {
              return { ...day, data: null }; // Handle missing data
            }
            const result = await response.json();
            return { ...day, data: result.minMaxValues };
          })
        );
        setDates(updatedDates);
      } catch (err) {
        setError("Failed to load data");
      }
      setLoading(false);
    };

    if (dates.length > 0 && loc) {
      fetchData();
    }
  }, [loc, dates.length]);

  const handleDateClick = (date) => {
    router.push(`/location/${loc}/date/${date}`);
  };

  if (loading) return <div className="flex items-center justify-center text-center text-lg"><Loader2 className="animate-spin"/></div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg shadow-green-500/25">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Air Quality History
        </h1>
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-2">
        <Calendar className="w-5 h-5 text-gray-400" />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
          Last 30 Days AQI Data for <span className="text-blue-400 capitalize">{loc}</span>
        </h2>
      </div>
      
      <p className="text-gray-400 max-w-2xl mx-auto">
        Click on any day to view detailed air quality measurements and trends
      </p>
    </div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">Total Days</span>
        </div>
        <div className="text-2xl font-bold text-gray-100">{dates.length}</div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-gray-400">Data Available</span>
        </div>
        <div className="text-2xl font-bold text-gray-100">
          {dates.filter(d => d.data && d.data.min_co2).length}
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <span className="text-sm text-gray-400">No Data</span>
        </div>
        <div className="text-2xl font-bold text-gray-100">
          {dates.filter(d => !d.data || !d.data.min_co2).length}
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-gray-400">Monitoring</span>
        </div>
        <div className="text-2xl font-bold text-gray-100">24/7</div>
      </div>
    </div>

    {/* Data Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {dates.map(({ formattedDate, dayName, data }, index) => (
        <div
          key={formattedDate}
          onClick={() => handleDateClick(formattedDate)}
          className="group bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-gray-600/50"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-bold text-lg text-gray-100">{dayName}</p>
                  <p className="text-sm text-gray-400">{formattedDate}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {data && data.min_co2 && data.min_pm10 ? (
              <div className="space-y-3">
                {/* CO2 */}
                <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                  <div className="p-2 bg-green-900/30 rounded-lg">
                    <Leaf className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-300 font-medium">CO₂</p>
                    <p className="text-sm font-semibold text-gray-200">
                      {data.min_co2} - {data.max_co2} <span className="text-xs text-gray-400">ppm</span>
                    </p>
                  </div>
                </div>

                {/* PM1.0 */}
                <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <Wind className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-300 font-medium">PM1.0</p>
                    <p className="text-sm font-semibold text-gray-200">
                      {data.min_pm1_0} - {data.max_pm1_0} <span className="text-xs text-gray-400">µg/m³</span>
                    </p>
                  </div>
                </div>

                {/* PM2.5 */}
                <div className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
                  <div className="p-2 bg-yellow-900/30 rounded-lg">
                    <Cloud className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-yellow-300 font-medium">PM2.5</p>
                    <p className="text-sm font-semibold text-gray-200">
                      {data.min_pm2_5} - {data.max_pm2_5} <span className="text-xs text-gray-400">µg/m³</span>
                    </p>
                  </div>
                </div>

                {/* PM10 */}
                <div className="flex items-center gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30">
                  <div className="p-2 bg-orange-900/30 rounded-lg">
                    <Factory className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-orange-300 font-medium">PM10</p>
                    <p className="text-sm font-semibold text-gray-200">
                      {data.min_pm10} - {data.max_pm10} <span className="text-xs text-gray-400">µg/m³</span>
                    </p>
                  </div>
                </div>

                {/* Data Quality Indicator */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-700/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Data Available</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-gray-700/50 rounded-full mb-3">
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">No data available</p>
                <p className="text-xs text-gray-500">Measurements not recorded</p>
                
                {/* No Data Indicator */}
                <div className="flex items-center justify-center gap-2 pt-3 mt-3 border-t border-gray-700/50">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">No Data</span>
                </div>
              </div>
            )}
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>

    {/* Legend */}
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Info className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-100">Measurement Legend</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-700/30">
          <Leaf className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-300">CO₂</p>
            <p className="text-xs text-gray-400">Carbon Dioxide (ppm)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
          <Wind className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm font-medium text-blue-300">PM1.0</p>
            <p className="text-xs text-gray-400">Fine particles (µg/m³)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
          <Cloud className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-300">PM2.5</p>
            <p className="text-xs text-gray-400">Fine particles (µg/m³)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-700/30">
          <Factory className="w-5 h-5 text-orange-400" />
          <div>
            <p className="text-sm font-medium text-orange-300">PM10</p>
            <p className="text-xs text-gray-400">Coarse particles (µg/m³)</p>
          </div>
        </div>
      </div>
    </div>

    {/* Floating particles background effect */}
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-5 animate-float"
          style={{
            background: i % 4 === 0 ? '#10B981' : i % 4 === 1 ? '#3B82F6' : i % 4 === 2 ? '#F59E0B' : '#F97316',
            width: `${Math.random() * 30 + 15}px`,
            height: `${Math.random() * 30 + 15}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 25 + 15}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  </div>
</div>
  );
};

export default DateCalendarPage;
