// EvaluateStudentCell.tsx
import { useState } from "react"
import { Combobox } from "@/components/combobox"
import { Row } from "@tanstack/react-table"
import { IAPICourse } from "@/interface/course.interface"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    evaluation: string
    onEvaluationChange: (id: string, evaluationStatus: string) => void
    status?: string
}

export function DataTableRowActionsEvaluateStudent<TData>({
    row,
    evaluation,
    onEvaluationChange
}: DataTableRowActionsProps<TData>) {
    const id = (row.original as IAPICourse)?._id || ''
    const [status, setStatus] = useState<string>(evaluation); // Track actual evaluation value

    const options = [
        { label: "Pass", value: "pass" },
        { label: "Fail", value: "fail" },
        { label: "INC", value: "inc" },
        { label: "Drop", value: "drop" },
        { label: "Discontinue", value: "discontinue" },
    ];

    const handleSetEvaluation = (item: string) => {
        setStatus(item);
        onEvaluationChange(id, item);
    };

    return (
        <Combobox
            className="w-[150px]"
            lists={options}
            placeholder="None"
            setValue={handleSetEvaluation}
            value={status}
        />
    )
}
