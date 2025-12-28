import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon missing in Leaflet + Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export function LeafletMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Prevent double initialization
        if (mapInstance.current) return;

        // JS Corps HQ Coordinates
        const position: [number, number] = [11.287994401133215, 77.53978973417209];

        // Initialize Map
        const map = L.map(mapRef.current, {
            center: position,
            zoom: 15,
            scrollWheelZoom: false,
        });

        // Add Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add Marker
        L.marker(position)
            .addTo(map)
            .bindPopup('<b>JS Corporations HQ</b><br>Magisesan S')
            .openPopup();

        mapInstance.current = map;

        // Cleanup
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    return <div ref={mapRef} className="h-full w-full rounded-xl z-0" />;
}
