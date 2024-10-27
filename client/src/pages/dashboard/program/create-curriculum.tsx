import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import MainTable from '@/components/main-table'
import { ROUTES } from '@/constants'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { AlertDialogConfirmation } from '@/components/alert-dialog'
import { CircleCheck, CircleX, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableSelectCoursesInCurriculum } from './program-data-table-components/curriculum/create-curriculum/courses/data-table-select-courses-in-curriculum'
import { SelectCoursesInCurriculumColumns } from './program-data-table-components/curriculum/create-curriculum/courses/columns-select-courses-in-curriculum'
import { IAPICourse } from '@/interface/course.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_COURSE_FINDALL } from '@/api/courses'

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTableSelectProgramsInCurriculum } from './program-data-table-components/curriculum/create-curriculum/programs/data-table-select-programs-in-curriculum'
import { SelectProgramInCurriculumColumns } from './program-data-table-components/curriculum/create-curriculum/programs/columns-select-programs-in-curriculum'
import { API_PROGRAM_FINDALL } from '@/api/program'
import Loading from '@/components/loading'
import { Progress } from '@/components/ui/progress'
import { IRequestCourse, IRequestCurriculum, IShowCategories } from '@/interface/curriculum.interface'
import { API_NEW_CURRICULUM } from '@/api/curriculum'
import { useNavigate } from 'react-router-dom'

