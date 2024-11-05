import { IFCChildren } from "@/interface"
import { cn } from "@/lib/utils"

export default function MainTable({ children, className }: IFCChildren) {
    return (
        <>
            <div className={`w-[80%] flex flex-col justify-between ${cn(className)}`}>
                {children}
            </div>
        </>
    )
}