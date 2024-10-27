import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Combobox } from "./combobox"
import { useNavigate } from "react-router-dom"

interface IComponents {
    btnTitle?: string
    btnContinue?: React.MouseEventHandler<HTMLButtonElement>
    title: string
    description: string
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
    className?: string
    disabled?: boolean
    type: "alert" | "default" | "input" | "conditional" | null | undefined
    isDialog?: boolean
    setDialog?: (e: boolean) => void
    icon?: React.ReactNode
    combovalue?: string
    setCombobox?: (e: string) => void
}

export function AlertDialogConfirmation({
    btnTitle,
    title,
    description,
    btnContinue,
    variant,
    className,
    disabled,
    type = "default",
    isDialog,
    setDialog,
    icon,
    combovalue,
    setCombobox
}: IComponents) {
    const navigate = useNavigate()
    const semester = [
        { label: 'First', value: '1' },
        { label: 'Second', value: '2' },
        { label: 'Third', value: '3' }
    ]

    const renderContent = () => {
        switch (type) {
            case "alert":
                return (
                    <AlertDialog open={isDialog} onOpenChange={(open) => setDialog && setDialog(open)}>
                        <AlertDialogTitle className="sr-only"></AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                        <AlertDialogContent className="sm:max-w-[425px]">
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
                                    <Button onClick={btnContinue} disabled={disabled} variant={variant} size="sm" className={cn(className)}>
                                        {btnTitle}
                                    </Button>
                                </div>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            case "conditional":
                return (
                    <AlertDialog open={isDialog} onOpenChange={(open) => setDialog && setDialog(open)}>
                        <AlertDialogTitle className="sr-only"></AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                        <AlertDialogContent className="sm:max-w-[425px]">
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

                                <div className="w-full flex gap-4">
                                    <Button
                                        onClick={() => setDialog && setDialog(false)}
                                        disabled={disabled}
                                        variant={`outline`}
                                        className={cn(className)}
                                        size="sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={btnContinue} disabled={disabled} variant={variant} size="sm" className={cn(className)}>
                                        {btnTitle}
                                    </Button>
                                </div>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            case "input":
                return (
                    <AlertDialog open={isDialog} onOpenChange={(open) => setDialog && setDialog(open)}>
                        <AlertDialogTitle className="sr-only"></AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                        <AlertDialogContent className="sm:max-w-[425px]">
                            <div className="w-full flex flex-col justify-center items-center gap-12">
                                <div className="flex flex-col items-center gap-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <h1 className="text-lg text-center font-semibold">
                                            {title}
                                        </h1>
                                        <p className="text-md text-center font-normal">
                                            {description}
                                        </p>
                                    </div>

                                    <Combobox
                                        className="w-[300px]"
                                        lists={semester}
                                        placeholder={`Select semester...`}
                                        setValue={(item) => setCombobox && setCombobox(item)}
                                        value={combovalue ?? ''}
                                    />
                                </div>
                                <div className="w-full flex items-center justify-between gap-4">
                                    <Button onClick={() => navigate(-1)} disabled={disabled} variant={`ghost`} size="sm" className={cn(className)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={btnContinue} disabled={disabled} variant={variant} size="sm" className={cn(className)}>
                                        {btnTitle}
                                    </Button>
                                </div>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            case "default":
                return (
                    <AlertDialog open={isDialog} onOpenChange={(open) => setDialog && setDialog(open)}>
                        <AlertDialogTrigger asChild>
                            <Button disabled={disabled} variant={variant} size="sm" className={cn(className)}>
                                {btnTitle}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{title}</AlertDialogTitle>
                                <AlertDialogDescription className="text-black/80">{description}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button onClick={btnContinue} variant={`default`} size={`default`}>
                                    Continue
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog >
                );
            default:
                return null;
        }
    };

    return renderContent();
}
