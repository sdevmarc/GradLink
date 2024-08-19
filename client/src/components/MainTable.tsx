import { columns } from "@/components/table/Columns"
import { DataTable } from "@/components/table/DataTable"
import { Payment } from "@/interface/Table.type"
import { useEffect, useState } from "react"

async function getData(): Promise<Payment[]> {
    return Array.from({ length: 50 }, (_, i) => ({
        id: `728ed52f-${i}`,
        amount: 100,
        status: "pending",
        email: `m${i}@example.com`,
    }));
}

export default function MainTable() {
    const [data, setData] = useState<Payment[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const mydata = await getData()
            setData(mydata)
        }

        fetchData()
    }, [])

    return (
        <>
            <div className="w-[80%] h-full flex flex-col justify-between">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}