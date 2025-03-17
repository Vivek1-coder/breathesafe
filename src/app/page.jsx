"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const LocationPage = () => {
  const [locationName, setLocationName] = useState("");
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Fetch all locations from API
  const fetchLocations = async () => {
    setFetching(true);
    try {
      const response = await axios.get("/api/location/get-all-locations");
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setMessage("Error fetching locations.");
    } finally {
      setFetching(false);
    }
  };

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Handle adding a location
  const handleAddLocation = () => {
    if (!locationName.trim()) {
      setMessage("Please enter a valid location name.");
      return;
    }

    setLoading(true);
    setMessage("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const requestData = { name: locationName, latitude, longitude };
          
          console.log("Sending data:", requestData);

          try {
            const response = await axios.post("/api/location/add-location", requestData);
            console.log("Response from server:", response.data);

            setMessage(response.data.message || "Location added successfully!");
            setLocationName(""); // Reset input field
            fetchLocations(); // Refresh locations after adding
          } catch (error) {
            console.error("Axios error:", error);
            setMessage(error.response?.data?.message || "Error adding location.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setMessage("Failed to get location. Please allow location access.");
          setLoading(false);
        }
      );
    } else {
      setMessage("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="w-full text-center m-5 font-bold md:font-extrabold text-2xl md:text-5xl">Welcome to Breathe Sa🌿e</h1>
      <h2 className="text-xl font-bold mb-4">Manage Locations</h2>
      {/* Add Location Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter location name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="border w-96 p-2 rounded"
        />
        <button
          onClick={handleAddLocation}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Location"}
        </button>
      </div>

      {message && <p className="text-red-500">{message}</p>}

      {/* Display Locations */}
      {fetching ? (
        <p>Loading locations...</p>
      ) : (
        <div className="w-full flex justify-center gap-4 flex-wrap">
          {locations.length > 0 ? (
            locations.map((loc) => (
                <Link key={loc._id} href={`/location/${loc.name}`}>
                    <div className="p-4 border rounded shadow hover:bg-gray-600">
                        <h3 className="text-lg font-semibold">{loc.name || "Unnamed Location"}</h3>
                        <p>Latitude: {loc.coordinates?.coordinates[1]}</p>
                        <p>Longitude: {loc.coordinates?.coordinates[0]}</p>
                    </div>
                </Link>
             
            ))
          ) : (
            <p>No locations found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPage;
