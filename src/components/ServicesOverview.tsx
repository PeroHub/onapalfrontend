import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Slider from "react-slick";

const ServicesOverview: React.FC = () => {
  const services = [
  {
    imageUrl: "/civilengineering.jpg", // New placeholder image
    title: "Civil Engineering & Building",
    description:
      "Full-scope civil works, structural engineering, and general building construction projects, from foundation to finish.",
    features: ["Infrastructure Design", "Residential & Commercial Builds", "Project Management"],
  },
  {
    imageUrl: "/electricalservices.jpg", // New placeholder image
    title: "Electrical Services",
    description:
      "Industrial and residential electrical installation, wiring, power distribution, and maintenance services.",
    features: ["Power Systems", "Installation & Wiring", "Safety Compliance"],
  },
  {
    imageUrl: "/mechanicalservices.jpg", // New placeholder image
    title: "Mechanical Services",
    description:
      "Installation and maintenance of mechanical systems including HVAC, plumbing, and industrial machinery.",
    features: ["HVAC & Ventilation", "Piping & Plumbing", "Equipment Installation"],
  },
  {
    imageUrl: "/solar.jpg", // New placeholder image
    title: "Water & Solar Solutions",
    description:
      "Specialized services in Borehole Drilling, Water Treatment Plant installation, and sustainable Solar Street Light solutions.",
    features: ["Borehole Drilling", "Water Treatment", "Solar Street Lights", "Procurement"],
  },
];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-sm md:text-md text-gray-600 max-w-3xl mx-auto">
            From highways to urban roads and bridges, we deliver comprehensive
            road construction solutions tailored to your infrastructure needs.
          </p>
        </div>

        {/* This div wraps the slider */}
        <div className="mb-12 services-slider-container">
          <Slider {...settings}>
            {services.map((service, index) => (
              // Each slide item must be a direct child of Slider
              <div key={index} className="px-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <div className="flex justify-center mb-4 overflow-hidden rounded-lg">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-40 object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm md:text-md font-semibold text-gray-900 mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-4 text-center flex-grow">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mt-auto">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-500 flex items-center"
                      >
                        <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="text-center">
          <Link
            to="/services"
            className="inline-flex text-sm items-center px-8 py-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-all duration-300 hover:scale-105"
          >
            View All Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
