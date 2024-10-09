import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { ROUTES } from '@/constants'
import { DataTableForm } from './data-table-form/data-table-form'
import { FormColumns } from './data-table-form/columns-student-form'
import { useQuery } from '@tanstack/react-query'
import { API_FORM_FINDALL_UNKNOWN } from '@/api/form'

export default function Form() {
    const { data: dataForm, isLoading: isformLoading, isFetched: formFetched } = useQuery({
        queryFn: () => API_FORM_FINDALL_UNKNOWN(),
        queryKey: ['forms']
    })

    if (formFetched) { console.log(dataForm.data) }

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="UNKNOWN RESPONDENTS"
                                description="Here's a list of unnknown respondents from the alumni graduates."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Unknown Respondents" link={ROUTES.GOOGLE_FORM} />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable>
                            {isformLoading && <div>Loading...</div>}
                            {formFetched && <DataTableForm columns={FormColumns} data={dataForm.data} />}
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}
