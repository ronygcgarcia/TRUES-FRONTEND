import React, { Component, useEffect, useState } from "react";
import { ReactDOM } from "react";
import LocationPicker from "../../lib";
import { usePosition } from "use-position";

const defaultPosition = {
  lat: 13.718535087836534,
  lng: -89.203137168266,
};

function FormUbicacionMap({ ubicacion,setUbicacion }) {
  const [posicion, setPosicion] = useState({
    address: "Kala Pattar Ascent Trail, Khumjung 56000, Nepal",
    position: defaultPosition,
    defaultPosition: defaultPosition,
  });

  const watch = true;
  const { latitude, longitude } = usePosition(watch);

  const handleLocationChange = ({ position, address }) => {
    // Set new location
    console.table(position, address);
    setUbicacion({
      ...ubicacion,
      latitud: position.lat,
      longitud: position.lng,
    });
  };

  return (
    <div>
      <div>
        <LocationPicker
          containerElement={<div style={{ height: "100%" }} />}
          mapElement={<div style={{ height: "500px", width: "600px" }} />}
          defaultPosition={defaultPosition}
          radius={-1}
          onChange={handleLocationChange}
          zoom={17}
        />
      </div>
      <div>{latitude && longitude ? <p>Tu ubicacion: {latitude}, {longitude}</p> : <p></p>}</div>
    </div>
  );
}

export default FormUbicacionMap;
