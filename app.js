
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ApiDataDisplay = () => {
  const [apiData, setApiData] = useState(null);
  const [zone, setZone] = useState('FR'); // Initialisation à 'FR' par défaut
  const apiKey = 'YaYoyfxiKUAyLxgxTrlv9QkfqWSxYqNU'; //  clé API

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.electricitymap.org/v3/carbon-intensity/history?zone=${zone}`, {
        method: 'GET',
        headers: {
          'auth-token': apiKey,
        },
      });

      const data = await response.json();
      setApiData(data);
      console.log('Data:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [zone, apiKey]);

  useEffect(() => {
    // Crée un graphique avec les données lorsque apiData est mis à jour
    if (apiData && apiData.history) {
      const ctx = document.getElementById('carbonIntensityChart').getContext('2d');

      // Détruire le graphique existant s'il existe
      if (window.myLineChart) {
        window.myLineChart.destroy();
      }

      window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: apiData.history.map(entry => entry.datetime),
          datasets: [{
            label: 'Carbon Intensity',
            data: apiData.history.map(entry => entry.carbonIntensity),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          }],
        },
      });
    }
  }, [apiData]);

  const handleZoneChange = (event) => {
    setZone(event.target.value);
  };

  return (
    <div>
      <h1>API Data Display {zone}</h1>
      <label htmlFor="zoneInput">Zone: </label>
      <input
        type="text"
        id="zoneInput"
        value={zone}
        onChange={handleZoneChange}
      />
      <canvas id="carbonIntensityChart" width="400" height="200"></canvas>
    </div>
  );
};

export default ApiDataDisplay;
