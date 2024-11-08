"use client"

import HeadSection, { BackHeadSection } from '@/components/head-section'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

export default function StudentEvaluation() {
    const [isdropout, setDropout] = useState<boolean>(false)
    const student = {
        name: "Snoop Dogg",
        id: "ST12345",
        program: "Computer Science",
        year: 2,
        courses: [
            { name: "Introduction to Algorithms", grade: 85, credits: 3, status: "Pass" },
            { name: "Database Systems", grade: 78, credits: 4, status: "Pass" },
            { name: "Web Development", grade: 92, credits: 3, status: "Pass" },
            { name: "Computer Networks", grade: 65, credits: 4, status: "Fail" },
            { name: "Software Engineering", grade: 88, credits: 3, status: "Pass" },
        ],
    }

    const totalCredits = student.courses.reduce((sum, course) => sum + course.credits, 0)
    const earnedCredits = student.courses
        .filter((course) => course.status === "Pass")
        .reduce((sum, course) => sum + course.credits, 0)
    const gpa = (
        student.courses.reduce((sum, course) => sum + course.grade * course.credits, 0) / totalCredits
    ).toFixed(2)
    const passStatus = earnedCredits >= totalCredits * 0.7 ? "Pass" : "Fail"

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                        </HeadSection>
                    </aside>
                    <main className="flex justify-center items-center py-4">
                        <Card className="mx-auto w-full max-w-4xl">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Student Evaluation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold">Name</h3>
                                        <p>{student.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Student ID</h3>
                                        <p>{student.id}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Program</h3>
                                        <p>{student.program}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Year</h3>
                                        <p>{student.year}</p>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Course</TableHead>
                                            <TableHead className="text-right">Grade</TableHead>
                                            <TableHead className="text-right">Credits</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {student.courses.map((course, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{course.name}</TableCell>
                                                <TableCell className="text-right">{course.grade}</TableCell>
                                                <TableCell className="text-right">{course.credits}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={course.status === "Pass" ? "default" : "destructive"}>
                                                        {course.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                                            >
                                                                <DotsHorizontalIcon className="h-4 w-4" />
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuItem>Pass</DropdownMenuItem>
                                                            <DropdownMenuItem>Fail</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Credits Earned</span>
                                        <span>
                                            {earnedCredits} / {totalCredits}
                                        </span>
                                    </div>
                                    <Progress value={(earnedCredits / totalCredits) * 100} className="w-full" />
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <h3 className="font-semibold">GPA</h3>
                                        <p className="text-2xl font-bold">{gpa}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Credits Earned</h3>
                                        <p className="text-2xl font-bold">
                                            {earnedCredits}/{totalCredits}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Overall Status</h3>
                                        <Badge variant={passStatus === "Pass" ? "default" : "destructive"} className="mt-1 text-lg">
                                            {passStatus}
                                        </Badge>
                                    </div>
                                </div>
                                {
                                    !isdropout &&
                                    <Button onClick={() => setDropout(true)} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button">
                                        <Plus className='text-primary' size={18} /> Add Dropout Form
                                    </Button>
                                }
                                <Separator />
                                {isdropout && <DragDropImage isdropout={(e) => setDropout(e)} />}
                            </CardContent>
                            <CardFooter>
                                <p className="text-sm text-muted-foreground">
                                    Note: A student must pass at least 70% of their total credits to receive an overall pass status.
                                </p>
                            </CardFooter>
                        </Card>
                    </main>
                </div>
            </div>
        </>
    )
}

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Plus, Upload, X } from "lucide-react"
import { Separator } from '@/components/ui/separator'

const DragDropImage = ({ isdropout }: { isdropout: (e: boolean) => void }) => {
    const [image, setImage] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const reader = new FileReader()

        reader.onload = (event) => {
            setImage(event.target?.result as string)
        }

        reader.readAsDataURL(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        },
        multiple: false,
    })

    const removeImage = () => {
        setImage(null)
    }

    return (
        <div className=" flex flex-col items-center justify-center p-4 gap-4">
            <h1 className="text-2xl font-bold">Dropout Form</h1>
            <Card className="w-full max-w-xl">
                <CardContent className="pt-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
                            }`}
                    >
                        <input {...getInputProps()} />
                        {image ? (
                            <div className="relative">
                                <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeImage()
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">Drag and drop an image here, or click to select a file</p>
                            </div>
                        )}
                    </div>
                    {!image && (
                        <p className="mt-2 text-xs text-center text-gray-500">
                            Supported formats: JPEG, JPG, PNG, GIF
                        </p>
                    )}
                </CardContent>
            </Card>
            <Button onClick={
                (e) => {
                    e.stopPropagation()
                    removeImage()
                    isdropout(false)
                }
            } variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button">
                <X className='text-primary' size={18} /> Cancel Dropout Form
            </Button>
        </div>
    )
}