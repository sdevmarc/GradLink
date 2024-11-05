import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import MainTable from "@/components/main-table"
import { MAPKEY, ROUTES } from "@/constants"
import 'mapbox-gl/dist/mapbox-gl.css'
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Button } from '@/components/ui/button'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/combobox"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Filter, GraduationCap, Search } from "lucide-react"
import { RightSheetModal } from "@/components/right-sheet-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeftSheetModal } from "@/components/left-sheet-modal"

// interface Answer {
//     index: number
//     question: string
//     answer: string
// }

// interface AlumniDetailsProps {
//     idNumber: string
//     onClose: () => void
// }

interface MapProps {
    setSelectedMarker: (id: string | null) => void
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

export default function TracerMap() {
    const [isSearch, setSearch] = useState<boolean>(false)
    const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false)
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
    const [program, setProgram] = useState<string>('')
    const [yearGraduated, setYearGraduated] = useState<string>('')

    useEffect(() => {
        if (selectedMarker) {
            setDetailsOpen(true)
        }
    }, [selectedMarker])

    const handleDetailsOpenChange = (open: boolean) => {
        setDetailsOpen(open)
    }

    const handleSearchOpenChange = (open: boolean) => {
        setSearch(open)
    }

    const department = [
        { label: 'SEAIT', value: 'SEAIT' },
        { label: 'SAB', value: 'SAB' },
        { label: 'STEH', value: 'STEH' },
        { label: 'SHANS', value: 'SHANS' },
        { label: 'CL', value: 'CL' }
    ]

    const graduation_date = [
        { label: '2024 - 2025', value: '2024 - 2025' },
        { label: '2023 - 2024', value: '2023 - 2024' },
        { label: '2022 - 2023', value: '2022 - 2023' },
        { label: '2021 - 2022', value: '2021 - 2022' },
        { label: '2020 - 2021', value: '2020 - 2021' }
    ]


    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="ALUMNI INFORMATION"
                                description="View and manage alumni."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Alumni Information" link={ROUTES.ALUMNI} />
                            <SidebarNavs bg='bg-muted' title="Tracer Map" link={ROUTES.TRACER_MAP} />
                        </Sidebar>
                        <MainTable>
                            <div className="w-full h-[33rem] flex flex-col gap-4 pb-4 rounded-md">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Search ID Number"
                                            className="h-8 w-[17rem] lg:w-[20rem]"
                                        />
                                        <Button onClick={() => setSearch(true)} variant={`outline`} size={`sm`} className="flex items-center gap-2">
                                            <Search color="#000000" size={18} />    Search
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Combobox
                                            btnTitleclassName="gap-2"
                                            icon={<Filter color="#000000" size={15} />}
                                            className='w-[200px]'
                                            lists={department || []}
                                            placeholder={`Program`}
                                            setValue={(item) => setProgram(item)}
                                            value={program || ''}
                                        />
                                        <Combobox
                                            btnTitleclassName="gap-2"
                                            icon={<Filter color="#000000" size={15} />}
                                            className='w-[150px]'
                                            lists={graduation_date || []}
                                            placeholder={`Year Graduated`}
                                            setValue={(item) => setYearGraduated(item)}
                                            value={yearGraduated || ''}
                                        />
                                    </div>
                                </div>

