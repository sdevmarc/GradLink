import Header_Dashboard from "@/components/header/Header_Dashboard";
import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const { VITE_API_MAP_DEV } = import.meta.env

mapboxgl.accessToken = VITE_API_MAP_DEV

export default function Tracer() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <SearchDocker />
                <div className="flex-grow w-full">
                    <Map />
                </div>
            </div>
        </>
    )
}

const SearchDocker = () => {
    return (
        <>
            <div className="z-[1] w-1/4 h-[8dvh] p-2 border-[2px] border-black/10 bg-background absolute top-[9dvh] left-[50%] translate-x-[-50%] flex justify-start items-center gap-2 rounded-full">
                <Button variant={`default`} size={`icon`} className="h-full w-10">
                    <IoSearch className="scale-[1.3]" />
                </Button>
                <div className="flex flex-col">
                    <label htmlFor="search" className="text-[.7rem] font-medium">
                        Search
                    </label>
                    <input type="text" id="search" className="text-text placeholder:text-black/30 placeholder:text-sm placeholder:font-semibold bg-transparent text-sm outline-none" placeholder="Search by keywords..." />
                </div>
            </div>
        </>
    )
}

const Map = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(121.15340385396442);
    const [lat, setLat] = useState(16.48675023322725);
    const [zoom, setZoom] = useState(2);

    useEffect(() => {
        if (map.current) return;
        if (mapContainer.current) {
            try {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [lng, lat],
                    zoom: zoom
                });
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        }
    }, []);

    return (
        <div className="w-full h-screen">
            <div ref={mapContainer} className="map-container w-full h-full" />
        </div>
    );
};