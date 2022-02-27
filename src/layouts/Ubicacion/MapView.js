import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const defaultPosition = {
  lat: 13.7205,
  lng: -89.20144,
};

const MapView = ({ ubicacion, setUbicacion }) => {
  const [position, setPosition] = useState(defaultPosition);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;

        if (marker != null) {
          setPosition(marker.getLatLng());
        }
        setUbicacion({
          ...ubicacion,
          latitud: marker.getLatLng().lat,
          longitud: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

  useEffect(() => {
    if (ubicacion.id === 0) {
      setUbicacion({
        ...ubicacion,
        latitud: 13.7205,
        longitud: -89.20144,
      });
    }
  }, []);

  return (
    <MapContainer
      center={
        ubicacion.id ? [ubicacion.latitud, ubicacion.longitud] : position
      }
      zoom={18}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={
          ubicacion.id
            ? [ubicacion.latitud, ubicacion.longitud]
            : defaultPosition
        }
        ref={markerRef}
      ></Marker>
    </MapContainer>
  );
};

export default MapView;
