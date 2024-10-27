import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

// Sample people data with coordinates
const people = [
  { name: "Alice Johnson", latitude: 40.501548, longitude: -74.447896 },
  { name: "Bob Smith", latitude: 40.502248, longitude: -74.448896 },
  { name: "Charlie Brown", latitude: 40.500248, longitude: -74.449896 },
];

const MapComponent = () => {
  const [accessToken, setAccessToken] = useState("");
  const [location, setLocation] = useState(null); // User's current location
  const [searchResult, setSearchResult] = useState(null); // Searched location or person

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
          setLocation({ latitude: 40.7128, longitude: -74.0060 });
        }
      );
    }
  }, []);

  // Search handler
  const handleSearch = async (query) => {
    if (!query) return;

    // Check if the query matches any person by name
    const person = people.find(p => p.name.toLowerCase() === query.toLowerCase());
    if (person) {
      setSearchResult(person);
      return;
    }

    // If no person found, fallback to Mapbox Geocoding API for location search
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const { center, place_name } = data.features[0];
        setSearchResult({
          latitude: center[1],
          longitude: center[0],
          place_name,
        });
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  if (!accessToken) return <div>Loading Map...</div>;
  if (!location) return <div>Fetching Location...</div>;

  return (
    <div style={{ position: 'relative' }}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a person or location..."
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px',
          width: '300px',
          zIndex: 1,
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <Map
        initialViewState={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 12,
        }}
        style={mapContainerStyle}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={accessToken}
      >
        {/* User Location Marker */}
        <Marker latitude={location.latitude} longitude={location.longitude}>
          <div
            style={{
              backgroundColor: 'red',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid white',
            }}
            title="Your location"
          ></div>
        </Marker>

        {/* People Markers */}
        {people.map((person, index) => (
          <Marker key={index} latitude={person.latitude} longitude={person.longitude}>
            <div
              style={{
                backgroundColor: 'blue',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid white',
              }}
              title={person.name}
            ></div>
          </Marker>
        ))}

        {/* Search Result Marker */}
        {searchResult && (
          <Marker latitude={searchResult.latitude} longitude={searchResult.longitude}>
            <div
              style={{
                backgroundColor: 'green',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid white',
              }}
              title={searchResult.place_name || searchResult.name}
            ></div>
          </Marker>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
