import { waveform } from 'ldrs'
import Person from '@/assets/sapiens.svg'
import { useState } from 'react'

waveform.register()

export default function Loading() {
    const [isLoading, setLoading] = useState<boolean>(false)
    return (
        <>
            {isLoading ? <div className="fixed top-0 left-0 w-full h-screen bg-background flex justify-center items-center z-[1]">
                <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center">
                    <l-waveform
                        size="20"
                        stroke="2.5"
                        speed="1"
                        color="black"
                    ></l-waveform>
                    <h1 className='text-lg'>Wait a moment, I am loading...</h1>
                </div>
            </div > :
                <div className="fixed top-0 left-0 w-full h-screen bg-background flex justify-center items-center z-[1]">
                    <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center gap-4">
                        <div className="w-[20%] flex justify-center items-center">
                            <img src={Person} alt="Image Background" className="object-contain w-full h-full" loading='lazy' onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
                        </div>
                        <h1 className='text-md font-medium'>Wait, I'm loading the map...</h1>
                        <l-waveform
                            size="20"
                            stroke="2.5"
                            speed="1"
                            color="black"
                        ></l-waveform>
                    </div>
                </div >
            }
        </>
    )
}
