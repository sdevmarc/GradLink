import { Input } from "@/components/ui/input";
import { ComboBox } from '../combo-box';
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function FormTableToolbar() {
    const navigate = useNavigate()

    const handleAddNew = () => {
        navigate('/form/create-form')
    }
    return (
        <>
            <div className="flex flex-wrap items-center justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Input
                        placeholder="Filter labels..."
                        className="h-8 w-[150px] lg:w-[250px] placeholder:text-muted"
                    />
                    <ComboBox
                        title="Filter"
                    />
                </div>
                <Button
                    onClick={handleAddNew}
                    variant="outline"
                    className="h-8 px-2 lg:px-3 justify-between"
                >
                    Add New
                    {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                </Button>
            </div>
        </>
    )
}
