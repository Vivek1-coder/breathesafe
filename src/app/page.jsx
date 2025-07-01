import Link from "next/link";
// import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
   
      
    <div className="relative w-full h-screen bg-black overflow-hidden text-white">

      {/* Floating bubbles background */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10 animate-bubble"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              bottom: `-${Math.random() * 100}px`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Breathe Sa🌿e
        </h1>
        <p className="text-lg md:text-2xl mb-10">
          Your trusted source to check air quality in your area.
        </p>
        <Link
          href="/check-aqi"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition"
        >
          Check AQI
        </Link>
      </div>
    </div>
   
  );
}
