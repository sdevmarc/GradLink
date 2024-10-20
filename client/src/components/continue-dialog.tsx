import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface IComponents {
    isDialog: boolean
    title: string
    description: string
    setDialog: (e: boolean) => void
    icon: React.ReactNode
    btnContinue?: React.MouseEventHandler<HTMLButtonElement>
}

export default function ContinueDialog({ isDialog, title, description, setDialog, icon, btnContinue }: IComponents) {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <>
            <Dialog open={isDialog} onOpenChange={(open) => setDialog && setDialog(open)}>
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
                                <Button variant={`default`} onClick={btnContinue}>
                                    Continue
                                </Button>
                            </div>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
