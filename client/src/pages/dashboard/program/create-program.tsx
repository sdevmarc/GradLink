import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { ROUTES } from '@/constants'
import MainTable from '@/components/main-table'
import { CreateProgramColumns } from './program-data-table-components/program/create-program/columns-create-program'
import { DataTableCreateProgram } from './program-data-table-components/program/create-program/data-table-create-program'
import { useState } from 'react'
import { IAPIPrograms } from '@/interface/program.interface'

export default function CreateProgram() {
    const [programs, setPrograms] = useState<IAPIPrograms[]>([])
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE A PROGRAM"
                                description="A tool for creating new program."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            <div className="flex flex-col border gap-4 rounded-md">
                                <div className="w-full px-4 py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                </div>
                                <div className="px-4">
                                    <DataTableCreateProgram columns={CreateProgramColumns} data={programs || []} fetchAddedPrograms={(e) => setPrograms(e)} />
                                </div>
                            </div>
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}