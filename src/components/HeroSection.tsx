import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  // Array of construction site images
  const images = [
    "/itekbridge9.jpg",
    "/itekbridge10.jpg",
    "https://images.pexels.com/photos/2240767/pexels-photo-2240767.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "/itekbridge8.jpg",
    "/itekbridge11.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set up an interval to change the image every 5 seconds (5000 milliseconds)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [images.length]); // Re-run effect if images array length changes (though it's static here)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images with transition */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <img
            key={index} // Important for React to efficiently update list items
            src={image}
            alt={`Road construction site ${index + 1}`}
            // Apply transition and opacity based on currentImageIndex
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {" "}
          {/* Centered content */}
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Building Roads,
            <span className="text-teal-500"> Creating Futures</span>
          </h1>
          <p className="text-sm md:text-xl text-gray-200 mb-8 leading-relaxed">
            ONA-PAL Global Resources Limited provides expert Civil Engineering, Building, Electrical, and Mechanical services. We specialize in Borehole Drilling, Water Treatment Plant, and Solar Street Light projects across Nigeria.
          </p>
          <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-all duration-300 hover:scale-105"
            >
              Get Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20">
        {" "}
        {/* Increased z-index */}
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
