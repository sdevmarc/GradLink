"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/data-table-components/data-table-column-header";
import { Check, CircleCheck, GraduationCap, Mail, TableOfContents, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SheetModal } from "@/components/sheet-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialogConfirmation } from "@/components/alert-dialog";
import { IAPIForms } from "@/interface/forms.interface";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_FORM_EVALUATE_TRACER } from "@/api/form";

const formatAnswer = (answer: string | Record<string, any> | null | undefined): React.ReactNode => {
    if (typeof answer === 'object' && answer !== null) {
        return (
            <ul className="list-disc pl-4 mt-2">
                {Object.entries(answer).map(([key, value], index) => (
                    <li key={index} className="text-sm">
                        {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                    </li>
                ))}
            </ul>
        );
    }
    return answer || 'None';
};

const formatQuestion = (question: string): string => {
    // Remove pattern like "1. ", "12. ", etc.
    return question.replace(/^\d+\.\s*/, '');
};

export const AlumniGoogleFormColumns: ColumnDef<IAPIForms>[] = [
    {
        id: "icon",
        cell: () => {
            return (
                <div className="w-0">
                    <GraduationCap className="text-primary" />
                </div>
            )

        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" className="text-primary flex items-center justify-start" />
        ),
        cell: ({ row }) => {
            console.log('The row: ', row)
            return (
                <div className="flex justify-start items-center capitalize gap-4 ">
                    <Badge variant={`default`}>
                        {row.getValue("email")}
                    </Badge>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const queryClient = useQueryClient()
            const [isOpen, setIsOpen] = useState<boolean>(false)
            const [dialogapprove, setDialofApprove] = useState<boolean>(false)
            const [dialogdecline, setDialogDecline] = useState<boolean>(false)
            const [alertdialogstate, setAlertDialogState] = useState({
                show: false,
                title: '',
                description: '',
                success: false
            })

            const {
                _id,
                email,
                generalInformation,
                employmentData,
            } = row.original

            const { mutateAsync: evaluateForm, isPending: evaluateFormPending } = useMutation({
                mutationFn: API_FORM_EVALUATE_TRACER,
                onSuccess: async (data) => {
                    if (!data.success) {
                        setDialofApprove(false)
                        setDialogDecline(false)
                        await queryClient.invalidateQueries({ queryKey: ['formstracer'] })
                        await queryClient.refetchQueries({ queryKey: ['formstracer'] })
                        setAlertDialogState({ success: false, show: true, title: "Yay, success! 🎉", description: data.message })
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        return
                    } else {
                        await queryClient.invalidateQueries({ queryKey: ['formstracer'] })
                        await queryClient.refetchQueries({ queryKey: ['formstracer'] })
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                        setDialofApprove(false)
                        setDialogDecline(false)
                        setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                        return
                    }
                },
                onError: (data) => {
                    setDialofApprove(false)
                    setDialogDecline(false)
                    setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
                }
            })


            const handleViewDetails = () => {
                setIsOpen(true)
            }

            const handleOpenChange = (open: boolean) => {
                setIsOpen(open)
            }

            const handleApprove = async () => {
                await evaluateForm({ id: _id, isApproved: true })
            }

            const handleDecline = async () => {
                await evaluateForm({ id: _id, isApproved: false })
            }

            const isLoading = evaluateFormPending

            return (
                <>
                    <AlertDialogConfirmation
                        btnTitle='Continue'
                        className='w-full py-4'
                        disabled={isLoading}
                        isDialog={alertdialogstate.show}
                        setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                        type={`alert`}
                        title={alertdialogstate.title}
                        description={alertdialogstate.description}
                        icon={<CircleCheck color="#42a626" size={70} />}
                        variant={`default`}
                        btnContinue={() => {
                            setAlertDialogState(prev => ({ ...prev, show: false }))

                        }}
                    />
                    <div className="flex justify-end items-center gap-2">
                        <AlertDialogConfirmation
                            isDialog={dialogapprove}
                            setDialog={(open) => setDialofApprove(open)}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                            type={`default`}
                            variant={'default'}
                            btnIcon={<Check className="text-primary-foreground" size={18} />}
                            btnTitle="Approve"
                            title="Are you sure?"
                            description={`This will save the information in the database.`}
                            btnContinue={handleApprove}
                        />
                        <AlertDialogConfirmation
                            isDialog={dialogdecline}
                            setDialog={(open) => setDialogDecline(open)}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                            type={`default`}
                            variant={'destructive'}
                            btnIcon={<X className="text-white" size={18} />}
                            btnTitle="Decline"
                            title="Are you sure?"
                            description={`This will decline the respondents answer and will be move to trash.`}
                            btnContinue={handleDecline}
                        />
                        <Button onClick={handleViewDetails} variant={`outline`} size={`sm`} className="flex items-center gap-4">
                            <TableOfContents className="text-primary" size={18} />  View Tracer
                        </Button>
                        <SheetModal
                            className="w-[60%] overflow-auto"
                            isOpen={isOpen}
                            onOpenChange={handleOpenChange}
                            title="Respondent"
                            description="View details of one of the respondents."
                            content={
                                <div className="flex flex-col min-h-screen items-center">
                                    <div className="w-full max-w-[90rem] flex flex-col">
                                        <main className="flex justify-center items-center py-4">
                                            <div className="min-h-screen w-full max-w-[70rem] flex flex-col gap-4">
                                                <Card className="w-full mx-auto border-none shadow-none">
                                                    <CardHeader>
                                                        <div className="flex justify-between items-start">
                                                            <div className="w-full flex flex-col">
                                                                <div className="w-full flex items-center justify-between">
                                                                    <CardTitle className="uppercase text-3xl font-bold flex flex-col gap-2">
                                                                        <div className="flex items-center gap-4">
                                                                            <Mail className="text-muted-foreground" size={18} /> {email || 'No valid Email'}
                                                                        </div>
                                                                    </CardTitle>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                </Card>
                                                {
                                                    ((generalInformation?.questions?.length ?? 0) > 0 || (employmentData?.questions?.length ?? 0) > 0) &&
                                                    <>
                                                        <Card className="w-full mx-auto">
                                                            <CardHeader>
                                                                <CardTitle className="text-xl font-bold flex flex-col uppercase">
                                                                    Alumni Information
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="">
                                                                <div className="w-full mx-auto">
                                                                    <CardHeader className="px-0 py-0">
                                                                        <CardTitle className="text-xl font-normal">
                                                                            General Information
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="flex flex-wrap gap-4 px-0">
                                                                        <Table>
                                                                            <TableHeader>
                                                                                <TableRow>
                                                                                    <TableHead className="w-[100px]">ID</TableHead>
                                                                                    <TableHead className="w-1/3">Question</TableHead>
                                                                                    <TableHead>Answer</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {
                                                                                    generalInformation?.questions?.map((item, index) => (
                                                                                        <TableRow key={index} className="print:break-inside-avoid">
                                                                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                                                                            <TableCell>{formatQuestion(item.question)}</TableCell>
                                                                                            <TableCell>{formatAnswer(item.answer)}</TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                }
                                                                            </TableBody>
                                                                        </Table>
                                                                    </CardContent>
                                                                </div>
                                                                <div className="w-full mx-auto">
                                                                    <CardHeader className="px-0 py-0">
                                                                        <CardTitle className="text-xl font-normal">
                                                                            Employment Data
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent className="flex flex-wrap gap-4 px-0">
                                                                        <Table>
                                                                            <TableHeader>
                                                                                <TableRow>
                                                                                    <TableHead className="w-[100px]">ID</TableHead>
                                                                                    <TableHead className="w-1/3">Question</TableHead>
                                                                                    <TableHead>Answer</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {
                                                                                    employmentData?.questions?.map((item, index) => (
                                                                                        <TableRow key={index} className="print:break-inside-avoid">
                                                                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                                                                            <TableCell>{formatQuestion(item.question)}</TableCell>
                                                                                            <TableCell>{formatAnswer(item.answer)}</TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                }
                                                                            </TableBody>
                                                                        </Table>
                                                                    </CardContent>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </>
                                                }

                                            </div>
                                        </main>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </>
            )
        }
    }
]