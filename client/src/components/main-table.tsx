import { IFCChildren } from "@/interface"

export default function MainTable({ children }: IFCChildren) {
    return (
        <>
            <div className="w-[80%] h-full flex flex-col justify-between">
                {children}
            </div>
        </>
    )
}