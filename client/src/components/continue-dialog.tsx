import { useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

interface IComponents {
    trigger: boolean
    title: string
    description: string
    onClose: () => void
    icon: React.ReactNode
}

export default function ContinueDialog({ trigger, title, description, onClose, icon }: IComponents) {
    const navigate = useNavigate()

    const handleGoBack = () => {
        onClose()
        navigate(-1)
    }

    const handleContinue = () => {
        onClose()
    }
    return (
        <>
            <Dialog open={trigger} onOpenChange={(open) => !open && onClose()}>
                <DialogTitle className="sr-only"></DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="w-full flex flex-col justify-center items-center gap-12">
                        <div className="flex flex-col items-center gap-4">
                            {icon}
                            <div className="flex flex-col items-center">
                                <h1 className="text-lg text-center font-semibold">
                                    {title}
                                </h1>
                                <p className="text-md text-center font-normal">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex items-center flex-col gap-4">
                            <h1 className=" text-center text-sm">Select continue to resume your activity.</h1>
                            <div className="w-full flex items-center justify-evenly">
                                <button onClick={handleGoBack} className="px-6 text-sm py-3 hover:bg-red-600/60 font-medium text-primary duration-200 ease-in-out rounded-xl">
                                    Cancel
                                </button>
                                <DialogClose asChild>
                                    <button onClick={handleContinue} className="px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-black/60 duration-200 ease-in-out rounded-xl">
                                        Continue
                                    </button>
                                </DialogClose>
                            </div>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
