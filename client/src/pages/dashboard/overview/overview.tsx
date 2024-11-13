import HeadSection, { SubHeadSectionDetails } from "@/components/head-section";
import './index.css'
import { Combobox } from "@/components/combobox";
import { Filter, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_PROGRAM_FINDALL } from "@/api/program";
import { API_STUDENT_YEARS_GRADUATED } from "@/api/student";
import { TimeToLandJobAnalytics } from "@/components/charts/time-to-land-job-analytics";
import { CourseRelatedToJobAnalytics } from "@/components/charts/course-related-job";
import { API_ANALYTICS_EMPLOYMENT } from "@/api/analytics";

export default function Overview() {
    const [program, setProgram] = useState<string>('')
    const [yearGraduated, setYearGraduated] = useState<string>('')
    const [department, setDepartment] = useState<string>('')
    const [filteredPrograms, setFilteredPrograms] = useState<{ label: string, value: string }[]>([])
    const [filteredYearsGraduated, setFilteredYearsGraduated] = useState<{ label: string, value: string }[]>([])

    const { data: programs, isLoading: programsLoading, isFetched: programsFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    const { data: yearsGraduations, isLoading: yearsgraduateLoading, isFetched: yearsgraduatedFetched } = useQuery({
        queryFn: () => API_STUDENT_YEARS_GRADUATED(),
        queryKey: ['years']
    })

    const department_options = [
        { value: 'SEAIT', label: "Eng'g, Dev't. Arts & Design, Library Science & IT" },
        { value: 'SHANS', label: "Science and Mathematics" },
        { value: 'SAB', label: "Business and Accountancy" },
        { value: 'STEH', label: "Teacher Education and Humanities" }
    ]

    const { data: tracerresponse, isLoading: tracerresponseLoading, isFetched: tracerresponseFetched } = useQuery({
        queryFn: () => API_ANALYTICS_EMPLOYMENT({ department, program, academicYear: yearGraduated }),
        queryKey: ['analytics', { department, program, academicYear: yearGraduated }]
    })

    useEffect(() => {
        if (tracerresponseFetched) { console.log(tracerresponse?.data[0]) }
    }, [tracerresponse])

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

    const isLoading = programsLoading || yearsgraduateLoading || tracerresponseLoading

    return (
        <div className="w-full flex flex-col min-h-screen items-center">
            <main className="w-full max-w-[90rem] flex flex-col">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title=" Overview"
                            description="A dashboard providing analytics and insights into alumni data, and trends."
                        />
                    </HeadSection>
                </aside>
                <div className="py-4 px-8 flex flex-col">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold">
                                    Employment Rate
                                </h1>
                                {
                                    isLoading &&
                                    <div className="flex items-center gap-2">
                                        <LoaderCircle className={`text-muted-foreground animate-spin`} size={18} />
                                        <h1 className="text-muted-foreground text-sm">
                                            Syncing
                                        </h1>
                                    </div>
                                }
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Combobox
                                    btnTitleclassName="gap-2"
                                    icon={<Filter className="text-primary" size={15} />}
                                    className='w-[200px]'
                                    lists={department_options || []}
                                    placeholder={`Department`}
                                    setValue={(item) => setDepartment(item)}
                                    value={department || ''}
                                />

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

                        <div className="flex flex-col gap-2">
                            {
                                (!tracerresponseLoading && tracerresponseFetched) && (
                                    <TimeToLandJobAnalytics
                                        data={tracerresponse?.data[0]?.analytics?.timeToLandJob?.data || []} />
                                )
                            }

                            {
                                (!tracerresponseLoading && tracerresponseFetched) && (
                                    <CourseRelatedToJobAnalytics data={tracerresponse?.data[0]?.analytics?.courseRelatedJob?.data || []} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}