                                <div className="w-full h-full rounded-md overflow-hidden">
                                    <Map setSelectedMarker={(e) => setSelectedMarker(e)} />
                                    <LeftSheetModal
                                        className="w-[30%]"
                                        isOpen={isSearch}
                                        onOpenChange={handleSearchOpenChange}
                                        title="Search for alumni"
                                        description="View searched results."
                                        content={''}
                                    />
                                    <RightSheetModal
                                        className="w-[60%]"
                                        isOpen={isDetailsOpen}
                                        onOpenChange={handleDetailsOpenChange}
                                        title="Alumni Details"
                                        description="View details of the selected alumna."
                                        content={
                                            <div className="flex flex-col min-h-screen items-center">
                                                <div className="w-full max-w-[90rem] flex flex-col">
                                                    <main className="flex justify-center items-center py-4">
                                                        <div className="min-h-screen w-full max-w-[70rem]">
                                                            <Card className="w-full mx-auto">
                                                                <CardHeader>
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <CardTitle className="capitalize text-3xl font-bold">
                                                                                MASTER OF INFORMATION TECHNOLOGY
                                                                            </CardTitle>
                                                                            <CardDescription className="mt-2">
                                                                                <Badge variant="default" className="mr-2">
                                                                                    MIT
                                                                                </Badge>
                                                                                <span className="text-muted-foreground">
                                                                                    CURRICULUM 2024
                                                                                </span>
                                                                            </CardDescription>
                                                                        </div>
                                                                        {/* <Button>Apply Now</Button> */}
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                    <section className="space-y-4">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div className="flex items-center">
                                                                                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                                <span>Residency: 3 years</span>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                                <span>Credits: 2-</span>
                                                                            </div>
                                                                        </div>
                                                                    </section>

                                                                    <section className="space-y-4">
                                                                        <div>
                                                                            <h3 className="font-semibold text-lg">Courses</h3>
                                                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                                                <li className="flex items-center">
                                                                                    <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                                                                                    Data Analytics
                                                                                </li>

                                                                            </ul>
                                                                        </div>
                                                                    </section>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </main>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}

// const AlumniDetails = ({ idNumber, onClose }: AlumniDetailsProps) => {
//     // const idNumber = '37472210'

//     const { data: dataAlumni, isLoading: isalumniLoading, isFetched: isalumniFetched } = useQuery({
//         queryFn: () => API_STUDENT_FINDONE_ALUMNI({ idNumber }),
//         queryKey: ['alumni', { idNumber }],
//         enabled: !!idNumber
//     })

//     const removeNumbering = (question: string) => {
//         return question.replace(/^\d+\.\s*/, '') // Removes the number followed by a dot and optional space
//     }

//     // if (isalumniFetched) { dataAlumni.data.trainingAdvanceStudies.answers.map((item: Answer) => { console.log(item) }) }

//     return (
//         <>
//             <div className="z-[1] w-[27%] h-[88dvh] backdrop-blur-[1rem] backdrop-saturate-50 fixed top-[4.5rem] left-[5%] translate-x-[-17%] p-4 rounded-lg shadow-[_0_10px_15px_-3px_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-1/3 before:rounded-lg before:bg-gradient-to-t before:from-accent">
//                 <div onClick={onClose} className='z-[1] absolute top-4 right-[-6.5%] px-2 py-2 rounded-lg bg-primary hover:bg-black/80 cursor-pointer'>
//                     <X size={20} color='#ffffff' />
//                 </div>
//                 {isalumniLoading && <div className="text-center">Loading...</div>}
//                 {
//                     isalumniFetched &&
//                     <div className="w-full h-full flex flex-col gap-2 overflow-hidden">
//                         <Button variant={`outline`} size={`sm`} className='absolute bg-primary text-primary-foreground bottom-[5%] left-[50%] translate-x-[-50%]'>
//                             View More
//                         </Button>
//                         <div className="bg-white p-4 rounded-lg shadow-sm">
//                             <h2 className="text-lg font-semibold text-primary mb-4">General Information</h2>
//                             <div className="grid grid-cols-1 gap-3">
//                                 <div className="flex justify-between items-center border-b pb-2">
//                                     <span className="text-sm text-gray-600">
//                                         Name
//                                     </span>
//                                     <span className="text-sm font-medium text-gray-800">
//                                         {dataAlumni.data.name || 'N/A'}
//                                     </span>
//                                 </div>
//                                 {
//                                     dataAlumni.data.generalInformation.answers.map((item: Answer) => (
//                                         <div key={item.index} className="flex justify-between items-center border-b pb-2">
//                                             <span className="text-sm text-gray-600">
//                                                 {removeNumbering(item.question)}
//                                             </span>
//                                             <span className="text-sm font-medium text-gray-800">
//                                                 {item.answer}
//                                             </span>
//                                         </div>
//                                     ))
//                                 }
//                             </div>
//                         </div>
//                         <div className=" bg-white p-4 rounded-lg shadow-sm">
//                             <h2 className="text-lg font-semibold text-primary mb-4 line-clamp-1">Training(s) Advance Studies Attended After College</h2>
//                             <div className="grid grid-cols-1 gap-3">
//                                 <div className="flex justify-between items-center border-b pb-2">
//                                     <span className="text-sm text-gray-600">
//                                         {dataAlumni.data.trainingAdvanceStudies.answers[0].question}
//                                     </span>
//                                     <span className="text-sm font-medium text-gray-800">
//                                         {dataAlumni.data.trainingAdvanceStudies.answers[0].answer || 'N/A'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 }
//             </div>
//         </>
//     )
// }

const Map = ({ setSelectedMarker }: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const [lng, setLng] = useState(121.15340385396442)
    const [lat, setLat] = useState(16.48675023322725)
    const [zoom, setZoom] = useState(3)
    const [isMapLoading, setMapLoading] = useState(true) // Add loading state
    const markers: Marker[] = [
        { lng: 121.3598812, lat: 17.667649, title: 'Marker 1', idNumber: '37472210' },
        { lng: 118.0583411, lat: 17.7292005, title: 'Marker 2', idNumber: '12345678' },
        { lng: 121.16, lat: 16.49, title: 'Marker 3', idNumber: '87654321' },
    ]

    mapboxgl.accessToken = MAPKEY

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
                setMapLoading(false) // Turn off loading once the map is loaded

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

            map.current.on('error', (e) => {
                console.error('Mapbox error:', e);
                setMapLoading(false);
            });
        }
    }, [lng, lat, zoom, markers, setSelectedMarker])

    return (

        <div className="w-full h-full relative">
            {isMapLoading && <div>Map is loading...</div>}
            {/* <div className="w-[20rem] h-[20rem] bg-black"></div> */}
            <div ref={mapContainer} className={`w-full h-full`} />
        </div>
    )
}