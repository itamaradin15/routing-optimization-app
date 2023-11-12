import { useMap } from 'react-leaflet';
import {Button} from "@nextui-org/button";
import { IconCurrentLocation } from '@tabler/icons-react';

export default function CenterLocationButton({ setIsClickActive } : { setIsClickActive: (value: boolean) => void}) {
  const map = useMap();

  const handleLocate = () => {
    setIsClickActive(false); 
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo([position.coords.latitude, position.coords.longitude], map.getZoom(), {
          animate: true,
          duration: 2 
        });

        setTimeout(() => {
          setIsClickActive(true);
        }, 10000);
      },
      () => {
        alert("No se pudo obtener tu ubicación");
        setIsClickActive(true); 
      }
    );
  };

  return (
    <Button variant="faded" isIconOnly size='sm' color="primary"  onClick={handleLocate} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <IconCurrentLocation color='gray' size={30} />
    </Button>
  );
}
