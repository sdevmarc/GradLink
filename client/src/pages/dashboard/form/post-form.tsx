import Header_Dashboard from '@/components/header-dashboard'
import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ComboBox } from '@/components/combo-box'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { IEventTarget } from '@/interface'

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
    { value: 'text', label: 'Text' },
    { value: 'combobox', label: 'Combo Box' },
    { value: 'number', label: 'Number' },
]

interface FormValues {
    questions: { title: string; type: string; }[];
}

interface IShortAnswer {
    title: string
    type: string
}

const CreateForm = () => {
    const [shortanswer, setShortAnswer] = useState<IShortAnswer>({
        title: '',
        type: ''
    })
    const [values, setValues] = useState<FormValues>({
        questions: []
    })

    const handleAddRow = () => {
        setValues(prevValues => ({
            ...prevValues,
            questions: [...prevValues.questions, { title: shortanswer?.title, type: shortanswer?.type }]
        }));
        setShortAnswer((prev) => ({
            ...prev,
            title: '',
            type: ''
        }))
        console.log(values)
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value }: IEventTarget = e.target

        setShortAnswer((prev) => ({
            ...prev,
            [name]: value
        }))
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
                            values.questions.map((item, i) => (
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
                                        <ComboBox
                                            title='Type'
                                            lists={Lists}
                                        />
                                    </div>
                                    <Button variant={`outline`} type='button'>
                                        Delete Row
                                    </Button>
                                </div>
                            ))
                        }
                        <div className="flex justify-between items-center">
                            <div className="w-full flex gap-2 items-center">
                                <Input
                                    value={shortanswer?.title}
                                    onChange={handleOnChange}
                                    name='title'
                                    type='text'
                                    placeholder='eg. What is the biggest country?'
                                    className='w-[70%]' />
                                <ComboBox
                                    type={(item) => console.log(item)}
                                    title='Type'
                                    lists={Lists}
                                />
                            </div>
                            <Button onClick={handleAddRow} variant={`outline`} type='button'>
                                Add Row
                            </Button>
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