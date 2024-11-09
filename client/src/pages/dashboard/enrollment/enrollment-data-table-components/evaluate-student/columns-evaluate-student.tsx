"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { IAPICourse } from '@/interface/course.interface'
import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header"
import { DataTableRowActionsEvaluateStudent } from "./data-table-toolbar-row-actions-evaluate-student"

interface Evaluation {
    id: string;
    ispass: string;
    file?: File | null;
    preview?: string | null;
}

export function EvaluateStudentColumns(
    handleEvaluationChange: (id: string, evaluationStatus: string) => void,
    evaluations: Evaluation[]
): ColumnDef<IAPICourse>[] {
    return [
        {
            accessorKey: "idNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID" className="text-text" />
            ),
            cell: ({ row }) => (
                <div className="w-[100px] capitalize">{row.getValue("idNumber")}</div>
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: "lastname",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Last Name" className="text-text" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[500px] truncate capitalize">
                            {row.getValue("lastname")}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "firstname",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="First Name" className="text-text" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[500px] truncate capitalize">
                            {row.getValue("firstname")}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "middlename",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Middle Name" className="text-text" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[500px] truncate capitalize">
                            {
                                row.getValue("middlename") ? row.getValue("middlename") : '[No Middlename]'
                            }
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" className="text-text" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[100px] truncate lowercase">
                            {row.getValue("email")}
                        </span>
                    </div>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const id = (row.original as IAPICourse)?._id || '';
                const evaluation = evaluations.find(evaluation => evaluation.id === id)?.ispass || '';

                return (
                    <DataTableRowActionsEvaluateStudent
                        row={row}
                        evaluation={evaluation}
                        onEvaluationChange={handleEvaluationChange}
                    />
                );
            }
        },
        // {
        //     id: "fileUpload",
        //     cell: ({ row }) => {
        //         const id = (row.original as IAPICourse)?._id || '';
        //         const evaluation = evaluations.find(evaluation => evaluation.id === id);

        //         const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        //             const selectedFile = event.target.files?.[0] || null;
        //             handleFileChange(id, selectedFile); // Send file to parent component
        //         };

        //         const removeFile = () => {
        //             handleFileChange(id, null); // Clear file in parent component
        //         };

        //         return evaluation && evaluation.status === "discontinue" ? (
        //             <div className="flex items-center space-x-4">
        //                 {!evaluation.file ? (
        //                     <>
        //                         <input
        //                             id={`file-input-${id}`}
        //                             type="file"
        //                             accept="image/*"
        //                             className="hidden"
        //                             onChange={handleFileInput}
        //                         />
        //                         <label
        //                             htmlFor={`file-input-${id}`}
        //                             className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none"
        //                         >
        //                             Upload Image
        //                         </label>
        //                     </>
        //                 ) : (
        //                     <div className="flex items-center space-x-2">
        //                         {evaluation.preview && (
        //                             <img
        //                                 src={evaluation.preview}
        //                                 alt="Preview"
        //                                 className="w-16 h-16 object-cover rounded-md border"
        //                             />
        //                         )}
        //                         <button
        //                             onClick={removeFile}
        //                             className="text-destructive text-sm hover:underline focus:outline-none"
        //                         >
        //                             Remove
        //                         </button>
        //                     </div>
        //                 )}
        //             </div>
        //         ) : null;
        //     }
        // }
    ];
}