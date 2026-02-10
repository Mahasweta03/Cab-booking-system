import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  
});

const MapComponent = () => {
  const pickupPosition = [12.8316, 80.2270]; 
  const dropPosition = [13.0067, 80.2206];   

  const route = [pickupPosition, dropPosition];

  return (
    <MapContainer center={pickupPosition} zoom={11} style={{ height: '100%', width: '100%' }} className='map-container'>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; https://www.openstreetmap.org/ contributors'
      />

      <Marker style={{color:"red"}} position={pickupPosition}>
        <Popup>Pickup: Chennai Siruseri</Popup>
      </Marker>

      <Marker position={dropPosition}>
        <Popup>Drop: Chennai Airport</Popup>
     </Marker>
    </MapContainer>
  );
};

export default MapComponent;
