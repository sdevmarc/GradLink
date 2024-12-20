import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import MainTable from "@/components/main-table"
import { MAPKEY, ROUTES } from "@/constants"
import 'mapbox-gl/dist/mapbox-gl.css'
import { useRef, useEffect, useState, useContext } from 'react'
import mapboxgl from 'mapbox-gl'
import { Button } from '@/components/ui/button'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/combobox"
import { Badge } from "@/components/ui/badge"
import { BellRing, BookOpen, CircleCheck, CircleDashed, CircleX, Filter, GraduationCap, Loader, LoaderCircle, Mail, Send } from "lucide-react"
import { SheetModal } from "@/components/sheet-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LeftSheetModal } from "@/components/left-sheet-modal"
import { createPortal } from 'react-dom';
import AlumniCap from '@/assets/alumnicap.svg';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API_PROGRAM_FINDALL } from "@/api/program"
import { API_STUDENT_FINDALL_ALUMNI_FOR_TRACER_MAP, API_STUDENT_FINDALL_FILTERED_ALUMNI, API_STUDENT_FINDONE_ALUMNI_FOR_TRACER_MAP, API_STUDENT_YEARS_GRADUATED } from "@/api/student"
import { AlertDialogConfirmation } from "@/components/alert-dialog"
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from "react-router-dom"
import { API_STUDENT_SEND_TRACER } from "@/api/alumni"
import { API_FORM_MAPPED } from "@/api/form"
import { API_USER_CHECK_DEFAULT_PASSWORD, API_USER_GET_USER } from "@/api/user"
import { AuthContext } from "@/hooks/AuthContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TracerMap() {
    const queryClient = useQueryClient()
    const [dialogsendtracer, setDialogSendTracer] = useState<boolean>(false)
    const [filteredPrograms, setFilteredPrograms] = useState<{ label: string, value: string }[]>([])
    const [filteredYearsGraduated, setFilteredYearsGraduated] = useState<{ label: string, value: string }[]>([])
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [program, setProgram] = useState<string>('')
    const [yearGraduated, setYearGraduated] = useState<string>('')
    const [dialogfilterprogram, setDialogFilterProgram] = useState<string>('')
    const [dialogfilteryeargraduated, setDialogFilterYearGraduated] = useState<string>('')
    const [isValid, setValid] = useState<boolean>(false)
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })
    const [reminder, setReminder] = useState<boolean>(true)
    const [searched, setSearched] = useState<{ coordinates: { lng: number, lat: number }, id: string }>({
        coordinates: {
            lng: 0,
            lat: 0
        },
        id: ''
    })
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    const { data: checkpassword, isLoading: checkpasswordLoading, isFetched: checkpasswordFetched } = useQuery({
        queryFn: () => API_USER_CHECK_DEFAULT_PASSWORD(),
        queryKey: ['checkpassword']
    })

    useEffect(() => {
        if (checkpasswordFetched) {
            if (!checkpassword.success) {
                navigate('/overview')
            }
        }
    }, [checkpassword])

    const { isLoading: formLoading } = useQuery({
        queryFn: () => API_FORM_MAPPED(),
        queryKey: ['form']
    })

    const { data: userdata, isLoading: userdataLoading, isFetched: userdataFetched } = useQuery({
        queryFn: () => API_USER_GET_USER(),
        queryKey: ['users']
    })

    const { data: programs, isLoading: programsLoading, isFetched: programsFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    const { data: yearsGraduations, isLoading: yearsgraduateLoading, isFetched: yearsgraduatedFetched } = useQuery({
        queryFn: () => API_STUDENT_YEARS_GRADUATED(),
        queryKey: ['years']
    })

    const { data: filteredAlumni } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_FILTERED_ALUMNI({ search, program, yeargraduated: yearGraduated }),
        queryKey: ['alumni', { search, program, yearGraduated }],
        enabled: isSearch, // Only run when search is triggered
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            setIsSearch(true);
        }
    }

    const handleSearchOpenChange = (open: boolean) => {
        setIsSearch(open)
    }

    useEffect(() => {
        if (programsFetched) {
            const filteringprogram: { label: string, value: string }[] = programs?.data?.map((item: { _id: string, descriptiveTitle: string }) => {
                const { _id, descriptiveTitle } = item
                return { label: descriptiveTitle, value: _id }
            }) || []
            setFilteredPrograms(filteringprogram)
        }
    }, [programs])

    useEffect(() => {
        if (yearsgraduatedFetched) {
            const filteredYears: { label: string, value: string }[] = yearsGraduations?.data?.map((item: { academicYear: string }) => {
                const { academicYear } = item
                return { label: academicYear, value: academicYear }
            }) || []

            setFilteredYearsGraduated(filteredYears)
        }
    }, [yearsGraduations])

    const { mutateAsync: tracer, isPending: tracerLoading } = useMutation({
        mutationFn: API_STUDENT_SEND_TRACER,
        onSuccess: async (data) => {
            if (!data.success) {
                setValid(false)
                setDialogSendTracer(false)
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['alumni'] })
                await queryClient.refetchQueries({ queryKey: ['programs'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                setDialogFilterProgram('')
                setDialogFilterYearGraduated('')
                setValid(true)
                setDialogSendTracer(false)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                return
            }
        },
        onError: (data) => {
            setValid(false)
            setDialogSendTracer(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
            return
        }
    })

    const handleSendTracerStudy = async () => {
        if (!dialogfilterprogram || !dialogfilteryeargraduated) {
            setValid(false)
            setDialogSendTracer(false)
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: 'Please filter by program and year graduated.' })
            return
        }

        await tracer({ academicYear: dialogfilteryeargraduated, program: dialogfilterprogram })
        setDialogSendTracer(false)
        return
    }

    const isLoading = programsLoading || yearsgraduateLoading || formLoading || userdataLoading || checkpasswordLoading || tracerLoading

    return (
        <>
            <AlertDialogConfirmation
                btnTitle='Continue'
                className='w-full py-4'
                isDialog={alertdialogstate.show}
                setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                type={`alert`}
                title={alertdialogstate.title}
                description={alertdialogstate.description}
                icon={alertdialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />}
                variant={`default`}
                btnContinue={() => {
                    setAlertDialogState(prev => ({ ...prev, show: false }))
                    if (isValid) return navigate(-1)

                }}
            />
            <AlertDialogConfirmation
                btnTitle='I understand'
                className='w-full py-4'
                isDialog={reminder}
                setDialog={(open) => setReminder(open)}
                type={`alert`}
                title={`Hi! Please be remind.`}
                description={`If the marker is missing, please consider refreshing.`}
                icon={<BellRing className="text-primary" size={70} />}
                variant={`default`}
                btnContinue={() => setReminder(false)}
            />
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
                            {
                                userdataFetched &&
                                (userdata?.data?.role === 'root' || userdata?.data?.role === 'admin') && (
                                    <SidebarNavs title="Alumni Information" link={ROUTES.ALUMNI} />
                                )
                            }
                            <SidebarNavs bg='bg-muted' title="Tracer Map" link={ROUTES.TRACER_MAP} />
                            <SidebarNavs title="Tracer Respondents" link={ROUTES.GOOGLE_FORM} />
                        </Sidebar>
                        <MainTable>
                            <div className="w-full h-screen flex flex-col gap-4 pb-4 rounded-md">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search Alumni"
                                            className="h-8 w-[17rem] lg:w-[20rem]"
                                            onKeyDown={handleKeyDown}
                                        />
                                        <div className="flex items-center gap-2">
                                            <Combobox
                                                btnTitleclassName="gap-2"
                                                icon={<Filter className="text-primary" size={15} />}
                                                className='w-[200px]'
                                                lists={filteredPrograms || []}
                                                placeholder={`Program`}
                                                setValue={(item) => setProgram(item)}
                                                value={program || ''}
                                            />

                                            <Combobox
                                                btnTitleclassName="gap-2"
                                                icon={<Filter className="text-primary" size={15} />}
                                                className='w-[150px]'
                                                lists={filteredYearsGraduated || []}
                                                placeholder={`Year Graduated`}
                                                setValue={(item) => setYearGraduated(item)}
                                                value={yearGraduated || ''}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-center gap-4">
                                        {
                                            isLoading &&
                                            <div className="flex items-center gap-2">
                                                <LoaderCircle className={`text-muted-foreground animate-spin`} size={18} />
                                                <h1 className="text-muted-foreground text-sm">
                                                    Syncing
                                                </h1>
                                            </div>
                                        }
                                        <AlertDialogConfirmation
                                            isDialog={dialogsendtracer}
                                            setDialog={(e) => setDialogSendTracer(e)}
                                            type={`input`}
                                            disabled={isLoading}
                                            variant={'default'}
                                            btnTitle="Send Batch"
                                            title="Batch Send Tracer"
                                            description={`This action will send tracer base on the filtered data.`}
                                            content={
                                                <div className="w-full flex flex-col gap-4">
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className="text-sm font-medium">
                                                            Choose Program
                                                        </h1>
                                                        <Combobox
                                                            btnTitleclassName="gap-2"
                                                            icon={<Filter className="text-primary" size={15} />}
                                                            className='w-[200px]'
                                                            lists={filteredPrograms || []}
                                                            placeholder={`Program`}
                                                            setValue={(item) => setDialogFilterProgram(item)}
                                                            value={dialogfilterprogram || ''}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className="text-sm font-medium">
                                                            Choose Year Graduated
                                                        </h1>
                                                        <Combobox
                                                            btnTitleclassName="gap-2"
                                                            icon={<Filter className="text-primary" size={15} />}
                                                            className='w-[150px]'
                                                            lists={filteredYearsGraduated || []}
                                                            placeholder={`Year Graduated`}
                                                            setValue={(item) => setDialogFilterYearGraduated(item)}
                                                            value={dialogfilteryeargraduated || ''}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            btnContinue={handleSendTracerStudy}
                                        />
                                        <Button onClick={() => setDialogSendTracer(true)} variant={`outline`} size={`sm`} className="flex items-center gap-2">
                                            <Send className="text-primary" size={18} />   Send tracer study
                                        </Button>
                                        {/* <AlertDialogConfirmation
                                            isDialog={dialogsubmit}
                                            setDialog={(open) => setDialogSubmit(open)}
                                            type={`default`}
                                            disabled={tracerLoading}
                                            variant={'default'}
                                            btnIcon={<Send className="text-primary-foreground" size={18} />}
                                            btnTitle="Send Tracer Study"
                                            title="Are you sure?"
                                            description={`This will send a tracer study and email the alumni accordiing to the filtered program and year graduated.`}
                                            btnContinue={() => setDialogSendTracer(true)}
                                        /> */}
                                    </div>
                                </div>

                                <div className="w-full min-h-[65%] rounded-md overflow-hidden">
                                    <Map coordinates={searched?.coordinates} id={searched?.id} />
                                    <LeftSheetModal
                                        className="w-[30%] overflow-auto"
                                        isOpen={isSearch}
                                        onOpenChange={handleSearchOpenChange}
                                        title="Search for Alumni"
                                        description="View searched results."
                                        content={
                                            <SearchCard
                                                data={filteredAlumni?.data || []}
                                                setCoordinates={(lng: number, lat: number) => setSearched(prev => ({
                                                    ...prev,
                                                    coordinates: {
                                                        lng,
                                                        lat
                                                    }
                                                }))}
                                                setId={(studentid: string) => setSearched(prev => ({
                                                    ...prev,
                                                    id: studentid
                                                }))}
                                                isclose={(e: boolean) => setIsSearch(e)}
                                            />
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

const SearchCard = ({ data, setCoordinates, setId, isclose }: { data: any[], setCoordinates: (lng: number, lat: number) => void, setId: (e: string) => void, isclose: (e: boolean) => void }) => {
    const handleSearchedChange = ({ lng, lat, id }: { lng: number, lat: number, id: string }) => {
        // Fix: Pass coordinates in correct order
        setCoordinates(lng, lat);
        setId(id);
        isclose(false)
    };

    return (
        <div className="flex flex-col gap-4">
            {
                data?.length > 0 ?
                    data?.map(item => (
                        <Card key={item._id} className="w-full mx-auto">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="w-full flex flex-col">
                                        <div className="w-full flex items-center justify-between">
                                            <CardTitle className="uppercase text-xl font-bold flex flex-col">
                                                {item?.lastname}, {item?.firstname} {item?.middlename}
                                                <span className="font-normal text-md lowercase flex flex-col">
                                                    <span className="flex items-center gap-2">
                                                        <Mail className="text-muted-foreground" size={18} />
                                                        {item?.email || 'No valid Email'}
                                                    </span>
                                                    <span className="text-primary text-sm uppercase">
                                                        {item?.program?.department} | {item?.program?.code} | {item?.program?.descriptiveTitle}
                                                    </span>
                                                </span>

                                            </CardTitle>
                                        </div>

                                        <CardDescription className="mt-2 flex flex-col items-start gap-2">
                                            <div className="flex flex-col items-start">
                                                <Badge variant="default" className="mr-2">
                                                    {item?.idNumber || 'No valid ID Number'}
                                                </Badge>
                                            </div>
                                            {/* <Badge variant="default" className="mr-2">
                                                {/* {idNumber || 'No valid ID Number'} Software Engineer
                                            </Badge> */}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    {
                                        item?.isAnsweredForm ?
                                        <Button
                                            onClick={() => {
                                                handleSearchedChange({
                                                    // Fix: Swap the coordinates to correct order
                                                    lng: item?.coordinates?.longitude || 0, // Changed from latitude
                                                    lat: item?.coordinates?.latitude || 0,  // Changed from longitude
                                                    id: item?._id || ''
                                                })
                                            }}
                                            variant="outline"
                                            size="sm"
                                        >
                                            View in Map
                                        </Button>
                                        : 'No tracer study available.'
                                    }

                                    {/* <Button variant={`default`} size={`sm`}>
                                        View Profile
                                    </Button> */}
                                </div>
                            </CardHeader>
                        </Card>
                    )) : (
                        <div className="my-[3rem] flex items-center justify-center">
                            <h1 className="text-xl font-medium">No Active Results.</h1>
                        </div>
                    )
            }
        </div>
    )
}

const formatAnswer = (answer: string | Record<string, any> | null | undefined): React.ReactNode => {
    if (typeof answer === 'object' && answer !== null) {
        return (
            <ul className="list-disc pl-4 mt-2">
                {Object.entries(answer).map(([key, value], index) => (
                    <li key={index} className="text-sm">
                        {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                    </li>
                ))}
            </ul>
        );
    }
    return answer || 'None';
};

const formatQuestion = (question: string): string => {
    // Remove pattern like "1. ", "12. ", etc.
    return question.replace(/^\d+\.\s*/, '');
};

interface Marker {
    _id?: string
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
                left: position.x + 30,
                top: position.y - 100,
            }}
        >
            <div className="space-y-2">
                <div className="w-full flex items-center justify-between gap-2 pb-2">
                    <img src={AlumniCap} alt="Alumni" className="w-6 h-6" loading="lazy" />
                    <div className="w-full flex items-center justify-end">
                        <div className="w-full flex flex-col gap-1 ">
                            <p className="text-xs text-primary-foreground">{markerData.idNumber}</p>
                            <h3 className="font-medium text-sm text-primary-foreground">{markerData.name}</h3>
                            <p className="text-xs font-semibold text-primary-foreground">
                                2024 - 2025
                            </p>
                            <p className="text-xs font-semibold text-primary-foreground">
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


const Map = ({ coordinates, id }: { coordinates: { lng: number, lat: number }, id: string }) => {
    const [selectedmarker, setSelectedMarker] = useState<{ visible: boolean, id: string }>({
        visible: false,
        id: ''
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
    const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
    const [lng, setLng] = useState(121.15340385396442);
    const [lat, setLat] = useState(16.48675023322725);
    // const [zoom, setZoom] = useState(3)

    const { data: dataAlumni, isLoading: alumniLoading, isFetched: alumniFetched } = useQuery({
        queryFn: () => API_STUDENT_FINDALL_ALUMNI_FOR_TRACER_MAP(),
        queryKey: ['students']
    })

    const { data: onealumni } = useQuery({
        queryFn: () => API_STUDENT_FINDONE_ALUMNI_FOR_TRACER_MAP({ id: selectedmarker?.id }),
        queryKey: ['students', { id: selectedmarker?.id }],
        enabled: !!selectedmarker?.id
    })

    mapboxgl.accessToken = MAPKEY

    useEffect(() => {
        if (!mapContainer.current || !dataAlumni?.data) return;

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: 3,
            });
        }

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: 3,
        });

        map.current.on('load', () => {
            // Clear existing markers
            Object.values(markersRef.current).forEach(marker => marker.remove());
            markersRef.current = {};

            dataAlumni.data.forEach((marker: Marker) => {
                const el = document.createElement('div');
                el.className = 'marker';

                const root = createRoot(el);
                root.render(<img src={AlumniCap} alt="icon" className="w-8 h-8" loading="lazy" />);

                // Add hover events
                el.addEventListener('mouseenter', (e: MouseEvent) => {
                    setHoverInfo({
                        visible: true,
                        position: { x: e.pageX, y: e.pageY },
                        marker
                    });
                });

                el.addEventListener('mouseleave', () => {
                    setHoverInfo(prev => ({ ...prev, visible: false }));
                });

                el.addEventListener('mousemove', (e: MouseEvent) => {
                    setHoverInfo(prev => ({
                        ...prev,
                        position: { x: e.pageX, y: e.pageY }
                    }));
                });

                // Create and store marker
                const markerObj = new mapboxgl.Marker(el)
                    .setLngLat([marker.lng, marker.lat])
                    .addTo(map.current!);

                // Store marker reference
                if (marker._id) {
                    markersRef.current[marker._id] = markerObj;
                }

                // Add click handler
                el.addEventListener('click', () => {
                    setLng(marker.lng);
                    setLat(marker.lat);

                    map.current?.flyTo({
                        center: [marker.lng, marker.lat],
                        zoom: 7,
                        duration: 2000,
                        essential: true
                    });

                    setSelectedMarker({
                        visible: true,
                        id: marker._id || ''
                    });
                });
            });
        });


        map.current?.on('error', (e) => {
            console.error('Mapbox error:', e);
        });

        return () => {
            // Cleanup markers on unmount
            Object.values(markersRef.current).forEach(marker => marker.remove());
        };
        // }, [dataAlumni?.data]);
    }, [dataAlumni?.data]);

    useEffect(() => {
        if (map.current && coordinates.lng !== 0 && coordinates.lat !== 0 && id) {
            map.current.flyTo({
                center: [coordinates.lng, coordinates.lat],
                zoom: 13,
                duration: 2000,
                essential: true
            });

            const existingMarker = markersRef.current[id];
            if (existingMarker) {
                const el = existingMarker.getElement();
                el.style.zIndex = '1000';
                setTimeout(() => {
                    el.style.zIndex = '';
                }, 2000);
            }
        }
    }, [coordinates, id]);


    const handleCloseModal = () => {
        setSelectedMarker({
            visible: false,
            id: ''
        });
    };

    return (

        <div className="w-full h-full relative">
            <div ref={mapContainer} className={`w-full h-full`} />
            {hoverInfo.marker && (
                <HoverCard
                    isVisible={hoverInfo.visible}
                    position={hoverInfo.position}
                    markerData={hoverInfo.marker}
                />
            )}
            <SheetModal
                className="w-[60%] overflow-auto"
                isOpen={selectedmarker.visible}
                onOpenChange={handleCloseModal}
                title="Alumni Details"
                description="View details of the selected alumna."
                content={
                    (!alumniLoading && alumniFetched) &&
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
                                                            {onealumni?.data?.lastname}, {onealumni?.data?.firstname} {onealumni?.data?.middlename}
                                                            <span className="font-normal text-md lowercase flex items-center gap-2">
                                                                <Mail className="text-muted-foreground" size={18} /> {onealumni?.data?.email || 'No valid Email'}
                                                            </span>
                                                        </CardTitle>
                                                        <AlertDialogConfirmation
                                                            className="flex items-center gap-2"
                                                            type={`default`}
                                                            variant={'default'}
                                                            btnIcon={<Send className="text-primary-foreground" size={18} />}
                                                            btnTitle="Send Tracer Study"
                                                            title="Are you sure?"
                                                            description={`${onealumni?.data?.lastname}, ${onealumni?.data?.firstname} ${onealumni?.data?.middlename} will be mark as a dicontinuing student, and its courses this semester will be mark as drop.`}
                                                            btnContinue={handleCloseModal}
                                                        />
                                                    </div>

                                                    <CardDescription className="mt-2 flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Badge variant="default" className="mr-2">
                                                                {onealumni?.data?.idNumber || 'No valid ID Number'}
                                                            </Badge>
                                                            {
                                                                onealumni?.data?.idNumber &&
                                                                <span className="text-muted-foreground uppercase">
                                                                    {onealumni?.data?.department} | {onealumni?.data?.programCode} | {onealumni?.data?.programName}
                                                                </span>
                                                            }

                                                        </div>
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        {
                                            onealumni?.data?.idNumber &&
                                            <CardContent className="space-y-4">
                                                <div className="w-full mx-auto">
                                                    <CardHeader className="px-0">
                                                        <CardTitle className="text-xl">
                                                            Bachelor's Degree Information
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-wrap gap-4 px-0">
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                College/University
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.undergraduateInformation?.college || 'None'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                School
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.undergraduateInformation?.school || 'None'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                Program
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.undergraduateInformation?.programGraduated || 'None'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                Year Graduated
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.undergraduateInformation?.yearGraduated || 'None'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                Honors/Awards Received
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.achievements?.awards || 'None'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                Professional Exam Passed
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.achievements?.examPassed || 'None'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                Professional Exam Date
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.achievements?.examDate || 'None'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                            <span className="text-md font-semibold">
                                                                Professional Exam Rating
                                                            </span>
                                                            <span className="text-md font-normal">
                                                                {onealumni?.data?.achievements?.examRating ? `${onealumni?.data?.achievements?.examRating}%` : 'None'}
                                                            </span>
                                                        </div>

                                                    </CardContent>
                                                </div>
                                            </CardContent>
                                        }
                                    </Card>
                                    {
                                        (onealumni?.data?.generalInformation || onealumni?.data?.employmentData) &&
                                        <>
                                            <Card className="w-full mx-auto">
                                                <CardHeader>
                                                    <CardTitle className="text-xl font-bold flex flex-col">
                                                        Alumni Information
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="">
                                                    <div className="w-full mx-auto">
                                                        <CardHeader className="px-0 py-0">
                                                            <CardTitle className="text-xl">
                                                                General Information
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="flex flex-wrap gap-4 px-0">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead className="w-[50px]">ID</TableHead>
                                                                        <TableHead className="w-1/3">Question</TableHead>
                                                                        <TableHead>Answer</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {
                                                                        onealumni?.data?.generalInformation?.questions?.map((item: { question: string, answer: string | Record<string, any> }, index: number) => (
                                                                            <TableRow key={index} className="print:break-inside-avoid">
                                                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                                                <TableCell>{formatQuestion(item.question)}</TableCell>
                                                                                <TableCell>{formatAnswer(item.answer)}</TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                            {/* {
                                                                onealumni?.data?.generalInformation?.questions?.map((item: { question: string, answer: string | Record<string, any> }) => (
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-normal">
                                                                            {item?.question}
                                                                        </span>
                                                                        <span className="text-md font-medium">
                                                                            {formatAnswer(item.answer)}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            } */}
                                                        </CardContent>
                                                    </div>
                                                    <div className="w-full mx-auto">
                                                        <CardHeader className="px-0 py-0">
                                                            <CardTitle className="text-xl">
                                                                Employment Data
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="flex flex-wrap gap-4 px-0">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead className="w-[50px]">ID</TableHead>
                                                                        <TableHead className="w-1/3">Question</TableHead>
                                                                        <TableHead>Answer</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {
                                                                        onealumni?.data?.employmentData?.questions?.map((item: { question: string, answer: string | Record<string, any> }, index: number) => (
                                                                            <TableRow key={index} className="print:break-inside-avoid">
                                                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                                                <TableCell>{formatQuestion(item.question)}</TableCell>
                                                                                <TableCell>{formatAnswer(item.answer)}</TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                            {/* {
                                                                onealumni?.data?.employmentData?.questions?.map((item: { question: string, answer: string | Record<string, any> }) => (
                                                                    <div className="flex flex-col basis-[calc(50%-0.5rem)]">
                                                                        <span className="text-md font-normal">
                                                                            {item?.question}
                                                                        </span>
                                                                        <span className="text-md font-medium">
                                                                            {formatAnswer(item.answer)}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            } */}
                                                        </CardContent>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </>
                                    }
                                    {
                                        onealumni?.data?.idNumber &&
                                        <Card className="w-full mx-auto">
                                            <CardHeader>
                                                <div className="w-full flex flex-col items-start gap-2">
                                                    <div className="w-full flex items-center justify-between">
                                                        <h1 className="text-xl font-semibold">
                                                            {onealumni?.data?.programName}
                                                        </h1>
                                                    </div>

                                                    <div className="w-full flex items-center justify-between">
                                                        <h1 className="text-lg font-medium flex items-center gap-2">
                                                            Courses:
                                                        </h1>
                                                        <div className="flex items-center">
                                                            <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                            <span>Credits: {onealumni?.data?.totalOfUnitsEarned} / {onealumni?.data?.totalOfUnitsEnrolled}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex flex-col">
                                                    <Table className="w-full ">
                                                        <TableHeader>
                                                            <TableRow className="border-b">
                                                                <TableHead className="text-left font-normal pb-2">Course No.</TableHead>
                                                                <TableHead className="text-left font-medium pb-2">Descriptive Title</TableHead>
                                                                <TableHead className="text-left font-medium pb-2">Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {onealumni?.data?.enrolledCourses?.map((item: { courseno: string, descriptiveTitle: string, status: string }, i: number) => (
                                                                <TableRow key={i} className="border-b last:border-0">
                                                                    <TableCell className="py-2">
                                                                        <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                            <GraduationCap size={18} className="h-5 w-5 text-muted-foreground" />
                                                                            {item.courseno}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="py-2">
                                                                        <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                            {item.descriptiveTitle}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="py-2 text-left text-medium">
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
                                                                                item.status === 'inc' &&
                                                                                <div className="flex items-center gap-2">
                                                                                    <CircleX className="text-primary" size={18} />
                                                                                    INCOMPLETE
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
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    }
                                </div>
                            </main>
                        </div>
                    </div>
                }
            />
        </div>
    )
}