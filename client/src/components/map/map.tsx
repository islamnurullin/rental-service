import React, { useRef, useEffect, useState } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useMap from './useMap';
import { URL_MARKER_DEFAULT, URL_MARKER_CURRENT } from '../../const';
import { CityOffer, OffersList } from '../../types/offer';

type MapProps = {
    city: CityOffer,
    points: OffersList[],
    selectedPoint: string | null
}

function Map({city, points, selectedPoint}: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const map = useMap({ mapRef, city });
    const [markerLayer, setMarkerLayer] = useState<leaflet.LayerGroup | null>(null);

    const defaultCustomIcon = leaflet.icon({
        iconUrl: URL_MARKER_DEFAULT,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const currentCustomIcon = leaflet.icon({
        iconUrl: URL_MARKER_CURRENT,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    useEffect(() => {
        if (map) {
            if (!markerLayer) {
                const layer = leaflet.layerGroup().addTo(map);
                setMarkerLayer(layer);
            }
        }
    }, [map, markerLayer]);

    useEffect(() => {
        if (map && markerLayer) {
            markerLayer.clearLayers();
            points.forEach((point) => {
                leaflet
                    .marker({
                        lat: point.location.latitude,
                        lng: point.location.longitude,
                    }, {
                        icon: (point.id === selectedPoint)
                            ? currentCustomIcon  
                            : defaultCustomIcon, 
                    })
                    .addTo(markerLayer);
            });
        }
    }, [map, markerLayer, points, selectedPoint, defaultCustomIcon, currentCustomIcon]);

    useEffect(() => {
        if (map) {
            map.setView({
                lat: city.location.latitude,
                lng: city.location.longitude,
            }, city.location.zoom);
        }
    }, [map, city]);

    return (
        <div
            style={{height: '500px'}}
            ref={mapRef}
        >
        </div>
    );
}

export default Map;