import 'mapbox-gl/dist/mapbox-gl.css'
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useQuery } from '@tanstack/react-query'
import { API_STUDENT_FINDONE_ALUMNI } from '@/api/alumni'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Loading from '@/components/loading'

const { VITE_API_MAP_DEV } = import.meta.env

mapboxgl.accessToken = VITE_API_MAP_DEV

export default function Tracer() {
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="flex-grow w-full">
                    <Map setSelectedMarker={setSelectedMarker} />
                    {selectedMarker && (
                        <AlumniDetails idNumber={selectedMarker} onClose={() => setSelectedMarker(null)} />
                    )}
                </div>
            </div>
        </>
    )
}

interface Answer {
    index: number
    question: string
    answer: string
}

interface AlumniDetailsProps {
    idNumber: string
    onClose: () => void
}

const AlumniDetails = ({ idNumber, onClose }: AlumniDetailsProps) => {
    // const idNumber = '37472210'

    const { data: dataAlumni, isLoading: isalumniLoading, isFetched: isalumniFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDONE_ALUMNI({ idNumber }),
        queryKey: ['alumni', { idNumber }],
        enabled: !!idNumber
    })

    const removeNumbering = (question: string) => {
        return question.replace(/^\d+\.\s*/, '') // Removes the number followed by a dot and optional space
    }

    // if (isalumniFetched) { dataAlumni.data.trainingAdvanceStudies.answers.map((item: Answer) => { console.log(item) }) }

    return (
        <>
            <div className="z-[1] w-[27%] h-[88dvh] backdrop-blur-[1rem] backdrop-saturate-50 fixed top-[4.5rem] left-[5%] translate-x-[-17%] p-4 rounded-lg shadow-[_0_10px_15px_-3px_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-1/3 before:rounded-lg before:bg-gradient-to-t before:from-accent">
                <div onClick={onClose} className='z-[1] absolute top-4 right-[-6.5%] px-2 py-2 rounded-lg bg-primary hover:bg-black/80 cursor-pointer'>
                    <X size={20} color='#ffffff' />
                </div>
                {isalumniLoading && <div className="text-center">Loading...</div>}
                {
                    isalumniFetched &&
                    <div className="w-full h-full flex flex-col gap-2 overflow-hidden">
                        <Button variant={`outline`} size={`sm`} className='absolute bg-primary text-primary-foreground bottom-[5%] left-[50%] translate-x-[-50%]'>
                            View More
                        </Button>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold text-primary mb-4">General Information</h2>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-sm text-gray-600">
                                        Name
                                    </span>
                                    <span className="text-sm font-medium text-gray-800">
                                        {dataAlumni.data.name || 'N/A'}
                                    </span>
                                </div>
                                {
                                    dataAlumni.data.generalInformation.answers.map((item: Answer) => (
                                        <div key={item.index} className="flex justify-between items-center border-b pb-2">
                                            <span className="text-sm text-gray-600">
                                                {removeNumbering(item.question)}
                                            </span>
                                            <span className="text-sm font-medium text-gray-800">
                                                {item.answer}
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className=" bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold text-primary mb-4 line-clamp-1">Training(s) Advance Studies Attended After College</h2>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-sm text-gray-600">
                                        {dataAlumni.data.trainingAdvanceStudies.answers[0].question}
                                    </span>
                                    <span className="text-sm font-medium text-gray-800">
                                        {dataAlumni.data.trainingAdvanceStudies.answers[0].answer || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

interface Marker {
    lng: number
    lat: number
    title: string
    idNumber: string
}

const IconTablerMapPinFilled = ({
    height = "1em",
    fill = "currentColor",
    focusable = "false",
    ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
    <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height={height}
        focusable={focusable}
        {...props}
    >
        <path
            fill={fill}
            d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203.21l-4.243 4.242a3 3 0 0 1-4.097.135l-.144-.135l-4.244-4.243A9 9 0 0 1 18.364 4.636M12 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
        />
    </svg>
)

interface MapProps {
    setSelectedMarker: (id: string | null) => void
}

const Map = ({ setSelectedMarker }: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const [lng, setLng] = useState(121.15340385396442)
    const [lat, setLat] = useState(16.48675023322725)
    const [zoom, setZoom] = useState(4)
    const [loading, setLoading] = useState(true) // Add loading state
    const markers: Marker[] = [
        { lng: 121.3598812, lat: 17.667649, title: 'Marker 1', idNumber: '37472210' },
        { lng: 118.0583411, lat: 17.7292005, title: 'Marker 2', idNumber: '12345678' },
        { lng: 121.16, lat: 16.49, title: 'Marker 3', idNumber: '87654321' },
    ]

    useEffect(() => {
        if (map.current) return // Initialize map only once
        if (mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom,
            })

            map.current.on('load', () => {
                setLoading(false) // Turn off loading once the map is loaded

                markers.forEach(marker => {
                    const el = document.createElement('div')
                    el.className = 'marker'

                    const root = createRoot(el)
                    root.render(<IconTablerMapPinFilled width="35px" height="35px" style={{ color: "#222222" }} />)

                    const tooltip = document.createElement('div')
                    tooltip.className = 'tooltip'
                    tooltip.innerHTML = `<h3>${marker.title}</h3>`
                    tooltip.style.position = 'absolute'
                    tooltip.style.display = 'none'
                    tooltip.style.background = '#ffffff'
                    tooltip.style.padding = '5px 10px'
                    tooltip.style.borderRadius = '4px'
                    tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)'
                    tooltip.style.fontSize = '12px'
                    tooltip.style.pointerEvents = 'none'

                    document.body.appendChild(tooltip) // Append tooltip directly to body

                    const showTooltip = (e: MouseEvent) => {
                        tooltip.style.display = 'block'
                        tooltip.style.left = `${e.pageX}px`
                        tooltip.style.top = `${e.pageY - 30}px` // Adjust to position tooltip above marker
                    }

                    const hideTooltip = () => {
                        tooltip.style.display = 'none'
                    }

                    el.addEventListener('mouseenter', (e) => {
                        showTooltip(e as MouseEvent)
                    })

                    el.addEventListener('mouseleave', hideTooltip)

                    el.addEventListener('mousemove', (e) => {
                        showTooltip(e as MouseEvent) // Update position while hovering
                    })

                    new mapboxgl.Marker(el)
                        .setLngLat([marker.lng, marker.lat])
                        .addTo(map.current!)
                        .getElement()
                        .addEventListener('click', () => {
                            setSelectedMarker(marker.idNumber) // Set the selected marker
                        })
                })
            })
        }
    }, [lng, lat, zoom, markers, setSelectedMarker])

    return (
        <div className="w-full h-screen relative">
            {loading && (<Loading />)}
            <div ref={mapContainer} className="map-container w-full h-full" />
        </div>
    )
}