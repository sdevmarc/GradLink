import { bouncy } from 'ldrs'
import { useTheme } from '@/hooks/useTheme'

bouncy.register()

export default function Loading() {
    const { theme } = useTheme()

    return (
        <>
            <div className="absolute top-0 left-0 w-full h-screen bg-background flex justify-center items-center z-[1]">
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
            </div >
        </>
    )
}
