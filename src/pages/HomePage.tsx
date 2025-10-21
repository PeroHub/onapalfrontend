import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesOverview from '../components/ServicesOverview';
import LocationMap from '../components/LocationMap';
import Stats from '../components/Stats';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* HeroSection usually appears at the top and might not need an AOS animation
          as it's immediately visible. */}
      <HeroSection />

      {/* Apply AOS attributes to the Stats component's wrapper div */}
      <div data-aos="fade-up" data-aos-duration="1000" data-aos-once="true">
        <Stats />
      </div>

      {/* Apply AOS attributes to the ServicesOverview component's wrapper div */}
      <div data-aos="fade-right" data-aos-duration="1000" data-delay="200" data-aos-once="true">
        <ServicesOverview />
      </div>

      {/* Apply AOS attributes to the LocationMap component's wrapper div */}
      <div data-aos="zoom-in" data-aos-duration="1000" data-delay="400" data-aos-once="true">
        <LocationMap />
      </div>
    </div>
  );
};

export default HomePage;