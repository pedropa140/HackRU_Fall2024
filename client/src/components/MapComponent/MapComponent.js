import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const MapComponent = () => {
  const [accessToken, setAccessToken] = useState("");
  const [location, setLocation] = useState(null); // Initialize as null to check if it's loaded
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch Mapbox access token from Flask backend
  useEffect(() => {
    const fetchMapConfig = async () => {
      try {
        const response = await fetch('/api/get_map_config');
        if (!response.ok) {
          console.error('Failed to fetch Mapbox access token.');
          return;
        }
        const data = await response.json();
        setAccessToken(data.accessToken);
      } catch (error) {
        console.error('Error fetching Mapbox access token:', error);
      }
    };
    fetchMapConfig();
  }, []);

  // Get user location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation access denied:", error.message);
          // Fallback location if denied or unavailable (New York City)
          setLocation({ latitude: 40.7128, longitude: -74.0060 });
        }
      );
    }
  }, []);

  if (!accessToken) return <div>Loading Map...</div>;
  if (!location) return <div>Fetching Location...</div>;

  return (
    <Map
      initialViewState={{
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 14,
      }}
      style={mapContainerStyle}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={accessToken}
      onLoad={() => setMapLoaded(true)}
    >
      {mapLoaded && (
        <Marker latitude={location.latitude} longitude={location.longitude}>
          <div
            style={{
              backgroundColor: 'red',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid white',
              cursor: 'pointer',
            }}
            title="Your location"
          ></div>
        </Marker>
      )}
    </Map>
  );
};

export default MapComponent;
