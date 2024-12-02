import React from "react";
import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleDashed, CircleX, Loader, Mail } from "lucide-react"
import { BookOpen, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ICourses } from "@/interface/student.interface";

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
}

const AlumniPrintableComponent = React.forwardRef<HTMLDivElement, PrintableComponentProps>((props, ref) => {
    return (
        <div ref={ref} className="w-full hidden flex-col min-h-screen items-center print:flex">
            <div className="w-full max-w-[90rem] flex flex-col">
                <main className="flex justify-center items-center py-4">
                    <div className="min-h-screen w-full max-w-[70rem] flex flex-col gap-4">
                        <Card className="w-full mx-auto border-none shadow-none">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="w-full flex flex-col">
                                        <div className="w-full flex items-center justify-between">
                                            <CardTitle className="uppercase text-3xl font-bold flex flex-col">
                                                {props.lastname}, {props.firstname} {props.middlename}
                                                <span className="font-normal text-md lowercase flex items-center gap-2">
                                                    <Mail className="text-muted-foreground" size={18} /> {props.email || 'No valid Email'}
                                                </span>
                                            </CardTitle>
                                        </div>

                                        <CardDescription className="mt-2 flex flex-col gap-2">
                                            <div className="flex items-center">
                                                <Badge variant="default" className="mr-2">
                                                    {props.idNumber || 'No valid ID Number'}
                                                </Badge>
                                                <span className="text-muted-foreground uppercase">
                                                    {props.department === 'SEAIT' && "Eng'g, Dev't. Arts & Design, LIS & IT"}
                                                    {props.department === 'SHANS' && "Science and Mathematics"}
                                                    {props.department === 'STEH' && "Business and Accountancy"}
                                                    {props.department === 'SAB' && "Teacher Education and Humanities"}  | {props.programCode} | {props.programName}
                                                </span>
                                            </div>
                                        </CardDescription>
                                    </div>
                                    {/* <Button>Apply Now</Button> */}
                                </div>
                            </CardHeader>
                        </Card>
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
                                                                    Passed
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
                                                                    Incomplete
                                                                </div>
                                                            }
                                                            {
                                                                item.status === 'discontinue' &&
                                                                <div className="flex items-center gap-2">
                                                                    <CircleX className="text-primary" size={18} />
                                                                    Discontinued
                                                                </div>
                                                            }
                                                            {
                                                                item.status === 'drop' &&
                                                                <div className="flex items-center gap-2">
                                                                    <CircleX className="text-primary" size={18} />
                                                                    Dropped
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
                    </div>
                </main>
            </div>
        </div>
    );
});

export default AlumniPrintableComponent;
