import Link from "next/link";
import { LocateFixed, CloudSun, ChartNetwork } from "lucide-react";
// import Navbar from "../components/Navbar";
export default function LandingPage() {
  return (  
   <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden text-white">
  {/* Enhanced floating particles background */}
  <div className="absolute inset-0 z-0">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className={`absolute rounded-full animate-float ${
          i % 3 === 0 
            ? 'bg-emerald-400/20' 
            : i % 3 === 1 
            ? 'bg-blue-400/15' 
            : 'bg-teal-400/10'
        }`}
        style={{
          width: `${Math.random() * 60 + 15}px`,
          height: `${Math.random() * 60 + 15}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 15 + 10}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>

  {/* Gradient overlay for depth */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-5" />

  {/* Main content */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-4xl mx-auto">
    {/* Enhanced header with gradient text */}
    <div className="mb-8 space-y-4">
      <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-400 via-blue-400 to-teal-400 bg-clip-text text-transparent leading-tight">
        Welcome to Breathe Sa🌿e
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto rounded-full" />
    </div>

    {/* Enhanced description */}
    <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed max-w-2xl">
      Your trusted companion for real-time air quality monitoring. 
      <span className="block mt-2 text-emerald-400 font-medium">
        Breathe better, live healthier.
      </span>
    </p>




    <div className="flex flex-col sm:flex-row gap-6 items-center">
      <Link
        href="/location"
        className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 min-w-[200px]"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <LocateFixed className="w-5 h-5" />
          Check AQI (Using device)
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <Link
        href="/without-device"
        className="group relative bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-400/30 hover:border-emerald-400/60 text-emerald-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 min-w-[200px]"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <CloudSun className="w-5 h-5" />
          Check AQI (Using API)
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
    </div>

    {/* Additional features showcase */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300">
        <div className="text-2xl mb-3 flex justify-center items-center w-full font-bold">
          <LocateFixed className="w-8 h-8 text-emerald-400"/>
        </div>
        <h3 className="font-semibold text-emerald-400 mb-2">Real-time Data</h3>
        <p className="text-sm text-gray-400">Get instant air quality updates for your location</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300">
        <div className="text-2xl mb-3 flex justify-center items-center w-full font-bold"><ChartNetwork className="w-8 h-8 text-blue-300"/></div>
        <h3 className="font-semibold text-blue-400 mb-2">Detailed Analytics</h3>
        <p className="text-sm text-gray-400">Comprehensive air quality insights and trends</p>
      </div>
      
     
    </div>
  </div>
</div>
  );
}
