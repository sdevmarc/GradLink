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
import { BookOpen, CircleCheck, CircleDashed, CircleX, Clock, Filter, GraduationCap, Loader, Mail, Search } from "lucide-react"
import { SheetModal } from "@/components/sheet-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeftSheetModal } from "@/components/left-sheet-modal"
import { createPortal } from 'react-dom';
import AlumniCap from '@/assets/alumnicap.svg';
import { department } from '@/components/data-table-components/options.json'

export default function TracerMap() {
    const [isSearch, setSearch] = useState<boolean>(false)
    const [program, setProgram] = useState<string>('')
    const [yearGraduated, setYearGraduated] = useState<string>('')

    const handleSearchOpenChange = (open: boolean) => {
        setSearch(open)
    }

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
                            <SidebarNavs title="Google Form" link={ROUTES.GOOGLE_FORM} />
                        </Sidebar>
                        <MainTable>
                            <div className="w-full h-screen flex flex-col gap-4 pb-4 rounded-md">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Search ID Number"
                                            className="h-8 w-[17rem] lg:w-[20rem]"
                                        />
                                        <Button onClick={() => setSearch(true)} variant={`outline`} size={`sm`} className="flex items-center gap-2">
                                            <Search className="text-primary" size={18} />    Search
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Combobox
                                            btnTitleclassName="gap-2"
                                            icon={<Filter className="text-primary" size={15} />}
                                            className='w-[200px]'
                                            lists={department || []}
                                            placeholder={`Program`}
                                            setValue={(item) => setProgram(item)}
                                            value={program || ''}
                                        />
                                        <Combobox
                                            btnTitleclassName="gap-2"
                                            icon={<Filter className="text-primary" size={15} />}
                                            className='w-[150px]'
                                            lists={graduation_date || []}
                                            placeholder={`Year Graduated`}
                                            setValue={(item) => setYearGraduated(item)}
                                            value={yearGraduated || ''}
                                        />
                                    </div>
                                </div>

                                <div className="w-full min-h-[65%] rounded-md overflow-hidden">
                                    <Map />
                                    <LeftSheetModal
                                        className="w-[30%]"
                                        isOpen={isSearch}
                                        onOpenChange={handleSearchOpenChange}
                                        title="Search for alumni"
                                        description="View searched results."
                                        content={<SearchCard idNumber="37472210" />}
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

const SearchCard = ({ idNumber }: { idNumber: string }) => {
    console.log('From search card: ', idNumber)
    return (
        <div className="flex flex-col">
            <Card className="w-full mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center justify-between">
                                <CardTitle className="uppercase text-3xl font-bold flex flex-col">
                                    {/* {lastname}, {firstname} {middlename} */} SUAREZ, MARC EDISON DONATO
                                    <span className="font-normal text-md lowercase flex items-center gap-2">
                                        <Mail className="text-muted-foreground" size={18} />
                                        {/* {email || 'No valid Email'} */} suanieeee@yahoo.com
                                    </span>
                                </CardTitle>
                            </div>

                            <CardDescription className="mt-2 flex flex-col items-start gap-2">
                                <div className="flex items-center">
                                    <Badge variant="default" className="mr-2">
                                        {/* {idNumber || 'No valid ID Number'} */} 37472210
                                    </Badge>
                                    <span className="text-muted-foreground uppercase">
                                        {/* {department} | {programCode} | {programName} */}
                                        SEAIT | MIT | Master Of Information Technology
                                    </span>
                                </div>
                                <Badge variant="default" className="mr-2">
                                    {/* {idNumber || 'No valid ID Number'} */} Software Engineer
                                </Badge>
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Button variant={`outline`} size={`sm`}>
                            View in Map
                        </Button>
                        <Button variant={`default`} size={`sm`}>
                            View Profile
                        </Button>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}

interface Marker {
    lng: number
    lat: number
    name: string
    idNumber: string
    program: string
    yearGraduated: string
}


const HoverCard = ({
    isVisible,
    position,
    markerData
}: {
    isVisible: boolean;
    position: { x: number; y: number };
    markerData: Marker;
}) => {
    if (!isVisible) return null;

    return createPortal(
        <div
            className="fixed z-[1000] bg-white rounded-lg shadow-lg p-3 min-w-[200px]"
            style={{
                left: position.x - 100,
                top: position.y - 130,
            }}
        >
            <div className="space-y-2">
                <div className="w-full flex items-center justify-between gap-2 pb-2">
                    <img src={AlumniCap} alt="Alumni" className="w-6 h-6" />
                    <div className="w-full flex items-center justify-end">
                        <div className="w-full flex flex-col gap-1 ">
                            <h3 className="font-medium text-sm">{markerData.name}</h3>
                            <p className="text-xs text-gray-500">{markerData.idNumber}</p>
                            <p className="text-xs font-semibold">
                                2024 - 2025
                            </p>
                            <p className="text-xs font-semibold">
                                MIT
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};


const Map = () => {
    const [selectedmarker, setSelectedMarker] = useState<{ visible: boolean, idNumber: string }>({
        visible: false,
        idNumber: ''
    })
    const [hoverInfo, setHoverInfo] = useState<{
        visible: boolean;
        position: { x: number; y: number };
        marker: Marker | null;
    }>({
        visible: false,
        position: { x: 0, y: 0 },
        marker: null
    });
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const [lng, setLng] = useState(121.15340385396442)
    const [lat, setLat] = useState(16.48675023322725)
    const [zoom, setZoom] = useState(3)
    const [isMapLoading, setMapLoading] = useState(true) // Add loading state
    const markers: Marker[] = [
        { lng: 121.3598812, lat: 17.667649, name: 'Marc Edison Suarez', idNumber: '37472210', program: 'MIT', yearGraduated: '2025 - 2026' },
        { lng: 118.0583411, lat: 17.7292005, name: 'Juan Dela Cruz', idNumber: '12345678', program: 'MIT', yearGraduated: '2025 - 2026' },
        { lng: 121.16, lat: 16.49, name: 'John Doe', idNumber: '87654321', program: 'MIT', yearGraduated: '2025 - 2026' },
    ]

    mapboxgl.accessToken = MAPKEY

    useEffect(() => {
        if (map.current) return // Initialize map only once
        if (mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [121.15340385396442, 16.48675023322725],
                zoom,
            })

            map.current.on('load', () => {
                setMapLoading(false) // Turn off loading once the map is loaded

                markers.forEach(marker => {
                    const el = document.createElement('div')
                    el.className = 'marker'

                    const root = createRoot(el)
                    root.render(<img src={AlumniCap} alt="icon" className="w-8 h-8" />)

                    el.addEventListener('mouseenter', (e) => {
                        setHoverInfo({
                            visible: true,
                            position: { x: e.pageX, y: e.pageY },
                            marker: marker
                        });
                    });

                    el.addEventListener('mouseleave', () => {
                        setHoverInfo(prev => ({ ...prev, visible: false }));
                    });

                    el.addEventListener('mousemove', (e) => {
                        setHoverInfo(prev => ({
                            ...prev,
                            position: { x: e.pageX, y: e.pageY }
                        }));
                    });

                    new mapboxgl.Marker(el)
                        .setLngLat([marker.lng, marker.lat])
                        .addTo(map.current!)
                        .getElement()
                        .addEventListener('click', () => {
                            console.log('click')
                            setSelectedMarker(prev => ({
                                ...prev,
                                visible: true,
                                idNumber: marker.idNumber
                            }))
                        })
                })
            })

            map.current.on('error', (e) => {
                console.error('Mapbox error:', e);
                setMapLoading(false);
            });
        }
    }, [lng, lat, zoom, markers, selectedmarker])

    const handleCloseModal = () => {
        setSelectedMarker({
            visible: false,
            idNumber: ''
        });
    };

    return (

        <div className="w-full h-full relative">
            {isMapLoading && <div>Map is loading...</div>}
            <div ref={mapContainer} className={`w-full h-full`} />
            {hoverInfo.marker && (
                <HoverCard
                    isVisible={hoverInfo.visible}
                    position={hoverInfo.position}
                    markerData={hoverInfo.marker}
                />
            )}
            <SheetModal
                className="w-[60%]"
                isOpen={selectedmarker.visible}
                onOpenChange={handleCloseModal}
                title="Alumni Details"
                description="View details of the selected alumna."
                content={
                    <div className="flex flex-col min-h-screen items-center">
                        <div className="w-full max-w-[90rem] flex flex-col">
                            <main className="flex justify-center items-center py-4">
                                <div className="min-h-screen w-full max-w-[70rem] flex flex-col gap-4">
                                    <Card className="w-full mx-auto">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="w-full flex flex-col">
                                                    <div className="w-full flex items-center justify-between">
                                                        <CardTitle className="uppercase text-3xl font-bold flex flex-col">
                                                            {/* {lastname}, {firstname} {middlename} */}
                                                            SUAREZ, MARC EDISON D.
                                                            <span className="font-normal text-md lowercase flex items-center gap-2">
                                                                <Mail className="text-muted-foreground" size={18} />
                                                                {/* {email || 'No valid Email'} */}
                                                                suanieeee@yahoo.com
                                                            </span>
                                                        </CardTitle>

                                                    </div>

                                                    <CardDescription className="mt-2 flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Badge variant="default" className="mr-2">
                                                                {/* {idNumber || 'No valid ID Number'} */}
                                                                37472210
                                                            </Badge>
                                                            <span className="text-muted-foreground uppercase">
                                                                {/* {department} | {programCode} | {programName} */}
                                                                SEAIT | MIT | Master of Information Technology
                                                            </span>
                                                        </div>
                                                    </CardDescription>
                                                </div>
                                                {/* <Button>Apply Now</Button> */}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="w-full mx-auto">
                                                <CardHeader>
                                                    <CardTitle className="text-xl">Bachelor's Degree Information</CardTitle>
                                                </CardHeader>
                                                <CardContent className="flex flex-wrap gap-4">
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            College/University
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {undergraduateInformation?.college || 'None'} */}
                                                            Saint Mary's University
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            School
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {undergraduateInformation?.school || 'None'} */}
                                                            College of Law
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            Program
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {undergraduateInformation?.programGraduated || 'None'} */}
                                                            MIT
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            Year Graduated
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {undergraduateInformation?.yearGraduated || 'None'} */}
                                                            2025
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            Honors/Awards Received
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {achievements?.awards || 'None'} */}
                                                            Academic Achiever
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            Professional Exam Passed
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {achievements?.examPassed || 'None'} */}
                                                            CSE
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            Professional Exam Date
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {achievements?.examDate || 'None'} */}
                                                            2024
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                        <span className="text-md font-semibold">
                                                            Professional Exam Rating
                                                        </span>
                                                        <span className="text-md font-normal">
                                                            {/* {achievements?.examRating ? `${achievements?.examRating}%` : 'None'} */}
                                                            20%
                                                        </span>
                                                    </div>

                                                </CardContent>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="w-full mx-auto">
                                        <CardHeader>
                                            <div className="w-full flex flex-col items-start gap-2">
                                                <div className="w-full flex items-center justify-between">
                                                    <h1 className="text-xl font-semibold">
                                                        {/* {programName} */} Master Of Information Technology
                                                    </h1>
                                                </div>

                                                <div className="w-full flex items-center justify-between">
                                                    <h1 className="text-lg font-medium flex items-center gap-2">
                                                        Courses:
                                                    </h1>
                                                    <div className="flex items-center">
                                                        <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                        {/* <span>Credits: {totalOfUnitsEarned} / {totalOfUnitsEnrolled}</span> */}
                                                        <span>Credits: 20 / 20</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-col">
                                                <table className="w-full ">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left font-normal pb-2">Course No.</th>
                                                            <th className="text-left font-medium pb-2">Descriptive Title</th>
                                                            <th className="text-left font-medium pb-2">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* {enrolledCourses?.map((item, i) => (
                                                        <tr key={i} className="border-b last:border-0">
                                                            <td className="py-2">
                                                                <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                    <GraduationCap size={18} className="h-5 w-5 text-muted-foreground" />
                                                                    {item.courseno}
                                                                </span>
                                                            </td>
                                                            <td className="py-2">
                                                                <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                    {item.descriptiveTitle}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 text-left text-medium">
                                                                <span className="text-sm font-normal flex items-center gap-2 capitalize ">
                                                                    {
                                                                        item.status === 'ongoing' &&
                                                                        <div className="flex items-center gap-2">
                                                                            <Loader className="text-primary" size={18} />
                                                                            Ongoing
                                                                        </div>
                                                                    }
                                                                    {
                                                                        item.status === 'pass' &&
                                                                        <div className="flex items-center gap-2">
                                                                            <CircleCheck className="text-primary" size={18} />
                                                                            PASSED
                                                                        </div>
                                                                    }
                                                                    {
                                                                        item.status === 'fail' &&
                                                                        <div className="flex items-center gap-2">
                                                                            <CircleX className="text-primary" size={18} />
                                                                            Failed
                                                                        </div>
                                                                    }
                                                                    {
                                                                        item.status === 'not_taken' &&
                                                                        <div className="flex items-center gap-2">
                                                                            <CircleDashed className="text-primary" size={18} />
                                                                            Not taken yet
                                                                        </div>
                                                                    }
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))} */}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </main>
                        </div>
                    </div>
                }
            />
        </div>
    )
}