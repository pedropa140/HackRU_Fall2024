import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

// Sample people data with coordinates
const initialPeople = [
  { name: "Alice", latitude: 40.501548, longitude: -74.447896, status: "Family", phone: "123-456-7890" },
  { name: "Bob", latitude: 40.502248, longitude: -74.448896, status: "Friend", phone: "234-567-8901" },
  { name: "Charlie", latitude: 40.500248, longitude: -74.449896, status: "Primary Caregiver", phone: "345-678-9012" },
];

const MapComponent = () => {
  const [accessToken, setAccessToken] = useState("");
  const [location, setLocation] = useState(null); // User's current location
  const [people, setPeople] = useState(initialPeople); // People data
  const [viewState, setViewState] = useState({
    latitude: 40.501248,
    longitude: -74.448896,
    zoom: 12,
  });
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null); // Person for modal display
  const [isFormOpen, setIsFormOpen] = useState(false); // Form modal visibility
  const [newPerson, setNewPerson] = useState({ name: '', status: '', phone: '', latitude: '', longitude: '' }); // New person data

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

  const handleMarkerClick = (person) => {
    setSelectedPerson(person);
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

    // Add new person to the map
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

    setNewPerson({ name: '', status: '', phone: '', latitude: '', longitude: '' }); // Clear form fields
    setIsFormOpen(false); // Close form modal
  };

  if (!accessToken) return <div>Loading Map...</div>;
  if (!location) return <div>Fetching Location...</div>;

  return (
    <div style={{ position: 'relative' }}>
      {/* Search Input */}
      <input
        type="text"
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

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
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

        {/* People Markers with Hover Tooltips */}
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

        {/* Show name only on hover */}
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
      </Map>

      {/* Add Person Form Button */}
      <button
        onClick={toggleFormModal}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add Person
      </button>

      {/* Modal for showing person details */}
      {selectedPerson && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            width: '300px',
            textAlign: 'center',
          }}
        >
          <h3>{selectedPerson.name}</h3>
          <p>Status: {selectedPerson.status}</p>
          <p>Phone: {selectedPerson.phone}</p>
          <button
            onClick={closeModal}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Form Modal for adding a new person */}
      {isFormOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            width: '300px',
            textAlign: 'center',
          }}
        >
          <h3>Add a New Person</h3>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newPerson.name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              value={newPerson.status}
              onChange={handleInputChange}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newPerson.phone}
              onChange={handleInputChange}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={newPerson.latitude}
              onChange={handleInputChange}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={newPerson.longitude}
              onChange={handleInputChange}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Add
            </button>
          </form>
          <button
            onClick={toggleFormModal}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#dc3545',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
