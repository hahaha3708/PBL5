import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TimelineComponent.css';

function TimelineComponent() {
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  useEffect(() => {
    fetchHistoricalPeriods();
  }, []);

  const fetchHistoricalPeriods = async () => {
    try {
      const response = await axios.get('/api/history');
      setPeriods(response.data);
    } catch (error) {
      console.error('Error fetching historical periods:', error);
    }
  };

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="timeline-container">
      <h2>Vietnamese Historical Timeline</h2>
      <div className="timeline">
        {periods.map((period, index) => (
          <div
            key={period.id}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            onClick={() => handlePeriodClick(period)}
          >
            <div className="timeline-content">
              <h3>{period.dynasty}</h3>
              <p>{period.start_year} - {period.end_year}</p>
              <p>{period.description}</p>
              {period.image_url && <img src={period.image_url} alt={period.dynasty} />}
            </div>
          </div>
        ))}
      </div>

      {selectedPeriod && (
        <div className="period-details">
          <h3>{selectedPeriod.dynasty}</h3>
          <p><strong>Years:</strong> {selectedPeriod.start_year} - {selectedPeriod.end_year}</p>
          <p>{selectedPeriod.description}</p>
          {selectedPeriod.key_events && (
            <div>
              <h4>Key Events:</h4>
              <ul>
                {selectedPeriod.key_events.split(',').map((event, index) => (
                  <li key={index}>{event.trim()}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedPeriod.audio_url && (
            <audio controls>
              <source src={selectedPeriod.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </div>
  );
}

export default TimelineComponent;
