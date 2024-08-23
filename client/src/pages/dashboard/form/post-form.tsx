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
]

interface FormValues {
    items: { title: string; type: string; }[];
}

interface IShortAnswer {
    question: string
    answer: string
}

const CreateForm = () => {
    const [isComboBox, setComboBox] = useState<string>('')
    const [items, setItem] = useState<IShortAnswer>({
        question: '',
        answer: ''
    })
    const [values, setValues] = useState<FormValues>({
        items: []
    })

    const handleAddRow = () => {
        setValues(prevValues => ({
            ...prevValues,
            questions: [...prevValues.items, { title: items?.question, type: items?.answer }]
        }))

        console.log(values)
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setItem((prev) => ({ ...prev, [name]: value }))
    }

    const handleComboBox = (e: string) => {
        console.log(e)
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
                                            name='title'
                                            value={item?.title}
                                            onChange={handleOnChange}
                                            type='text'
                                            placeholder='eg. What is the biggest country?'
                                            className='w-[70%]'
                                        />
                                        {/* <ComboBox
                                            title='Type'
                                            lists={Lists}
                                        /> */}
                                    </div>
                                    <Button variant={`outline`} type='button'>
                                        Delete Row
                                    </Button>
                                </div>
                            ))
                        }
                        <div className="w-full flex flex-col gap-2 justify-center">
                            <div className="w-full flex justify-between items-center">
                                <div className="w-full flex gap-2 items-center">
                                    <Input
                                        name='question'
                                        type='text'
                                        placeholder='eg. What is the biggest country?'
                                        className='w-[70%]'
                                    />
                                    <ComboBox
                                        type={(item) => handleComboBox(item || '')}
                                        title='Type'
                                        lists={Lists}
                                    />
                                </div>
                                <Button onClick={handleAddRow} variant={`outline`} type='button'>
                                    Add Row
                                </Button>
                            </div>
                            {
                                isComboBox === 'shortanswer' ? (
                                    <textarea
                                        placeholder='Write your short answer here...'
                                        className='w-[60%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm'
                                        readOnly
                                    />
                                ) : null
                            }
                            {
                                isComboBox === 'paragraph' ? (
                                    <textarea
                                        placeholder='Write your long answer here...'
                                        className='w-[60%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm'
                                        readOnly
                                    />
                                ) : null
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