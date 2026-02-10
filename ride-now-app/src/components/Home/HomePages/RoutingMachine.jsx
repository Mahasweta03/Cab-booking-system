import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

function RoutingMachine({ pickupCoords, dropCoords }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !pickupCoords || !dropCoords) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(pickupCoords[0], pickupCoords[1]),
        L.latLng(dropCoords[0], dropCoords[1])
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      // Safely remove the routing control
      if (map && routingControl && typeof map.removeControl === 'function') {
        try {
          map.removeControl(routingControl);
        } catch (err) {
          console.warn("Failed to remove routing control:", err);
        }
      }
    };
  }, [map, pickupCoords, dropCoords]);

  return null;
}

export default RoutingMachine;
