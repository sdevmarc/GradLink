import React from "react";
import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleDashed, CircleX, Loader } from "lucide-react"
import { BookOpen, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ICourses, MappedSection } from "@/interface/student.interface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PrintableComponentProps {
    // children: React.ReactNode;
    lastname: string;
    firstname: string;
    middlename: string;
    email: string
    idNumber: string
    department: string
    programCode: string
    programName: string
    totalOfUnitsEarned: number
    totalOfUnitsEnrolled: number
    enrolledCourses: ICourses[]
    generalInformation: MappedSection
    employmentData: MappedSection
}

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

const AlumniPrintableComponent = React.forwardRef<HTMLDivElement, PrintableComponentProps>((props, ref) => {
    return (
        <div ref={ref} className="hidden flex-col min-h-screen items-center print:flex">
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
                                                    {props.lastname}, {props.firstname} {props.middlename}

                                                </div>
                                            </CardTitle>
                                        </div>

                                        <CardDescription className="mt-2 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Badge variant="default" className="mr-2">
                                                    {props.idNumber || 'No valid ID Number'}
                                                </Badge>
                                                {
                                                    props.idNumber &&
                                                    <span className="text-muted-foreground uppercase">
                                                        {props.department === 'SEAIT' && "Eng'g, Dev't. Arts & Design, LIS & IT"}
                                                        {props.department === 'SHANS' && "Science and Mathematics"}
                                                        {props.department === 'STEH' && "Business and Accountancy"}
                                                        {props.department === 'SAB' && "Teacher Education and Humanities"}  | {props.programCode} | {props.programName}
                                                    </span>
                                                }
                                            </div>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                        {
                            (props.generalInformation.questions.length > 0 || props.employmentData.questions.length > 0) &&
                            <>
                                <Card className="w-full mx-auto border-none shadow-none">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold flex flex-col uppercase">
                                            Alumni Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="">
                                        <div className="w-full mx-auto">
                                            <CardTitle className="text-xl font-normal">
                                                General Information
                                            </CardTitle>
                                            <CardContent className="flex flex-wrap gap-2 px-0">
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
                                                            props.generalInformation?.questions?.map((item, index) => (
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
                                            <CardTitle className="text-xl font-normal">
                                                Employment Data
                                            </CardTitle>
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
                                                            props.employmentData?.questions?.map((item, index) => (
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
                        {
                            props.idNumber &&
                            <Card className="w-full mx-auto border-none shadow-none">
                                <CardHeader>
                                    <div className="w-full flex flex-col items-start gap-2">
                                        <div className="w-full flex items-center justify-between">
                                            <h1 className="text-xl font-semibold">
                                                {props.programName}
                                            </h1>
                                        </div>

                                        <div className="w-full flex items-center justify-between">
                                            <h1 className="text-lg font-medium flex items-center gap-2">
                                                Courses:
                                            </h1>
                                            <div className="flex items-center">
                                                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                                                <span>Credits: {props.totalOfUnitsEarned} / {props.totalOfUnitsEnrolled}</span>
                                            </div>
                                        </div>

                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col">
                                        <table className="w-full ">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left font-normal pb-2">Course No.</th>
                                                    <th className="text-left font-medium pb-2">Descriptive Title</th>
                                                    <th className="text-left font-medium pb-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.enrolledCourses?.map((item, i) => (
                                                    <tr key={i} className="border-b last:border-0">
                                                        <td className="py-2">
                                                            <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                <GraduationCap size={18} className="h-5 w-5 text-muted-foreground" />
                                                                {item.courseno}
                                                            </span>
                                                        </td>
                                                        <td className="py-2">
                                                            <span className="capitalize text-sm font-normal flex items-center gap-2">
                                                                {item.descriptiveTitle}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 text-left text-medium">
                                                            <span className="text-sm font-normal flex items-center gap-2 capitalize ">
                                                                {
                                                                    item.status === 'ongoing' &&
                                                                    <div className="flex items-center gap-2">
                                                                        <Loader className="text-primary" size={18} />
                                                                        Ongoing
                                                                    </div>
                                                                }
                                                                {
                                                                    item.status === 'pass' &&
                                                                    <div className="flex items-center gap-2">
                                                                        <CircleCheck className="text-primary" size={18} />
                                                                        PASSED
                                                                    </div>
                                                                }
                                                                {
                                                                    item.status === 'fail' &&
                                                                    <div className="flex items-center gap-2">
                                                                        <CircleX className="text-primary" size={18} />
                                                                        Failed
                                                                    </div>
                                                                }
                                                                {
                                                                    item.status === 'inc' &&
                                                                    <div className="flex items-center gap-2">
                                                                        <CircleX className="text-primary" size={18} />
                                                                        INCOMPLETE
                                                                    </div>
                                                                }
                                                                {
                                                                    item.status === 'not_taken' &&
                                                                    <div className="flex items-center gap-2">
                                                                        <CircleDashed className="text-primary" size={18} />
                                                                        Not taken yet
                                                                    </div>
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        }
                    </div>
                </main>
            </div>
        </div>
    );
});

export default AlumniPrintableComponent;
