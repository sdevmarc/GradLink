import MainTable from "@/components/main-table"
import HeadSection, { SubHeadSectionDetails } from "@/components/head-section"
import { Sidebar, SidebarNavs } from "@/components/sidebar"
import { ROUTES } from "@/constants"
import { DataTableCoursesOfferedInEnrollment } from "./enrollment-data-table-components/courses-offered/data-table-courses-offered-in-enrollment"
import { CoursesOfferedInEnrollmentColumns } from "./enrollment-data-table-components/courses-offered/columns-courses-offered-in-enrollment"
import { useQuery } from "@tanstack/react-query"
import { API_COURSE_FINDALL_COURSES_OFFERED } from "@/api/courses"
import { useState } from "react"

export default function Enrollment() {
    const [isenroll, setEnroll] = useState<boolean>(false);

    const toggleEnroll = () => {
        setEnroll((prev) => !prev);
        console.log("Enroll mode toggled:", !isenroll); // Check the toggling
    };

    const { data: courses, isLoading: coursesLoading, isFetched: coursesFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL_COURSES_OFFERED(),
        queryKey: ['courses-offered']
    })

    return (
        <div className="flex flex-col min-h-screen items-center">
            <div className="w-full max-w-[90rem] flex flex-col">
                <aside className="px-4 pb-4 pt-[8rem]">
                    <HeadSection>
                        <SubHeadSectionDetails
                            title="COURSES OFFERED"
                            description="Here's a list of currently offered courses."
                        />
                    </HeadSection>
                </aside>
                <main className="flex">
                    <Sidebar>
                        <SidebarNavs bg='bg-muted' title="Courses Offered" link={ROUTES.ENROLLMENT} />
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