"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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

  if (loading) return <p className="text-center text-lg">Loading data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full object-contain overflow-x-clip">
      <h1 className="w-full text-center m-5 font-bold md:font-extrabold text-2xl md:text-5xl">Breathe Sa🌿e</h1>
      <h2 className="text-2xl font-bold mb-4 text-center">Last 30 Days for {loc}</h2>
      <div className="flex justify-center flex-wrap gap-5">
        {dates.map(({ formattedDate, dayName, data }) => (
          <div
            key={formattedDate}
            onClick={() => handleDateClick(formattedDate)}
            className="w-60  cursor-pointer p-4 border rounded-lg shadow-lg hover:bg-gray-700 text-center bg-gray-900 text-white"
          >
            <p className="font-bold text-lg">{dayName}</p>
            <p className="text-sm text-gray-300">{formattedDate}</p>
            
            { data && data.min_co2 && data.min_pm10 ? (
              <div className="mt-2">
                <p>🌿 CO₂: {data.min_co2} - {data.max_co2} ppm</p>
                <p>💨 PM1.0: {data.min_pm1_0} - {data.max_pm1_0} µg/m³</p>
                <p>🌫 PM2.5: {data.min_pm2_5} - {data.max_pm2_5} µg/m³</p>
                <p>🏭 PM10: {data.min_pm10} - {data.max_pm10} µg/m³</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-2">No data available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateCalendarPage;
