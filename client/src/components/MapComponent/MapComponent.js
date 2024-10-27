import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const initialPeople = [
  { name: "Alice", latitude: 40.501548, longitude: -74.447896, status: "Family", phone: "123-456-7890" },
  { name: "Bob", latitude: 40.502248, longitude: -74.448896, status: "Friend", phone: "234-567-8901" },
  { name: "Charlie", latitude: 40.500248, longitude: -74.449896, status: "Primary Caregiver", phone: "345-678-9012" },
];

const MapComponent = () => {
  const [accessToken, setAccessToken] = useState("");
  const [location, setLocation] = useState(null);
  const [people, setPeople] = useState(initialPeople);
  const [viewState, setViewState] = useState({
    latitude: 40.501248,
    longitude: -74.448896,
    zoom: 12,
  });
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: '', status: '', phone: '', latitude: '', longitude: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

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

  const handleMarkerClick = (person) => {
    setSelectedPerson(person);
    setViewState({ ...viewState, latitude: person.latitude, longitude: person.longitude, zoom: 14 });
  };

  const closeModal = () => {
    setSelectedPerson(null);
  };

  const toggleFormModal = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setPeople((prevPeople) => [
      ...prevPeople,
      {
        name: newPerson.name,
        status: newPerson.status,
        phone: newPerson.phone,
        latitude: parseFloat(newPerson.latitude),
        longitude: parseFloat(newPerson.longitude),
      },
    ]);
    setNewPerson({ name: '', status: '', phone: '', latitude: '', longitude: '' });
    setIsFormOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const result = people.find((person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (result) {
      setSearchResult(result);
      setViewState({
        latitude: result.latitude,
        longitude: result.longitude,
        zoom: 14,
      });
      setSelectedPerson(result); // Show popup for the searched person
    } else {
      setSearchResult(null);
      setSelectedPerson(null);
    }
  };

  if (!accessToken) return <div>Loading Map...</div>;
  if (!location) return <div>Fetching Location...</div>;

  return (
    <div style={{ position: 'relative' }}>
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for family or friends..."
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
      <button
        onClick={handleSearch}
        style={{
          position: 'absolute',
          top: '10px',
          left: 'calc(50% + 160px)',
          padding: '10px',
          zIndex: 1,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={mapContainerStyle}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={accessToken}
      >
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

        {people.map((person, index) => (
          <Marker
            key={index}
            latitude={person.latitude}
            longitude={person.longitude}
            onMouseEnter={() => setHoveredPerson(person)}
            onMouseLeave={() => setHoveredPerson(null)}
            onClick={() => handleMarkerClick(person)}
          >
            <div
              style={{
                backgroundColor: 'blue',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid white',
                cursor: 'pointer',
              }}
              title={person.name}
            ></div>
          </Marker>
        ))}

        {hoveredPerson && (
          <Popup
            latitude={hoveredPerson.latitude}
            longitude={hoveredPerson.longitude}
            closeButton={false}
            closeOnClick={false}
            anchor="top"
            offset={[0, -10]}
          >
            <div>{hoveredPerson.name}</div>
          </Popup>
        )}

        {selectedPerson && (
          <Popup
            latitude={selectedPerson.latitude}
            longitude={selectedPerson.longitude}
            onClose={closeModal}
            anchor="top"
            offset={[0, -10]}
          >
            <div>
              <h3>{selectedPerson.name}</h3>
              <p>Status: {selectedPerson.status}</p>
              <p>Phone: {selectedPerson.phone}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
