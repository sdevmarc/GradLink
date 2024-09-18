import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'

export default function CreateStudent() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="CREATE A GOOGLE FORM"
                                description="A feature for building and customizing Google Forms to gather and organize information efficiently."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs bg='bg-muted' title="Registered Students" link="/student" />
                            <SidebarNavs title="Alumni Graduates" link="/student/alumni" />
                        </Sidebar>
                        <CreateForm />
                    </main>
                </div>
            </div>
        </>
    )
}

const lists = [
    { value: '1', label: 'First' },
    { value: '2', label: 'Second' },
    { value: '3', label: 'Third' },
]

const CreateForm = () => {
    const [student, setStudent] = React.useState<IAPIStudents>({
        idNumber: '',
        name: '',
        email: '',
        semester: '',
        enrollments: []
    });
    const { data: course, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['course']
    })

    const { mutateAsync: insertStudent, isPending: studentLoading } = useMutation({
        mutationFn: API_STUDENT_CREATE,
        onSuccess: (e) => {
            console.log(e)
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(student)
        // await insertStudent()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleCoursesChange = (selectedCourses: IAPICourse[]) => {
        setStudent((prev) => ({
            ...prev,
            enrollments: selectedCourses.map(({ courseno, descriptiveTitle, units }) => ({
                courseno,
                descriptiveTitle,
                units
            }))
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="w-[80%] flex flex-col justify-start gap-4 rounded-lg border">
            <div className="w-full px-4 py-3 border-b">
                <h1 className='text-text font-semibold text-lg'>Create a student</h1>
            </div>
            <div className="w-full py-2 flex flex-col justify-between">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.83rem]'>ID Number</h1>
                        <Input
                            name='title'
                            type='text'
                            placeholder='eg. 000xxxxxx'
                            required
                        />
                    </div>
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.83rem]'>Full Name</h1>
                        <Input
                            name='title'
                            type='text'
                            placeholder='eg. John Doe'
                            required
                        />
                    </div>
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.83rem]'>Email Address</h1>
                        <Input
                            name='title'
                            type='text'
                            placeholder='eg. m@example.com'
                            required
                        />
                    </div>
                    <div className="max-w-lg flex flex-col px-4 gap-1">
                        <h1 className='text-[.83rem]'>Choose a semester</h1>
                        <ComboBox
                            type={
                                (e) => { setStudent((prev) => ({ ...prev, semester: e })) }
                            }
                            title='None'
                            lists={lists || []}
                            value={student.semester}
                        />
                    </div>
                    <div className="flex flex-col px-4 gap-2">
                        <div className="flex flex-col gap-1">
                            <h1 className='text-[1.1rem] font-medium'>
                                Courses Available
                            </h1>
                            <p className="text-sm">
                                Please check the courses that you wish to enroll.
                            </p>
                        </div>
                        <div className="w-full flex flex-col gap-2 justify-center items-start">
                            {courseLoading && <div>Loading...</div>}
                            {courseFetched && <DataTable data={course.data || []} columns={CourseColumns} onSubmit={handleCoursesChange} />}
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-end px-4">
                        <Button type='submit' variant={`default`} size={`default`}>
                            SUBMIT ENROLLMENT
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { API_STUDENT_CREATE } from '@/api/student'
import { IAPIStudents } from '@/interface/student.interface'
import { IAPICourse } from '@/interface/course.interface'
import { ComboBox } from '@/components/combo-box'

const CourseColumns: ColumnDef<IAPICourse>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "courseno",
        header: "Course No.",
        cell: ({ row }) => (
            <div>{row.getValue("courseno")}</div>
        ),
    },
    {
        accessorKey: "descriptiveTitle",
        header: 'Descriptive Title',
        cell: ({ row }) => <div className="lowercase">{row.getValue("descriptiveTitle")}</div>,
    },
    {
        accessorKey: "units",
        header: 'Units',
        cell: ({ row }) => (
            <div>{row.getValue("units")}</div>
        ),
    },
    {
        accessorKey: "degree",
        header: 'Degree',
        cell: ({ row }) => (
            <div>{row.getValue("degree")}</div>
        ),
    }
]

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    onSubmit: (e: IAPICourse[]) => void
}

function DataTable<TData, TValue>({
    columns,
    data,
    onSubmit
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // const handleFetchSelected = async () => {
    //     const selectedRows = table.getFilteredSelectedRowModel().rows
    //     const courses = selectedRows.map(row => {
    //         const original = row.original as ICourse;
    //         const { courseno, descriptiveTitle, units } = original
    //         return { courseno, descriptiveTitle, units }
    //     })
    //     onSubmit(courses)
    // }

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    React.useEffect(() => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const courses = selectedRows.map(row => {
            const original = row.original as IAPICourse;
            const { courseno, descriptiveTitle, units } = original;
            return { courseno, descriptiveTitle, units };
        });
        onSubmit(courses);
    }, [rowSelection, table]);

    return (
        <div className="w-full">
            <div className="w-full flex justify-between items-center pb-2">
                <div className="w-[50%] flex items-center gap-2">
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn("courseno")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("courseno")?.setFilterValue(event.target.value)
                        }
                        className=""
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Type <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}