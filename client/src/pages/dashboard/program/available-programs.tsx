import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTableAvailablePrograms } from './program-data-table-components/program/available-programs/data-table-available-programs'
import { AvailableProgramsColumns } from './program-data-table-components/program/available-programs/columns-available-programs'
import { DataTableAvailableCourses } from './program-data-table-components/courses/available-courses/data-table-available-courses'
import { AvailableCoursesColumns } from './program-data-table-components/courses/available-courses/columns-available-courses'
import { DataTableCurriculum } from './program-data-table-components/curriculum/curriculum/data-table-curriculum'
import { CurriculumColumns } from './program-data-table-components/curriculum/curriculum/columns-curriculum'
import { useQuery } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'
import { API_PROGRAM_FINDALL } from '@/api/program'
import { API_CURRICULUM_FINDALL } from '@/api/curriculum'
import { AuthContext } from '@/hooks/AuthContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Program() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    const { data: course, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses']
    })

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    const { data: curriculum, isLoading: curriculumLoading, isFetched: curriculumFetched } = useQuery({
        queryFn: () => API_CURRICULUM_FINDALL(),
        queryKey: ['curriculums']
    })

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="Programs And Curriculum"
                                description="View and manage programs, courses, and curriculum."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex px-8">
                        <Tabs defaultValue="programs" className="w-full">
                            <TabsList className="bg-background">
                                <TabsTrigger value="programs">Programs</TabsTrigger>
                                <TabsTrigger value="courses">Courses</TabsTrigger>
                                <TabsTrigger value="curriculums">Curriculum</TabsTrigger>
                            </TabsList>
                            <TabsContent value="programs">
                                {programLoading && <div>Loading...</div>}
                                {
                                    (!programLoading && programFetched) &&
                                    <DataTableAvailablePrograms
                                        columns={AvailableProgramsColumns}
                                        data={program?.data || []}
                                    />
                                }
                            </TabsContent>
                            <TabsContent value="courses">
                                {courseLoading && <div>Loading...</div>}
                                {
                                    (!courseLoading && courseFetched) &&
                                    <DataTableAvailableCourses
                                        columns={AvailableCoursesColumns}
                                        data={course?.data || []}
                                    />
                                }
                            </TabsContent>
                            <TabsContent value="curriculums">
                                {curriculumLoading && <div>Loading...</div>}
                                {
                                    (!curriculumLoading && curriculumFetched) &&
                                    <DataTableCurriculum
                                        columns={CurriculumColumns}
                                        data={curriculum?.data || []}
                                    />
                                }
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </>
    )
}