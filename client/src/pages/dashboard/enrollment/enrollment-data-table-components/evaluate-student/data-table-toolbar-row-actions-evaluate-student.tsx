// EvaluateStudentCell.tsx
import { useEffect, useState } from "react"
import { Combobox } from "@/components/combobox"
import { Row } from "@tanstack/react-table"
import { IAPICourse } from "@/interface/course.interface"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    evaluation: string
    onEvaluationChange: (id: string, evaluationStatus: string) => void
}

export function DataTableRowActionsEvaluateStudent<TData>({
    row,
    evaluation,
    onEvaluationChange
}: DataTableRowActionsProps<TData>) {
    const id = (row.original as IAPICourse)?._id || ''
    const ispass = (row.original as IAPICourse)?.ispass
    const [status, setStatus] = useState<string>(evaluation || ispass || "")

    useEffect(() => {
        // Only set status if either `evaluation` or `ispass` change and are defined
        if (evaluation !== undefined || ispass !== undefined) {
            setStatus(evaluation || ispass || ""); // Use evaluation first, fallback to ispass
        }
    }, [evaluation, ispass]); 

    const options = [
        { label: "Pass", value: "pass" },
        { label: "Fail", value: "fail" },
        { label: "INC", value: "inc" },
        { label: "Drop", value: "drop" },
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
