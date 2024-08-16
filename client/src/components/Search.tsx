import React from 'react'
import { Button } from './ui/button'

export default function Search() {
    return (
        <>
            <div className="w-full h-full flex justify-between items-center">
                <div className="h-full flex justify-center items-center gap-2">
                    <input type="text" placeholder='Search by keywords' className='w-[20rem] h-full rounded-md px-2 bg-input text-text text-sm placeholder:text-black/40 placeholder:font-normal placeholder:text-sm' />
                    <Button variant={`default`} className='bg-muted text-text font-normal'>
                        Filter
                    </Button>
                    <Button variant={`default`} className='bg-muted text-text font-normal'>
                        Semester
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant={`default`}>
                        Add Student
                    </Button>
                    <Button variant={`default`} className='bg-muted text-text font-normal'>
                        Export
                    </Button>
                </div>
            </div>
        </>
    )
}
