import { IFCChildren } from "@/interface"

export default function MainTable({ children }: IFCChildren) {
    return (
        <>
            <div className="w-[80%] flex flex-col justify-between">
                {children}
            </div>
        </>
    )
}