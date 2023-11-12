import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@nextui-org/input';
import { SearchIcon } from './icons';
import { Map } from 'leaflet'

export default function SearchLocation({ map }: { map: Map | null }) {
  const [address, setAddress] = useState('');

  const handleSearch = async () => {
    const accessToken = 'TU_ACCESS_TOKEN_MAPBOX'; // Reemplaza con tu clave API de Mapbox
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`;

    try {
      const response = await axios.get(url);
      const { features } = response.data;
      if (features && features.length > 0) {
        const { center } = features[0];
        if (map) {
          map.flyTo([center[1], center[0]], 13);
        } else {
          alert('Dirección no encontrada');
        }
      }
    } catch (error) {
      console.error('Error en la búsqueda de la dirección:', error);
    }
  }

  return (
    <div style={{ position: 'absolute', top: '20px', left: '50px', zIndex: 1000 }} >
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-50",
          input: "text-sm",
        }}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
    </div>
  );
}
