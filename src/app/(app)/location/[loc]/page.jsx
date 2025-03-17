"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const DateCalendarPage = () => {
  const [dates, setDates] = useState([]);
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

      last30Days.push({ formattedDate, dayName });
    }

    setDates(last30Days);
  }, []);

  const handleDateClick = (date) => {
    router.push(`/location/${loc}/date/${date}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Last 30 Days for {loc}</h1>
      <div className="grid grid-cols-7 gap-4">
        {dates.map(({ formattedDate, dayName }) => (
          <div
            key={formattedDate}
            onClick={() => handleDateClick(formattedDate)}
            className="cursor-pointer p-4 border rounded shadow hover:bg-gray-200 text-center"
          >
            <p className="font-semibold">{dayName}</p>
            <p>{formattedDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateCalendarPage;
