import Header_Dashboard from "@/components/header-dashboard";
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
                    {/* <AlumniDetails /> */}
                    <Map />
                </div>
            </div>
        </>
    )
}

const AlumniDetails = () => {
    return (
        <>
            <div className="z-[1] w-[27%] h-[90dvh] bg-white/70 fixed top-[9dvh] left-[5%] translate-x-[-17%] flex justify-center items-center rounded-lg shadow-[_0_10px_15px_-3px_rgba(0,0,0,0.5)]">
                <h1 className="text-[2rem] text-text font-semibold">Tite</h1>
            </div>
        </>
    )
}

const SearchDocker = () => {
    const [isSearchClick, setSearchClick] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (!isSearchClick) {
            inputRef.current?.focus();
        }
    };

    return (
        <>
            <div className="z-[1] w-1/4 h-[3.5rem] shadow-[_0_13px_15px_-3px_rgba(0,0,0,0.1)] border-[2px] border-black/10 bg-background absolute top-[9dvh] left-[50%] translate-x-[-50%] flex justify-between items-center gap-2 rounded-full">
                <div className="relative group w-full h-full flex items-center gap-2 py-2 pl-2">
                    <div
                        onClick={handleClick}
                        className={`absolute w-full h-full top-0 left-0 rounded-full cursor-pointer ${isSearchClick ? '' : 'group-hover:bg-black/10'}`}
                    />
                    <Button variant={`default`} size={`icon`} className="h-full w-10">
                        <IoSearch className="scale-[1.3]" />
                    </Button>
                    <div className="flex flex-col flex-grow">
                        <label htmlFor="search" className="text-[.7rem] font-medium">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            ref={inputRef}
                            className="z-[1] text-text placeholder:text-black/30 placeholder:text-sm placeholder:font-semibold bg-transparent text-sm outline-none"
                            placeholder="Search by keywords..."
                            onFocus={() => setSearchClick(true)} // Set the active state on focus
                            onBlur={() => setSearchClick(false)}  // Remove the active state on blur
                        />
                    </div>
                </div>
                <div className="h-full flex items-center text-[.7rem] mr-2 my-2">
                    <Button variant={`default`} className="bg-muted text-text rounded-full ">
                        Filter
                    </Button>
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