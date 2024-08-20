import MainTable from "@/components/MainTable"
import Header_Dashboard from "@/components/header/Header_Dashboard"
import HeadSection from "@/components/HeadSection"
import { Sidebar, SidebarNavs } from "@/components/Sidebar"
import { DataTable } from "@/components/data-table-components/data-table"
import { columns } from "@/components/data-table-components/columns"
import { useState } from "react"
import expense from '@/components/data-table-components/data.json'
import { Expense } from "@/components/data-table-components/schema"

export default function Student() {
    const modifiedExpense = expense.map(item => ({ id: generateId(), ...item, type: item.type as "income" | "expense" }));
    const [data, setData] = useState<Expense[]>(modifiedExpense)

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[3.2rem]">
                        <HeadSection
                            title="RECORD OF ENROLLED STUDENTS"
                            description="Here's a list of enrolled students."
                        />
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Table" link="/student" />
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