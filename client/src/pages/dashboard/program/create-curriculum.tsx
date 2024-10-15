import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import MainTable from '@/components/main-table'
import { ROUTES } from '@/constants'
import { IAPIPrograms } from '@/interface/program.interface'
import { useState } from 'react'
import { DataTableCreateProgramInCurriculum } from './program-data-table-components/curriculum/create-curriculum/data-table-create-program-in-curriculum'
import { CreateProgramInCurriculumColumns } from './program-data-table-components/curriculum/create-curriculum/columns-create-program-in-curriculum'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CreateCurriculum() {
    const [programs, setPrograms] = useState<IAPIPrograms[]>([])
    const [hascurriculum, setCurriculum] = useState<string>('')
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="NEW CURRICULUM"
                                description="A page for creating a new curriculum."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs bg='bg-muted' title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            <div className="flex flex-col border gap-4 rounded-md px-4">
                                <div className="w-full py-3 border-b">
                                    <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <h1 className='text-[.83rem]'>Curriculum Name</h1>
                                        <Input
                                            value={hascurriculum}
                                            type='text'
                                            placeholder='eg. New Curriculum 2020'
                                            onChange={(e) => setCurriculum(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <DataTableCreateProgramInCurriculum columns={CreateProgramInCurriculumColumns} data={programs || []} fetchAddedPrograms={(e) => setPrograms(e)} />
                                </div>
                                <Button variant={`default`} size={`sm`} className='my-3 py-5'>
                                    Create New Curriculum
                                </Button>
                            </div>


                        </MainTable>
                    </main>
                </div>
            </div >
        </>
    )
}