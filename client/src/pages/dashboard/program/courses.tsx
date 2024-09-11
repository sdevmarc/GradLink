import { DataTable } from '@/components/data-table-components/data-table'
import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { SubHeadSectionDetails } from '@/components/head-section'
import MainTable from '@/components/main-table'
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { columns } from "@/components/data-table-components/columns"
import { useState } from "react"
import expense from '@/components/data-table-components/data.json'
import { Expense } from "@/components/data-table-components/schema"

export default function Courses() {
    const modifiedExpense = expense.map(item => ({ id: generateId(), ...item, type: item.type as "income" | "expense" }));
    const [data, setData] = useState<Expense[]>(modifiedExpense)

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[5rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="RECORD OF REGISTERED COURSES"
                                description="Here's a list of registered courses."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link="/program" />
                            <SidebarNavs bg='bg-muted' title="Courses" link="/program/courses" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable>
                            <DataTable columns={columns} data={data} toolbar='course' />
                        </MainTable>
                    </main>
                </div>
            </div>
        </>
    )
}

function generateId() {
    return '1';
}