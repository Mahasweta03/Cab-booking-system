import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from '../../Home/HomePages/RoutingMachine.jsx'; // Import the new component

// Re-using the icons from CabDetails.jsx logic
const sourceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// if (this._layer) {
//   this._map.removeLayer(this._layer);
// }

// Component to handle map view updates declaratively
function MapUpdater({ pickupCoords, dropCoords }) {
  const map = useMap();
  useEffect(() => {
    if (pickupCoords && dropCoords) {
      map.fitBounds(L.latLngBounds([pickupCoords, dropCoords]), { padding: [50, 50] });
    } else if (pickupCoords) {
      map.setView(pickupCoords, 13);
    } else if (dropCoords) {
      map.setView(dropCoords, 13);
    }
  }, [pickupCoords, dropCoords, map]);
  return null;
}

function MyMap({ pickupCoords, dropCoords }) {
  // Default center if no coords are provided
  const defaultCenter = [20.5937, 78.9629]; // Approx center of India

  return (
    <MapContainer
      center={pickupCoords || defaultCenter}
      zoom={pickupCoords ? 13 : 5}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true} // Let's enable this for better interactivity
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickupCoords && <Marker position={pickupCoords} icon={sourceIcon}><Popup>Pickup Location</Popup></Marker>}
      {dropCoords && <Marker position={dropCoords} icon={destIcon}><Popup>Drop Location</Popup></Marker>}
      {/* Replace Polyline with the new RoutingMachine component */}
      {pickupCoords && dropCoords && (
        <RoutingMachine pickupCoords={pickupCoords} dropCoords={dropCoords} />
      )}

      {/* Add a component to handle map view updates */}
      <MapUpdater pickupCoords={pickupCoords} dropCoords={dropCoords} />
    </MapContainer>
  );
}

export default MyMap;