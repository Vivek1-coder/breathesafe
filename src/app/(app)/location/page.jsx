"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

import { 
  MapPin, 
  Plus, 
  Loader2, 
  Navigation, 
  Globe, 
  CheckCircle,
  AlertCircle,
  Search,
  ExternalLink
} from 'lucide-react';

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
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Manage Locations
          </h1>
          <p className="text-gray-400 mt-1">Add and monitor air quality for your favorite locations</p>
        </div>
      </div>
    </div>

    {/* Add Location Section */}
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Plus className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-100">Add New Location</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Enter location name (e.g., Mumbai, Delhi, New York)"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-gray-100 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-lg placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={handleAddLocation}
          disabled={loading || !locationName.trim()}
          className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[160px]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Adding...</span>
            </div>
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Location
            </span>
          )}
        </button>
      </div>
    </div>

    {/* Success/Error Message */}
    {message && (
      <div className="mb-6">
        <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 font-medium">{message}</p>
          </div>
        </div>
      </div>
    )}

    {/* Locations Grid */}
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-100">Your Locations</h2>
        {locations.length > 0 && (
          <span className="bg-blue-900/50 text-blue-300 text-sm font-medium px-3 py-1 rounded-full border border-blue-700/50">
            {locations.length} location{locations.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {fetching ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-gray-300 text-lg">Loading your locations...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.length > 0 ? (
            locations.map((loc, index) => (
              <Link key={loc._id} href={`/location/${loc.name}`}>
                <div 
                  className="group bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer hover:border-gray-600/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white truncate">
                          {loc.name || "Unnamed Location"}
                        </h3>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-900/30 rounded-lg border border-blue-700/30">
                          <Navigation className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Latitude</p>
                          <p className="font-semibold text-gray-200">
                            {loc.coordinates?.coordinates[1]?.toFixed(4) || 'N/A'}°
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-900/30 rounded-lg border border-indigo-700/30">
                          <Globe className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Longitude</p>
                          <p className="font-semibold text-gray-200">
                            {loc.coordinates?.coordinates[0]?.toFixed(4) || 'N/A'}°
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Click to view details</span>
                        <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
                          <span className="font-medium">View AQI</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-700/50 rounded-full border border-gray-600/50">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-2">No locations yet</h3>
                    <p className="text-gray-400 mb-4">
                      Start by adding your first location to monitor air quality
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Add a location above to get started</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Quick Stats */}
    {locations.length > 0 && (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-900/30 rounded-lg border border-green-700/30">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Quick Stats</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-900/20 rounded-xl border border-blue-700/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">{locations.length}</div>
            <div className="text-sm text-blue-300">Total Locations</div>
          </div>
          
          <div className="text-center p-4 bg-green-900/20 rounded-xl border border-green-700/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">
              {locations.filter(loc => loc.coordinates).length}
            </div>
            <div className="text-sm text-green-300">With Coordinates</div>
          </div>
          
          <div className="text-center p-4 bg-purple-900/20 rounded-xl border border-purple-700/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-purple-300">Monitoring</div>
          </div>
        </div>
      </div>
    )}

    {/* Floating particles background effect */}
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 animate-float"
          style={{
            background: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#8B5CF6' : '#06B6D4',
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  </div>
</div>
  );
};

export default LocationPage;
