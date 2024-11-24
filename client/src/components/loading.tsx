import SOGS from '@/assets/SMU Unit Emblem - SoGS 1by1.png'
import { useState } from 'react'
import { bouncy } from 'ldrs'
import { useTheme } from '@/hooks/useTheme'

bouncy.register()

export default function Loading() {
    const [isLoading, setLoading] = useState<boolean>(false)
    const { theme } = useTheme()


    return (
        <>
            {isLoading ? <div className="absolute top-0 left-0 w-full h-screen bg-background flex justify-center items-center z-[1]">
                <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center">
                    {
                        theme === 'light' ?
                            <l-bouncy
                                size="45"
                                speed="1.75"
                                color="black"
                            ></l-bouncy>
                            :
                            <l-bouncy
                                size="45"
                                speed="1.75"
                                color="white"
                            ></l-bouncy>
                    }
                </div>
            </div > :
                <div className="absolute top-0 left-0 w-full h-screen bg-background flex justify-center items-center z-[1]">
                    <div className="w-full h-full max-w-[90rem] px-4 flex flex-col justify-center items-center gap-8">
                        <div className="w-[20%] flex justify-center items-center">
                            <img src={SOGS} alt="Image Background" className="object-contain w-full h-full" loading='lazy' onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
                        </div>
                        {
                            theme === 'light' ?
                                <l-bouncy
                                    size="45"
                                    speed="1.75"
                                    color="black"
                                ></l-bouncy>
                                :
                                <l-bouncy
                                    size="45"
                                    speed="1.75"
                                    color="white"
                                ></l-bouncy>
                        }
                    </div>
                </div >
            }
        </>
    )
}
