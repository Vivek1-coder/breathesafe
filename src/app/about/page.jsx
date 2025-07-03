// import Navbar from "../../components/Navbar";
import "../globals.css"; // For bubble animation

export default function AboutPage() {
  return (
    // <div className="w-full">
    //     {/* Navbar */}
    //     <Navbar />
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">

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

      {/* About Content */}
      <div className="relative z-10 flex justify-center items-center px-6 pt-5 pb-20">
        <div className="max-w-4xl w-full bg-[#121212] bg-opacity-90 rounded-xl p-8 shadow-xl border border-gray-700">
          <h1 className="text-4xl font-bold mb-6 text-center">About Breathe Safe</h1>
          <p className="text-lg mb-4">
            <strong>Breathe Safe</strong> is your reliable companion for monitoring Air Quality Index (AQI) in your surroundings. As pollution continues to rise in urban and even rural areas, being aware of the air quality is critical for your health and well-being.
          </p>
          <p className="text-lg mb-4">
            Our platform provides accurate, real-time AQI data, presented in a user-friendly interface that helps individuals make smarter decisions — whether it's a safe time for a morning jog or if you should keep your windows shut.
          </p>
          <p className="text-lg mb-4">
            We are also developing a custom hardware device powered by an <strong>ESP WiFi module</strong> that directly measures local air quality using onboard sensors. This IoT solution connects to your home or office WiFi and sends real-time AQI readings to your Breathe Safe dashboard.
          </p>
          <p className="text-lg mb-4">
            Our goal is to combine software with low-cost, accessible hardware so that anyone, anywhere, can take control of their environmental awareness.
          </p>
          <p className="text-lg italic text-gray-400 text-center">
            (Visuals and device images coming soon...)
          </p>
        </div>
      </div>
    </div>
    // </div>
  );
}
