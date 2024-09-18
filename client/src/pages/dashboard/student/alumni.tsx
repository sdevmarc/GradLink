import { Expense } from '@/components/data-table-components/schema';
import HeadSection, { SubHeadSectionDetails } from '@/components/head-section';
import { SidebarNavs, Sidebar } from '@/components/sidebar'
import { columns } from "@/components/data-table-components/columns"
import { useState } from "react"
import expense from '@/components/data-table-components/data.json'
import MainTable from '@/components/main-table';
import { DataTable } from '@/components/data-table-components/data-table';

export default function Alumni() {
    const modifiedExpense = expense.map(item => ({ id: generateId(), ...item, type: item.type as "income" | "expense" }));
    const [data, setData] = useState<Expense[]>(modifiedExpense)

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <SubHeadSectionDetails
                                title="RECORD OF REGISTERED ALUMNI'S"
                                description="Here's a list of registered alumni's."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Registered Students" link="/student" />
                            <SidebarNavs bg='bg-muted' title="Alumni Graduates" link="/student/alumni" />
                        </Sidebar>
                        <MainTable>
                            <DataTable toolbar='alumni' columns={columns} data={data} />
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