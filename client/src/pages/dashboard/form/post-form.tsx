import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ComboBox } from '@/components/combo-box'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function PostForm() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
                <Header_Dashboard />
                <div className="w-full max-w-[90rem] flex flex-col pb-[20rem]">
                    <aside className="px-4 pb-4 pt-[5rem]">
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
                            <SidebarNavs title="List" link="/form" />
                            <SidebarNavs title="Trash" link="/" />
                        </Sidebar>
                        <CreateForm />
                    </main>
                </div>
            </div>
        </>
    )
}

const Lists = [
    { value: 'shortanswer', label: 'Short Answer' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'date', label: 'Date' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'multiplechoice', label: 'Multiple Choice' },
]

interface FormValues {
    question: string;
    answer: string
}

interface IForm {
    items: FormValues[]
}

interface IShortAnswer {
    question: string
    answer: string
}

interface RadioOptions {
    title: string
}

interface IMultipleChoice extends IShortAnswer {
    options: RadioOptions[]
}

const CreateForm = () => {
    const [isComboBox, setComboBox] = useState<string>('')
    const [hasshortanswer, setShortAnswer] = useState<IShortAnswer>({
        question: '',
        answer: ''
    })
    const [hasMultipleChoice, setMultipleChoice] = useState<IMultipleChoice>({
        question: '',
        options: [],
        answer: ''
    })
    const [values, setValues] = useState<IForm>({
        items: []
    })

    // Data Entries
    const handleAddRow = () => {
        try {
            if (isComboBox === '') return alert('Please include a type.')

            if (isComboBox === 'shortanswer') {
                setValues(prevValues => ({
                    ...prevValues,
                    items: [...prevValues.items, { question: hasshortanswer?.question, answer: hasshortanswer?.answer }]
                }))
                return
            }
            return
        } catch (error) {
            console.error(error)
        } finally {
            setComboBox('')
            setShortAnswer({ question: '', answer: '' })
        }
    }

    const handleDeleteRow = (index: number) => {
        setValues(prevValues => ({
            ...prevValues,
            items: prevValues.items.filter((_, i) => i !== index)
        }))
    }

    // Short Answer
    const handleOnChangeShortAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setShortAnswer((prev) => ({ ...prev, [name]: value }))
    }

    // Multiple Choice
    // const handleAddOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target

    //     setShortAnswer((prev) => ({ ...prev, [name]: value }))
    // }

    const handleComboBox = (e: string) => {
        setComboBox(e)
    }

    return (
        <>
            <form className="w-[80%] flex flex-col justify-between rounded-lg border">
                <div className="w-full px-4 py-3 border-b">
                    <h1 className='text-text font-semibold text-lg'>Configure Form</h1>
                </div>
                <div className="w-full py-2 flex flex-col gap-4">
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.9rem]'>Form Name</h1>
                        <Input
                            type='text'
                            placeholder='eg. Alumni Graduates Survey'
                            required
                        />
                    </div>
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.9rem]'>Brief Description</h1>
                        <Textarea placeholder="Type your message here." required />
                    </div>
                    <div className="flex flex-col px-4 gap-4">
                        <div className="w-full flex justify-between items-center">
                            <h1 className='text-[.9rem]'>Data Entries</h1>
                        </div>
                        {
                            values.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="w-full flex gap-2 items-center">
                                        <Input
                                            name='question'
                                            value={item?.question}
                                            onChange={handleOnChangeShortAnswer}
                                            type='text'
                                            placeholder='eg. What is the biggest country?'
                                            className='w-[70%]'
                                        />
                                        {/* <ComboBox
                                            title='Type'
                                            lists={Lists}
                                        /> */}
                                    </div>
                                    <Button onClick={() => handleDeleteRow(i)} variant={`outline`} type='button'>
                                        Delete Row
                                    </Button>
                                </div>
                            ))
                        }
                        <div className="w-full flex flex-col gap-2 justify-center items-start">
                            <div className="w-full flex justify-between items-center">
                                <div className="w-full flex gap-2 items-center">
                                    <Input
                                        value={hasshortanswer?.question}
                                        name='question'
                                        onChange={handleOnChangeShortAnswer}
                                        type='text'
                                        placeholder='eg. What is the biggest country?'
                                        className='w-[70%]'
                                    />
                                    <ComboBox
                                        type={(item) => handleComboBox(item || '')}
                                        title='Type'
                                        lists={Lists}
                                        value={isComboBox}
                                    />
                                </div>
                                <Button onClick={handleAddRow} variant={`outline`} type='button'>
                                    Add Row
                                </Button>
                            </div>
                            {
                                isComboBox === 'shortanswer' && (
                                    <textarea
                                        placeholder='Write your short answer here...'
                                        className='w-[60%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm'
                                        readOnly
                                    />
                                )
                            }
                            {
                                isComboBox === 'paragraph' && (
                                    <textarea
                                        placeholder='Write your long answer here...'
                                        className='w-[60%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm'
                                        readOnly
                                    />
                                )
                            }
                            {
                                isComboBox === 'multiplechoice' && (
                                    <>
                                        {
                                            hasMultipleChoice.options.map((item, i) => (
                                                <>
                                                    <input key={i} type="radio" id="radio1" name="radio-group" className="hidden peer" />
                                                    <label htmlFor="radio1" className="flex items-center cursor-pointer">
                                                        <span className="w-5 h-5 inline-block mr-2 border-gray-300 border-[3px] rounded-full peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                        <input value={item?.title} type="text" className='w-[40%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm' />
                                                    </label>
                                                </>
                                            ))
                                        }


                                        <input type="radio" id="radio1" name="radio-group" className="hidden peer" />
                                        <label htmlFor="radio1" className="flex items-center cursor-pointer">
                                            <span className="w-5 h-5 inline-block mr-2 border-gray-300 border-[3px] rounded-full peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                            <input
                                                placeholder='eg. Option 1'
                                                type="text"
                                                className='w-[40%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm'
                                            />
                                        </label>

                                        <input type="radio" id="radio1" name="radio-group" className="hidden peer" />
                                        <label htmlFor="radio1" className="flex items-center cursor-pointer">
                                            <span className="w-5 h-5 inline-block mr-2 border-gray-300 border-[3px] rounded-full peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                            <div className="flex gap-2 items-center">
                                                <Button variant={`outline`} type='button'>
                                                    Add option
                                                </Button>
                                                or
                                                <Button variant={`outline`} type='button'>
                                                    add "Other"
                                                </Button>
                                            </div>

                                        </label>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end p-5">
                    <Button variant={`default`} type='submit'>
                        Create Form
                    </Button>
                </div>
            </form>
        </>
    )
}