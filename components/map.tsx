"use client";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvent, useMap } from 'react-leaflet';
import React, { useState, useEffect, useRef } from 'react';
import CenterLocationButton from './center-location-button';
import SearchLocation from './search-location';
import { LatLngTuple, PathOptions, Map as LeafletMap } from 'leaflet';
import polyline from '@mapbox/polyline';
import axios from 'axios';

type FetchTripShapeFn = (coords: LatLngTuple[], setTripShape: React.Dispatch<React.SetStateAction<string | null>>) => void;
type GetLocationFn = (successCallback: PositionCallback, errorCallback: PositionErrorCallback) => void;
type SetViewOnClickProps = { isClickActive: boolean };

const fetchTripShape: FetchTripShapeFn = async (coords, setTripShape) => {
  const queryParams = coords.map(coord => `locations=${encodeURIComponent(coord[0])},${encodeURIComponent(coord[1])}`).join('&');
  try {
    const { data } = await axios.get(`/api/optimize?${queryParams}`);
    setTripShape(data.trip.legs[0].shape);
  } catch (error) {
    console.error("Error al obtener la forma del viaje:", error);
  }
};

const getLocation: GetLocationFn = (successCallback, errorCallback) => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    alert("Geolocalización no disponible en tu navegador");
  }
};

const SetViewOnClick: React.FC<SetViewOnClickProps> = ({ isClickActive }) => {
  useMapEvent('click', (e) => {
    if (isClickActive) {
      e.target.setView(e.latlng, e.target.getZoom(), { animate: true });
    }
  });
  return null;
};


const MapView: React.FC = () => {
  const [isClickActive, setIsClickActive] = useState(true);
  const [tripShape, setTripShape] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple>([-12.2251643, -76.9066824]);
  const [polylineCoords, setPolylineCoords] = useState<LatLngTuple[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  const coords: LatLngTuple[] = [[-12.210877, -76.906223], [-12.211895, -76.903249]];
  const pathOptions: PathOptions = { color: '#3b82f6', weight: 8, stroke: true };

  const SetMapRef = () => {
    const map = useMap();
     mapRef.current = map;
    return null;
  }

  useEffect(() => {
    fetchTripShape(coords, setTripShape);
    getLocation(
      position => setCurrentLocation([position.coords.latitude, position.coords.longitude]),
      () => console.error("No se pudo obtener tu ubicación")
    );
  }, []);

  useEffect(() => {
    if (tripShape) {
      const decodedPath = polyline.decode(tripShape, 6);
      setPolylineCoords(decodedPath.map(([lat, lng]) => [lat, lng] as LatLngTuple));
    }
  }, [tripShape]);

  return (
    <MapContainer center={currentLocation} zoom={13} scrollWheelZoom={true} style={{height: 500, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords.map((item, index) => (
        <Marker key={index} position={item}>
          <Popup>Detalle de Coordenada <br /> aca se muestran.</Popup>
        </Marker>
      ))}
      <Polyline pathOptions={pathOptions} positions={polylineCoords} />
      <SetMapRef />
      <CenterLocationButton setIsClickActive={setIsClickActive} />
      <SetViewOnClick isClickActive={isClickActive} />
      <SearchLocation map={mapRef.current} />
    </MapContainer>
  );
};

export default MapView;
