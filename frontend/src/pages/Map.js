import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent';
import './Map.css';

function Map() {
  return (
    <div className="map-page">
      <Header />

      <main>
        <section className="map-hero">
          <h1>Explore Vietnam's Heritage Sites</h1>
          <p>Discover historical landmarks, temples, and cultural sites across Vietnam with interactive maps and audio guides.</p>
        </section>

        <section className="map-content">
          <div className="map-filters">
            <h3>Filter Sites</h3>
            <div className="filter-options">
              <select id="region-filter">
                <option value="">All Regions</option>
                <option value="north">Northern Vietnam</option>
                <option value="central">Central Vietnam</option>
                <option value="south">Southern Vietnam</option>
              </select>
              <select id="type-filter">
                <option value="">All Types</option>
                <option value="temple">Temples</option>
                <option value="palace">Palaces</option>
                <option value="museum">Museums</option>
                <option value="historical-site">Historical Sites</option>
                <option value="natural-site">Natural Sites</option>
              </select>
              <select id="language-filter">
                <option value="vi">Vietnamese</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>

          <MapComponent />
        </section>

        <section className="featured-sites">
          <h2>Featured Heritage Sites</h2>
          <div className="sites-grid">
            <div className="site-card">
              <img src="/images/ho-chi-minh-mausoleum.jpg" alt="Ho Chi Minh Mausoleum" />
              <h3>Ho Chi Minh Mausoleum</h3>
              <p>Hanoi, Vietnam</p>
              <button className="view-site-btn">View on Map</button>
            </div>
            <div className="site-card">
              <img src="/images/halong-bay.jpg" alt="Ha Long Bay" />
              <h3>Ha Long Bay</h3>
              <p>Quang Ninh, Vietnam</p>
              <button className="view-site-btn">View on Map</button>
            </div>
            <div className="site-card">
              <img src="/images/hue-imperial-city.jpg" alt="Hue Imperial City" />
              <h3>Hue Imperial City</h3>
              <p>Hue, Vietnam</p>
              <button className="view-site-btn">View on Map</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Map;
