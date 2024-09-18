import HeadSection, { BackHeadSection, SubHeadSectionDetails } from '@/components/head-section'
import { Sidebar, SidebarNavs } from '@/components/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ComboBox } from '@/components/combo-box'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { X } from 'lucide-react';

export default function PostForm() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center">
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
    type?: string
    questionTitle: string;
    options: string[]
}

interface IForm {
    formId?: string
    title?: string
    description?: string
    item: FormValues[]
}


const CreateForm = () => {
    const [isComboBox, setComboBox] = useState<string>('')
    const [valuesoptions, setValuesOptions] = useState<{ [key: number]: string }>({})
    const [options, setOptions] = useState<string>('')
    const [questions, setQuestions] = useState<{ questionTitle: string, options: string[] }>({
        questionTitle: '',
        options: []
    })
    const [values, setValues] = useState<IForm>({
        formId: '',
        title: '',
        description: '',
        item: []
    })

    const handleCreateForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('From Create form button: ', values)
    }

    const handleAddRow = () => {
        if (isComboBox === '') return alert('Please include a type.')
        setValues((prev) => ({
            ...prev,
            item: [...prev.item, {
                type: isComboBox,
                questionTitle: questions.questionTitle,
                options: questions.options
            }]
        }))
        setQuestions((prev) => ({
            ...prev,
            questionTitle: '',
            options: []
        }))
        setComboBox('')
    }

    const handleDeleteRow = (index: number | undefined) => {
        setValues(prev => ({
            ...prev,
            item: prev.item.filter((_, i) => i !== index)
        }))
    }

    const handleOnChangeValuesComboBox = (index: number | undefined, type: string) => {
        setValues(prev => ({
            ...prev,
            item: prev.item.map((item, i) =>
                i === index ? { ...item, type } : item
            )
        }))
    }

    const handleOnChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnChangeDescriptionTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnChangeQuestionTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setQuestions((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnChangeValuesQuestionTitle = (index: number | undefined, e: string) => {
        setValues((prev) => ({
            ...prev,
            item: prev.item.map((item, i) =>
                i === index ? { ...item, questionTitle: e } : item
            )
        }))
    }

    const handleOnChangeValuesOptions = (itemIndex: number, optionIndex: number, newValue: string) => {
        setValues((prev) => ({
            ...prev,
            item: prev.item.map((item, i) =>
                i === itemIndex
                    ? {
                        ...item, options: item.options?.map((option, j) =>
                            j === optionIndex ? newValue : option
                        )
                    } : item
            )
        }));
    };

    const handleValuesDeleteOption = (itemIndex: number, optionIndex: number) => {
        setValues(prev => ({
            ...prev,
            item: prev.item.map((item, i) =>
                i === itemIndex
                    ? {
                        ...item,
                        options: item.options?.filter((_, j) => j !== optionIndex)
                    }
                    : item
            )
        }));
    };

    const handleOnChangeValuesQuestionOptions = (index: number, e: string) => {
        setValuesOptions(prev => ({
            ...prev,
            [index]: e
        }))
    }

    const handleValuesAddOptions = (itemIndex: number) => {
        setValues(prev => ({
            ...prev,
            item: prev.item.map((item, i) =>
                i === itemIndex
                    ? {
                        ...item,
                        options: item.options
                            ? [
                                ...item.options.slice(0, item.options.indexOf('Other...') !== -1 ? item.options.indexOf('Other...') : item.options.length),
                                valuesoptions[i],
                                ...(item.options.indexOf('Other...') !== -1 ? item.options.slice(item.options.indexOf('Other...')) : [])
                            ]
                            : [valuesoptions[i]]
                    }
                    : item
            )
        }));
        setValuesOptions(prev => ({
            ...prev,
            [itemIndex]: ''
        }));
    };

    const handleValuesAddOtherOption = (itemIndex: number) => {
        setValues(prev => ({
            ...prev,
            item: prev.item.map((item, i) =>
                i === itemIndex
                    ? {
                        ...item,
                        options: item.options && !item.options.includes('Other...')
                            ? [...item.options, 'Other...']
                            : item.options || ['Other...']
                    }
                    : item
            )
        }));
        setValuesOptions(prev => ({
            ...prev,
            [itemIndex]: ''
        }));
    };

    const handleAddOptions = () => {
        // if(options === '') return alert('Please fill-up the required fields first')
        setQuestions((prev) => {
            const otherOptionIndex = prev.options.indexOf('Other...');
            let newOptions = [...prev.options];

            // If "Other..." is present, insert the new option before it
            if (otherOptionIndex !== -1) {
                newOptions = [
                    ...newOptions.slice(0, otherOptionIndex),
                    options,
                    ...newOptions.slice(otherOptionIndex),
                ];
            } else {
                // If "Other..." is not present, just add the new option at the end
                newOptions = [...newOptions, options];
            }

            return {
                ...prev,
                options: newOptions
            };
        });
        setOptions(''); // Clear the input field after adding the option
    };

    const handleDeleteOption = (index: number | undefined) => {
        setQuestions(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    }

    const handleAddOtherOption = () => {
        setQuestions((prev) => {
            // Check if "Other..." is already present in the options array
            if (!prev.options.includes('Other...')) {
                return {
                    ...prev,
                    options: [...prev.options, 'Other...'] // Add "Other..." at the end of the array
                };
            }
            return prev; // If "Other..." is already present, do nothing
        });
    };

    const handleOnChangeQuestionOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setOptions(value)
    }

    const handleOnChangeReadyQuestionOptions = (index: number | undefined, e: string) => {
        setQuestions((prev) => ({
            ...prev,
            options: prev.options.map((item, i) =>
                i === index ? e : item
            )
        }))
    }

    const handleOnChangeComboBox = (e: string) => {
        setComboBox(e)
        setQuestions(prev => ({
            ...prev,
            options: []
        }))
    }

    return (
        <>
            <form onSubmit={handleCreateForm} className="w-[80%] flex flex-col justify-between rounded-lg border">
                <div className="w-full px-4 py-3 border-b">
                    <h1 className='text-text font-semibold text-lg'>Configure Form</h1>
                </div>
                <div className="w-full py-2 flex flex-col gap-4">
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.9rem]'>Form Name</h1>
                        <Input
                            name='title'
                            onChange={handleOnChangeForm}
                            type='text'
                            placeholder='eg. Alumni Graduates Survey'
                            required
                        />
                    </div>
                    <div className="flex flex-col px-4 gap-1">
                        <h1 className='text-[.9rem]'>Brief Description</h1>
                        <Textarea name='description' onChange={handleOnChangeDescriptionTextArea} placeholder="Type your message here." required />
                    </div>
                    <div className="flex flex-col px-4 gap-4">
                        <div className="w-full flex justify-between items-center">
                            <h1 className='text-[.9rem]'>Data Entries</h1>
                        </div>
                        {
                            values.item.map((item, i) => (
                                <div key={i} className="flex flex-col px-4 gap-4">
                                    <div className="flex justify-between items-center">
                                        <div className="w-full flex gap-2 items-center">
                                            <Input
                                                name='questionTitle'
                                                value={item?.questionTitle}
                                                onChange={(e) => handleOnChangeValuesQuestionTitle(i, e.target.value)}
                                                type='text'
                                                placeholder='eg. What is the biggest country?'
                                                className='w-[60%]'
                                            />
                                            <div className="flex items-center gap-2">
                                                <ComboBox
                                                    type={(item) => handleOnChangeValuesComboBox(i, item || '')}
                                                    title='Type'
                                                    lists={Lists}
                                                    value={item.type}
                                                />
                                                <Button onClick={() => handleDeleteRow(i)} variant={`outline`} size={`sm`} type='button'>
                                                    Delete Row
                                                </Button>
                                            </div>

                                        </div>

                                    </div>
                                    {
                                        item.type === 'shortanswer' && (
                                            <textarea
                                                placeholder='Write your short answer here...'
                                                className='w-[60%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm'
                                                readOnly
                                            />
                                        )
                                    }
                                    {
                                        item.type === 'paragraph' && (
                                            <textarea
                                                placeholder='Write your long answer here...'
                                                className='w-[60%] px-2 py-2 bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm'
                                                readOnly
                                            />
                                        )
                                    }
                                    {
                                        item.type === 'date' && (
                                            <div className="w-full flex items-center gap-2">
                                                <h1 className='text-sm font-normal'>Date: </h1>
                                                <input type="date" readOnly className='text-center w-[25%] px-2 py-2 rounded-md border border-black/20 text-muted outline-none' />
                                            </div>

                                        )
                                    }
                                    {
                                        item.type === 'multiplechoice' && (
                                            <>
                                                {
                                                    item.options?.map((item, optionIndex) => (
                                                        <div key={optionIndex} className="w-full flex items-center gap-4">
                                                            <div className="w-[30%] px-4 py-1 flex items-center gap-2">
                                                                <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] rounded-full peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                                <input
                                                                    key={optionIndex}
                                                                    value={item}
                                                                    onChange={(e) => handleOnChangeValuesOptions(i, optionIndex, e.target.value)}
                                                                    type="text"
                                                                    placeholder={item === 'Other...' ? 'Other...' : `eg. Option ${i + 1}`}
                                                                    className={`w-full py-2 ${item === 'Other...' ? 'bg-transparent focus:border-blue-500 outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm' : 'hover:bg-blue-400/10 bg-transparent outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm'}`}
                                                                    readOnly={item === 'Other...'}
                                                                />
                                                            </div>
                                                            <X onClick={() => handleValuesDeleteOption(i, optionIndex)} size={20} className='hover:bg-black/20 cursor-pointer' />
                                                        </div>
                                                    ))
                                                }
                                                <div className="w-full flex items-center gap-2">
                                                    <div className="w-[30%] px-4 py-4 flex items-center gap-2">
                                                        <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] rounded-full peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                        <input value={valuesoptions[i]} onChange={(e) => handleOnChangeValuesQuestionOptions(i, e.target.value)} type="text" placeholder='eg. Option 1' className='w-full hover:bg-blue-400/10 px-2 text-md bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm py-2' />
                                                    </div>

                                                    <div className="flex gap-2 items-center">
                                                        {/* <input onClick={handleAddOptions} type="text" placeholder='Add option' className='w-[30%] hover:bg-blue-400/10 px-2 py-2 bg-transparent text-sm outline-none placeholder:text-sm border-b-[2px] border-black/50' readOnly /> */}
                                                        <Button onClick={() => handleValuesAddOptions(i)} variant={`outline`} type='button'>
                                                            Add option
                                                        </Button>
                                                        or
                                                        <Button onClick={() => handleValuesAddOtherOption(i)} variant={`outline`} type='button'>
                                                            add "Other"
                                                        </Button>
                                                    </div>
                                                </div>

                                            </>
                                        )
                                    }
                                    {
                                        item.type === 'dropdown' && (
                                            <>
                                                {
                                                    item.options?.map((item, optionIndex) => (
                                                        <div key={optionIndex} className="w-full flex items-center gap-4">
                                                            <div className="w-[30%] px-4 py-1 flex items-center gap-2">
                                                                <span className='text-sm'>{optionIndex + 1}.</span>
                                                                <input
                                                                    key={optionIndex}
                                                                    value={item}
                                                                    onChange={(e) => handleOnChangeValuesOptions(i, optionIndex, e.target.value)}
                                                                    type="text"
                                                                    placeholder={item === 'Other...' ? 'Other...' : `eg. Option ${optionIndex + 1}`}
                                                                    className={`w-full py-2 ${item === 'Other...' ? 'bg-transparent focus:border-blue-500 outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm' : 'hover:bg-blue-400/10 bg-transparent outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm'}`}
                                                                    readOnly={item === 'Other...'}
                                                                />
                                                            </div>
                                                            <X onClick={() => handleValuesDeleteOption(i, optionIndex)} size={20} className='hover:bg-black/20 cursor-pointer' />
                                                        </div>
                                                    ))
                                                }
                                                <div className="w-full flex items-center gap-2">
                                                    <div className="w-[30%] px-4 py-4 flex items-center gap-2">
                                                        <span className='text-sm'>{item.options?.length + 1}.</span>
                                                        <input value={valuesoptions[i]} onChange={(e) => handleOnChangeValuesQuestionOptions(i, e.target.value)} type="text" placeholder={`eg. Option ${item.options.length + 1}`} className='w-full hover:bg-blue-400/10 px-2 text-md bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm py-2' />
                                                    </div>

                                                    <div className="flex gap-2 items-center">
                                                        {/* <input onClick={handleAddOptions} type="text" placeholder='Add option' className='w-[30%] hover:bg-blue-400/10 px-2 py-2 bg-transparent text-sm outline-none placeholder:text-sm border-b-[2px] border-black/50' readOnly /> */}
                                                        <Button onClick={() => handleValuesAddOptions(i)} variant={`outline`} type='button'>
                                                            Add option
                                                        </Button>
                                                        {/* or
                                                        <Button onClick={() => handleValuesAddOtherOption(i)} variant={`outline`} type='button'>
                                                            add "Other"
                                                        </Button> */}
                                                    </div>
                                                </div>

                                            </>
                                        )
                                    }
                                    {
                                        item.type === 'checkbox' && (
                                            <>
                                                {
                                                    item.options?.map((item, optionIndex) => (
                                                        <div key={optionIndex} className="w-full flex items-center gap-4">
                                                            <div className="w-[30%] px-4 py-1 flex items-center gap-2">
                                                                <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                                <input
                                                                    key={optionIndex}
                                                                    value={item}
                                                                    onChange={(e) => handleOnChangeValuesOptions(i, optionIndex, e.target.value)}
                                                                    type="text"
                                                                    placeholder={item === 'Other...' ? 'Other...' : `eg. Option ${i + 1}`}
                                                                    className={`w-full py-2 ${item === 'Other...' ? 'bg-transparent focus:border-blue-500 outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm' : 'hover:bg-blue-400/10 bg-transparent outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm'}`}
                                                                    readOnly={item === 'Other...'}
                                                                />
                                                            </div>
                                                            <X onClick={() => handleValuesDeleteOption(i, optionIndex)} size={20} className='hover:bg-black/20 cursor-pointer' />
                                                        </div>
                                                    ))
                                                }
                                                <div className="w-full flex items-center gap-2">
                                                    <div className="w-[30%] px-4 py-4 flex items-center gap-2">
                                                        <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                        <input value={valuesoptions[i]} onChange={(e) => handleOnChangeValuesQuestionOptions(i, e.target.value)} type="text" placeholder='eg. Option 1' className='w-full hover:bg-blue-400/10 px-2 text-md bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm py-2' />
                                                    </div>

                                                    <div className="flex gap-2 items-center">
                                                        {/* <input onClick={handleAddOptions} type="text" placeholder='Add option' className='w-[30%] hover:bg-blue-400/10 px-2 py-2 bg-transparent text-sm outline-none placeholder:text-sm border-b-[2px] border-black/50' readOnly /> */}
                                                        <Button onClick={() => handleValuesAddOptions(i)} variant={`outline`} type='button'>
                                                            Add option
                                                        </Button>
                                                        or
                                                        <Button onClick={() => handleValuesAddOtherOption(i)} variant={`outline`} type='button'>
                                                            add "Other"
                                                        </Button>
                                                    </div>
                                                </div>

                                            </>
                                        )
                                    }
                                </div>
                            ))
                        }
                        <div className="w-full flex flex-col gap-2 justify-center items-start">
                            <div className="w-full flex justify-between items-center">
                                <div className="w-full flex gap-2 items-center">
                                    <Input
                                        name='questionTitle'
                                        value={questions.questionTitle}
                                        onChange={handleOnChangeQuestionTitle}
                                        type='text'
                                        placeholder='eg. What is the biggest country?'
                                        className='w-[70%]'
                                    />
                                    <ComboBox
                                        type={(item) => handleOnChangeComboBox(item || '')}
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
                                isComboBox === 'date' && (
                                    <div className="w-full flex items-center gap-2">
                                        <h1 className='text-sm font-normal'>Date: </h1>
                                        <input type="date" readOnly className='text-center w-[25%] px-2 py-2 rounded-md border border-black/20 text-muted outline-none' />
                                    </div>

                                )
                            }
                            {
                                isComboBox === 'multiplechoice' && (
                                    <>
                                        {
                                            questions.options?.map((item, i) => (
                                                <div key={i} className="w-full flex items-center gap-4">
                                                    <div className="w-[30%] px-4 py-1 flex items-center gap-2">
                                                        <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] rounded-full peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                        <input
                                                            value={item}
                                                            onChange={(e) => handleOnChangeReadyQuestionOptions(i, e.target.value)}
                                                            type="text"
                                                            placeholder={item === 'Other...' ? 'Other...' : `eg. Option ${i + 1}`}
                                                            className={`w-full py-2 ${item === 'Other...' ? 'bg-transparent focus:border-blue-500 outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm' : 'hover:bg-blue-400/10 bg-transparent outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm'}`}
                                                            readOnly={item === 'Other...'} // Make the "Other..." option read-only
                                                        />
                                                    </div>
                                                    <X onClick={() => handleDeleteOption(i)} size={20} className='hover:bg-black/20 cursor-pointer' />
                                                </div>
                                            ))
                                        }
                                        <div className="w-full flex items-center gap-2">
                                            <div className="w-[30%] px-4 py-4 flex items-center gap-2">
                                                <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] rounded-full peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                <input value={options} onChange={handleOnChangeQuestionOptions} type="text" placeholder={`eg. Option ${questions.options.length + 1}`} className='w-full hover:bg-blue-400/10 px-2 text-md bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm py-2' />
                                            </div>

                                            <div className="flex gap-2 items-center">
                                                {/* <input onClick={handleAddOptions} type="text" placeholder='Add option' className='w-[30%] hover:bg-blue-400/10 px-2 py-2 bg-transparent text-sm outline-none placeholder:text-sm border-b-[2px] border-black/50' readOnly /> */}
                                                <Button onClick={handleAddOptions} variant={`outline`} type='button'>
                                                    Add option
                                                </Button>
                                                or
                                                <Button onClick={handleAddOtherOption} variant={`outline`} type='button'>
                                                    add "Other"
                                                </Button>
                                            </div>
                                        </div>

                                    </>
                                )
                            }
                            {
                                isComboBox === 'dropdown' && (
                                    <>
                                        {
                                            questions.options?.map((item, i) => (
                                                <div key={i} className="w-full flex items-center gap-4">
                                                    <div className="w-[30%] px-4 py-1 flex items-center gap-2">
                                                        <span className='text-sm'>{i + 1}.</span>
                                                        <input
                                                            value={item}
                                                            onChange={(e) => handleOnChangeReadyQuestionOptions(i, e.target.value)}
                                                            type="text"
                                                            placeholder={item === 'Other...' ? 'Other...' : `eg. Option ${i + 1}`}
                                                            className={`w-full py-2 ${item === 'Other...' ? 'bg-transparent focus:border-blue-500 outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm' : 'hover:bg-blue-400/10 bg-transparent outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm'}`}
                                                            readOnly={item === 'Other...'} // Make the "Other..." option read-only
                                                        />
                                                    </div>
                                                    <X onClick={() => handleDeleteOption(i)} size={20} className='hover:bg-black/20 cursor-pointer' />
                                                </div>
                                            ))
                                        }
                                        <div className="w-full flex items-center gap-2">
                                            <div className="w-[30%] px-4 py-4 flex items-center gap-2">
                                                <span className='text-sm'>{questions.options.length + 1}.</span>
                                                <input value={options} onChange={handleOnChangeQuestionOptions} type="text" placeholder={`eg. Option ${questions.options.length + 1}`} className='w-full hover:bg-blue-400/10 px-2 text-md bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm py-2' />
                                            </div>

                                            <div className="flex gap-2 items-center">
                                                {/* <input onClick={handleAddOptions} type="text" placeholder='Add option' className='w-[30%] hover:bg-blue-400/10 px-2 py-2 bg-transparent text-sm outline-none placeholder:text-sm border-b-[2px] border-black/50' readOnly /> */}
                                                <Button onClick={handleAddOptions} variant={`outline`} type='button'>
                                                    Add option
                                                </Button>
                                                {/* or
                                                <Button onClick={handleAddOtherOption} variant={`outline`} type='button'>
                                                    add "Other"
                                                </Button> */}
                                            </div>
                                        </div>

                                    </>
                                )
                            }
                            {
                                isComboBox === 'checkbox' && (
                                    <>
                                        {
                                            questions.options?.map((item, i) => (
                                                <div key={i} className="w-full flex items-center gap-4">
                                                    <div className="w-[30%] px-4 py-1 flex items-center gap-2">
                                                        <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                        <input
                                                            value={item}
                                                            onChange={(e) => handleOnChangeReadyQuestionOptions(i, e.target.value)}
                                                            type="text"
                                                            placeholder={item === 'Other...' ? 'Other...' : `eg. Option ${i + 1}`}
                                                            className={`w-full py-2 ${item === 'Other...' ? 'bg-transparent focus:border-blue-500 outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm' : 'hover:bg-blue-400/10 bg-transparent outline-none border-b-[2px] border-black/30 placeholder:text-sm text-sm'}`}
                                                            readOnly={item === 'Other...'} // Make the "Other..." option read-only
                                                        />
                                                    </div>
                                                    <X onClick={() => handleDeleteOption(i)} size={20} className='hover:bg-black/20 cursor-pointer' />
                                                </div>
                                            ))
                                        }
                                        <div className="w-full flex items-center gap-2">
                                            <div className="w-[30%] px-4 py-4 flex items-center gap-2">
                                                <span className="w-6 h-5 inline-block mr-2 border-gray-300 border-[3px] peer-checked:bg-blue-500 peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span>
                                                <input value={options} onChange={handleOnChangeQuestionOptions} type="text" placeholder={`eg. Option ${questions.options.length + 1}`} className='w-full hover:bg-blue-400/10 px-2 text-md bg-transparent outline-none border-b-[2px] border-black/50 placeholder:text-sm py-2' />
                                            </div>

                                            <div className="flex gap-2 items-center">
                                                {/* <input onClick={handleAddOptions} type="text" placeholder='Add option' className='w-[30%] hover:bg-blue-400/10 px-2 py-2 bg-transparent text-sm outline-none placeholder:text-sm border-b-[2px] border-black/50' readOnly /> */}
                                                <Button onClick={handleAddOptions} variant={`outline`} type='button'>
                                                    Add option
                                                </Button>
                                                {/* or
                                                <Button onClick={handleAddOtherOption} variant={`outline`} type='button'>
                                                    add "Other"
                                                </Button> */}
                                            </div>
                                        </div>

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