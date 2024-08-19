import { columns } from "@/components/data-table-components/Columns"
import { DataTable } from "@/components/data-table-components/data-table"
import { useState } from "react"
import expense from '@/components/data-table-components/data.json'
import { Expense } from "./data-table-components/schema"

export default function MainTable() {
    const modifiedExpense = expense.map(item => ({ id: generateId(), ...item, type: item.type as "income" | "expense" }));
    const [data, setData] = useState<Expense[]>(modifiedExpense)

    return (
        <>
            <div className="w-[80%] h-full flex flex-col justify-between">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}

function generateId() {
    return '1';
}