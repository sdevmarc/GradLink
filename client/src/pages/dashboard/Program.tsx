import { DataTable } from '@/components/data-table-components/data-table'
import Header_Dashboard from '@/components/header/Header_Dashboard'
import HeadSection from '@/components/HeadSection'
import MainTable from '@/components/MainTable'
import { SidebarNavs, Sidebar } from '@/components/Sidebar'
import { columns } from "@/components/data-table-components/columns"
import { useState } from "react"
import expense from '@/components/data-table-components/data.json'
import { Expense } from "@/components/data-table-components/schema"

export default function Program() {
    const modifiedExpense = expense.map(item => ({ id: generateId(), ...item, type: item.type as "income" | "expense" }));
    const [data, setData] = useState<Expense[]>(modifiedExpense)

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[3.2rem]">
                        <HeadSection
                            title="RECORD OF REGISTERED PROGRAMS"
                            description="Here's a list of registered programs."
                        />
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Table" link="/program" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <MainTable>
                            <DataTable columns={columns} data={data} />
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