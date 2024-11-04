import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { DataTableCoursesOfferedInEnrollment } from "./enrollment-data-table-components/courses-offered/data-table-courses-offered-in-enrollment"
import { CoursesOfferedInEnrollmentColumns } from "./enrollment-data-table-components/courses-offered/columns-courses-offered-in-enrollment"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { API_FINDALL_COURSES_OFFERED } from "@/api/offered"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import MainTable from "@/components/main-table"

export default function Enrollment() {
    const [isenroll, setEnroll] = useState<boolean>(true);

    const toggleEnroll = () => {
        setEnroll((prev) => !prev);
        console.log("Enroll mode toggled:", !isenroll); // Check the toggling
    };

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_FINDALL_COURSES_OFFERED(),
        queryKey: ['courses-offered']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title="COURSES OFFERED"
                            description={`Here's a list of offered courses ${courses?.data[0]?.semester === 1 ? 'for the First semester.' :
                                courses?.data[0]?.semester === 2 ? 'for the Second semester.' :
                                    courses?.data[0]?.semester === 3 ? 'for the Third semester.' :
                                        ''
                                }.`}
                        />
                    </HeadSection>
                </aside>
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs bg='bg-muted' title="Courses Offered" link={ROUTES.ENROLLMENT} />
                        <SidebarNavs title="Attrition Rate of Courses" link={ROUTES.ENROLLMENT_ATTRITION_RATE_COURSES} />
                        <SidebarNavs title="Attrition Rate of Programs" link={ROUTES.ENROLLMENT_ATTRITION_RATE_PROGRAMS} />
                    </Sidebar>
                    <MainTable>
                        {coursesLoading && <div>Loading...</div>}
                        {
                            (!coursesLoading && coursesFetched) &&
                            <DataTableCoursesOfferedInEnrollment
                                columns={CoursesOfferedInEnrollmentColumns(isenroll)}
                                data={courses?.data || []}
                                isenroll={isenroll}
                                setEnroll={toggleEnroll}
                            />
                        }
                    </MainTable>
                </main>
            </div>
        </div>
    )
}