export default function CreateCurriculum() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isresetprogram, setResetProgram] = useState<boolean>(false)
    const [iseresetCourse, setResetCourse] = useState<boolean>(false)
    const [statusStepBack, setStatusStepBack] = useState<boolean>(false)
    const [thestep, setTheStep] = useState<0 | 1 | 2 | 3>(0)
    const [ismajor, setMajor] = useState<boolean>(false)
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
    const [showcourses, setShowCourses] = useState<IShowCategories>({
        categoryName: '',
        courses: [],
    })
    const [categories, setCategories] = useState<IRequestCourse>({
        categoryName: '',
        courses: [],
    })
    const [values, setValues] = useState<IRequestCurriculum>({
        name: '',
        programCode: '',
        major: '',
        categories: [],
        showcategories: []
    })
    const [conditionaldialogstate, setConditionalDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false || null
    })
    const [alertdialogstate, setAlertDialogState] = useState({
        show: false,
        title: '',
        description: '',
        success: false
    })

    const { data: course, isLoading: courseLoading, isFetched: courseFetched } = useQuery({
        queryFn: () => API_COURSE_FINDALL(),
        queryKey: ['courses']
    })

    const { data: program, isLoading: programLoading, isFetched: programFetched } = useQuery({
        queryFn: () => API_PROGRAM_FINDALL(),
        queryKey: ['programs']
    })

    const { mutateAsync: addcurriculum, isPending: addcurriculumLoading } = useMutation({
        mutationFn: API_NEW_CURRICULUM,
        onSuccess: async (data) => {
            if (!data.success) {
                setAlertDialogState({ success: false, show: true, title: "Uh, oh. Something went wrong!", description: data.message })
                return
            } else {
                await queryClient.invalidateQueries({ queryKey: ['curriculums', 'curriculum_exists'] })
                await queryClient.refetchQueries({ queryKey: ['curriculums', 'curriculum_exists'] })
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                navigate(ROUTES.CURRICULUM)
                setAlertDialogState({ success: true, show: true, title: "Yay, success! 🎉", description: data.message })
                return
            }
        },
        onError: (data) => {
            setAlertDialogState({ success: false, show: true, title: 'Uh, oh! Something went wrong.', description: data.message })
        }
    })

    const handleOnChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCategories(prev => ({
            ...prev,
            [name]: value
        }))
        setShowCourses(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const findDuplicateCourses = (existingCategories: typeof values.showcategories, newCourses: IAPICourse[]) => {
        const duplicates: IAPICourse[] = [];

        // Check each new course against all existing courses in all categories
        newCourses.forEach(newCourse => {
            existingCategories?.forEach(category => {
                const isDuplicate = category.courses?.some(
                    (existingCourse: IAPICourse) => existingCourse.code === newCourse.code
                );
                if (isDuplicate && !duplicates.some(d => d.code === newCourse.code)) {
                    duplicates.push(newCourse);
                }
            });
        });

        return duplicates;
    };

    const handleAddCoursesToCategories = () => {
        if (!categories.categoryName.trim()) {
            setAlertDialogState({ success: false, show: true, title: 'Invalid Category', description: 'Please enter a category name.' })
            return;
        }

        if (categories.courses?.length === 0) {
            setAlertDialogState({
                success: false,
                show: true,
                title: 'No Courses Selected',
                description: 'Please select at least one course to add to the category.'
            });
            return;
        }

        // Check for duplicate courses
        const duplicateCourses = findDuplicateCourses(values.showcategories, showcourses.courses || []);

        if (duplicateCourses.length > 0) {
            const courseList = duplicateCourses
                .map(course => `${course.code} - ${course.courseno} - ${course.descriptiveTitle}`)
                .join('\n');

            setAlertDialogState({
                success: false,
                show: true,
                title: 'Duplicate Courses Detected',
                description: `The following courses are already added to other categories:\n${courseList}`
            });
            return;
        }

        setValues(prev => ({
            ...prev,
            categories: [...prev.categories, {
                categoryName: categories.categoryName,
                courses: categories.courses || []
            }],
            showcategories: [...(prev.showcategories || []), {
                categoryName: showcourses.categoryName,
                courses: showcourses.courses
            }]
        }))
        setResetCourse(true)
        setCategories({
            categoryName: '',
            courses: [],
        });
    }

    const handleRemoveCategorizedCourse = (index: number) => {
        setValues(prev => ({
            ...prev,
            showcategories: (prev.showcategories || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        const { name, programCode, major, categories } = values
        const trimmedMajor = major.trim()

        setResetProgram(true)
        setShowCourses({
            categoryName: '',
            courses: [],
        })
        setCategories({
            categoryName: '',
            courses: [],
        })
        setValues({
            name: '',
            programCode: '',
            major: '',
            categories: [],
            showcategories: []
        })
        setMajor(false)
        await addcurriculum({ name, programCode, major: trimmedMajor, categories })
    }

    const isLoading = courseLoading || addcurriculumLoading

    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                {isLoading && <Loading />}
                <AlertDialogConfirmation
                    btnTitle='Continue'
                    className='w-full py-4'
                    isDialog={alertdialogstate.show}
                    setDialog={(open) => setAlertDialogState(prev => ({ ...prev, show: open }))}
                    type={`alert`}
                    title={alertdialogstate.title}
                    description={alertdialogstate.description}
                    icon={
                        (alertdialogstate.success || !alertdialogstate.success) ?
                            alertdialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />
                            : null
                    }
                    variant={`default`}
                    btnContinue={() => { setAlertDialogState(prev => ({ ...prev, show: false })) }}
                />
                <AlertDialogConfirmation
                    className='w-full'
                    btnTitle='Continue'
                    isDialog={conditionaldialogstate.show}
                    setDialog={(open) => setConditionalDialogState(prev => ({ ...prev, show: open }))}
                    type={`conditional`}
                    title={conditionaldialogstate.title}
                    description={conditionaldialogstate.description}
                    icon={
                        conditionaldialogstate.success === null ? null :
                            conditionaldialogstate.success ? <CircleCheck color="#42a626" size={70} /> : <CircleX color="#880808" size={70} />
                    }
                    variant={`default`}
                    btnContinue={() => {
                        setStep(thestep)
                        setConditionalDialogState(prev => ({ ...prev, show: false }))
                        if (statusStepBack) {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }

                        if (step === 0 && !statusStepBack) {
                            if (values.name === '') {
                                setAlertDialogState({
                                    success: false,
                                    show: true,
                                    title: 'Uh, oh. Something went wrong!',
                                    description: `Please fill-in the required field.`
                                });
                                setStep(0)
                                return
                            }
                            setStep(1)
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }

                        if (step === 1 && !statusStepBack) {
                            if (values.programCode === '') {
                                setAlertDialogState({
                                    success: false,
                                    show: true,
                                    title: 'Uh, oh. Something went wrong!',
                                    description: `Please add a program first.`
                                });
                                setStep(1)
                                return
                            }
                            setStep(2)
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }
                        if (step === 2 && !statusStepBack) {
                            if (values.categories.length === 0) {
                                setAlertDialogState({
                                    success: false,
                                    show: true,
                                    title: 'Uh, oh. Something went wrong!',
                                    description: `Please add a categorized courses first.`
                                });
                                setStep(2)
                                return
                            }
                            setStep(3)
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }
                        if (step === 3 && !statusStepBack) { handleSubmit() }

                    }}
                />
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[8rem]">
                        <HeadSection>
                            <BackHeadSection />
                            <SubHeadSectionDetails
                                title="NEW CURRICULUM"
                                description="A page for creating a new curriculum."
                            />
                        </HeadSection>
                    </aside>
                    <main className="flex">
                        <Sidebar>
                            <SidebarNavs title="Programs" link={ROUTES.AVAILABLE_PROGRAMS} />
                            <SidebarNavs title="Courses" link={ROUTES.AVAILABLE_COURSES} />
                            <SidebarNavs bg='bg-muted' title="Curriculums" link={ROUTES.CURRICULUM} />
                        </Sidebar>
                        <MainTable>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4 px-4">
                                    <div className="flex items-center justify-between">
                                        <span className='text-md font-medium'>
                                            {step === 0 && 'Curriculum Name'}
                                            {step === 1 && 'Select a program'}
                                            {step === 2 && 'Select the courses'}
                                            {step === 3 && 'Confirmation'}
                                        </span>
                                        <span className='text-md font-medium'>
                                            {step} / 4 Done
                                        </span>
                                    </div>
                                    <Progress value={(step / 4) * 100} className="w-full bg-muted" />
                                </div>

                                <div className="flex flex-col border gap-4 rounded-md px-4">
                                    <div className="w-full py-3 border-b">
                                        <h1 className='text-text font-semibold text-lg'>Configuration</h1>
                                    </div>
                                    <div className="w-full flex flex-col gap-4">
                                        <div className={`${step === 0 ? 'block' : 'hidden'} w-full flex flex-col gap-4`}>
                                            <div className="flex flex-col gap-2">
                                                <h1 className="text-sm font-normal">
                                                    What is the name of this curriculum?
                                                </h1>
                                                <Input
                                                    disabled={isLoading}
                                                    value={values.name}
                                                    type='text'
                                                    name='name'
                                                    placeholder='eg. New Curriculum 2024'
                                                    className='h-8 max-w-[400px]'
                                                    onChange={handleOnChangeValues}
                                                    required
                                                />
                                            </div>

                                            <Button
                                                disabled={isLoading}
                                                variant={`default`}
                                                size={`sm`}
                                                className='py-5'
                                                onClick={() => {
                                                    setStatusStepBack(false)
                                                    setConditionalDialogState({ success: null, show: true, title: 'Are you sure?', description: 'This action cannot be undone. This will permanently recorded to the new curriculum.' })
                                                }}
                                            >
                                                Next
                                            </Button>
                                        </div>

                                        <div className={`${step === 1 ? 'block' : 'hidden'} w-full flex flex-col gap-4`}>
                                            <div className="flex flex-col gap-1">
                                                {programLoading && <div>Programs is loading</div>}
                                                {
                                                    programFetched &&
                                                    <DataTableSelectProgramsInCurriculum
                                                        columns={SelectProgramInCurriculumColumns}
                                                        data={program?.data || []}
                                                        fetchAddedPrograms={(e) => setValues(prev => ({
                                                            ...prev,
                                                            programCode: e?.code || ''
                                                        }))}
                                                        reset={isresetprogram}
                                                    />
                                                }
                                            </div>
                                            {
                                                !ismajor &&
                                                <div className="flex">
                                                    <Button disabled={isLoading} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button" onClick={() => setMajor(true)}>
                                                        <Plus color="#000000" size={18} /> Add Major
                                                    </Button>
                                                </div>
                                            }

                                            {
                                                ismajor &&
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between py-2">
                                                        <h1 className='text-[.83rem]'>Major (Optional)</h1>
                                                        <Button disabled={isLoading} onClick={() => setMajor(false)} variant={`ghost`} size={`sm`}>
                                                            <X color="#000000" size={18} /> Cancel
                                                        </Button>
                                                    </div>
                                                    <Input
                                                        disabled={isLoading}
                                                        value={values.major}
                                                        name='major'
                                                        type='text'
                                                        placeholder='Major in Software Development'
                                                        onChange={handleOnChangeValues}
                                                        required
                                                    />
                                                </div>
                                            }
                                            <div className=" flex items-center gap-4 pb-4">
                                                <Button
                                                    disabled={isLoading}
                                                    variant={`outline`}
                                                    size={`sm`}
                                                    className='w-full py-5'
                                                    onClick={() => {
                                                        setTheStep(0)
                                                        setStatusStepBack(true)
                                                        setConditionalDialogState({ success: null, show: true, title: 'Are you sure?', description: 'You will lose your progress for this phase.' })
                                                    }}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    disabled={isLoading}
                                                    variant={`default`}
                                                    size={`sm`}
                                                    className='w-full py-5'
                                                    onClick={() => {
                                                        setStatusStepBack(false)
                                                        setConditionalDialogState({ success: null, show: true, title: 'Are you sure?', description: 'This action cannot be undone. This will permanently recorded to the new curriculum.' })
                                                    }}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>

                                        <div className={`${step === 2 ? 'block' : 'hidden'} flex flex-col gap-2`}>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className='text-[.83rem]'>
                                                            Category Name
                                                        </h1>
                                                        <div className="flex items-center gap-4">
                                                            <Input
                                                                disabled={isLoading}
                                                                value={categories.categoryName}
                                                                type='text'
                                                                name='categoryName'
                                                                placeholder='Foundation Courses'
                                                                onChange={handleOnChangeCategory}
                                                                className='h-8 max-w-[400px]'
                                                                required
                                                            />
                                                            <Button disabled={isLoading} onClick={handleAddCoursesToCategories} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button">
                                                                <Plus color="#000000" size={18} /> Add Categorized Course
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {
                                                        courseFetched &&
                                                        <DataTableSelectCoursesInCurriculum
                                                            columns={SelectCoursesInCurriculumColumns}
                                                            data={course.data || []}
                                                            fetchAddedCourses={(e) => {
                                                                setShowCourses(prev => ({
                                                                    ...prev,
                                                                    courses: e || []
                                                                }))
                                                                setCategories(prev => ({
                                                                    ...prev,
                                                                    courses: e.map(item => item._id).filter(id => id !== undefined) as string[]
                                                                }))
                                                            }}
                                                            resetSelection={iseresetCourse}
                                                            onResetComplete={() => setResetCourse(false)}
                                                        />
                                                    }

                                                </div>
                                                {
                                                    values.showcategories?.map((item, i) => (
                                                        <div key={i} className='flex flex-col gap-2 border p-4 rounded-md'>
                                                            <div className="flex items-center justify-between">
                                                                <h1 className='font-medium'>
                                                                    {i + 1}. {item.categoryName}
                                                                </h1>
                                                                <Button onClick={() => handleRemoveCategorizedCourse(i)} variant={`outline`} size={`sm`} className="flex items-center gap-4" type="button">
                                                                    <X color="#000000" size={18} /> Remove
                                                                </Button>
                                                            </div>
                                                            <NormalTable courses={item.courses || []} />
                                                        </div>
                                                    ))
                                                }
                                                <div className=" flex items-center gap-4 pb-4">
                                                    <Button
                                                        disabled={isLoading}
                                                        variant={`outline`}
                                                        size={`sm`}
                                                        className='w-full py-5'
                                                        onClick={() => {
                                                            setTheStep(1)
                                                            setStatusStepBack(true)
                                                            setConditionalDialogState({ success: null, show: true, title: 'Are you sure?', description: 'You will lose your progress for this phase.' })
                                                        }}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        disabled={isLoading}
                                                        variant={`default`}
                                                        size={`sm`}
                                                        className='w-full py-5'
                                                        onClick={() => {
                                                            setStatusStepBack(false)
                                                            setConditionalDialogState({ success: null, show: true, title: 'Are you sure?', description: 'This action cannot be undone. This will permanently recorded to the new curriculum.' })
                                                        }}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${step === 3 ? 'block' : 'hidden'} w-full flex flex-col gap-4`}>
                                            <div className="flex flex-col gap-2">
                                                <h1 className='font-medium text-lg'>
                                                    Summary
                                                </h1>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col px-6 gap-4">
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className='text-md font-medium'>
                                                            Curriculum Name
                                                        </h1>
                                                        <Input value={values.name} readOnly />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className='text-md font-medium'>
                                                            Program Code
                                                        </h1>
                                                        <Input value={values.programCode} readOnly />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className='text-md font-medium'>
                                                            Major
                                                        </h1>
                                                        <Input value={values.major || 'None'} readOnly />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <h1 className='text-md font-medium'>
                                                            Courses
                                                        </h1>
                                                        {
                                                            values.showcategories?.map((item, i) => (
                                                                <div key={i} className='flex flex-col gap-2 border p-4 rounded-md'>
                                                                    <div className="flex items-center justify-between">
                                                                        <h1 className='font-medium'>
                                                                            {i + 1}. {item.categoryName}
                                                                        </h1>
                                                                    </div>
                                                                    <NormalTable courses={item.courses || []} />
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" flex items-center gap-4 pb-4">
                                                <Button
                                                    disabled={isLoading}
                                                    variant={`outline`}
                                                    size={`sm`}
                                                    className='w-full py-5'
                                                    onClick={() => {
                                                        setTheStep(2)
                                                        setStatusStepBack(true)
                                                        setConditionalDialogState({ success: null, show: true, title: 'Are you sure?', description: 'You will lose your progress for this phase.' })
                                                    }}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    disabled={isLoading}
                                                    variant={`default`}
                                                    size={`sm`}
                                                    className='w-full py-5'
                                                    onClick={() => {
                                                        setStatusStepBack(false)
                                                        setConditionalDialogState({ success: null, show: true, title: 'Are you sure?', description: 'This action cannot be undone. This will permanently recorded to the new curriculum.' })
                                                    }}
                                                >
                                                    {addcurriculumLoading ? 'Creating curriculum...' : 'Create new curriculum'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MainTable>
                    </main>
                </div>
            </div >
        </>
    )
}

function NormalTable({ courses }: { courses: IAPICourse[] }) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead className="w-[100px]">Course No</TableHead>
                    <TableHead>Descriptive Title</TableHead>
                    <TableHead>Units</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {courses.map((item) => (
                    <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.code}</TableCell>
                        <TableCell className="font-medium">{item.courseno}</TableCell>
                        <TableCell>{item.descriptiveTitle}</TableCell>
                        <TableCell>{item.units}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow key="footer">
                    <TableCell key="footer-label" colSpan={3}>Total of units</TableCell>
                    <TableCell key="footer-value" className="text-right">
                        {courses.reduce((total, course) => total + (Number(course.units) || 0), 0)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}