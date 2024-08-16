import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";


export default function Tracer() {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center bg-yellow-200">
                <SearchDocker />
            </div>
        </>
    )
}


const SearchDocker = () => {
    return (
        <>
            <div className="w-1/4 h-[8dvh] p-2 border-[2px] border-black/10 bg-background absolute top-4 left-[50%] translate-x-[-50%] flex justify-start items-center gap-2 rounded-full">
                <Button variant={`default`} size={`icon`} className="h-full w-10">
                    <IoSearch className="scale-[1.3]" />
                </Button>
                <div className="flex flex-col">
                    <label htmlFor="search" className="text-[.7rem] font-medium">
                        Search
                    </label>
                    <input type="text" id="search" className="text-text placeholder:text-black/30 placeholder:text-sm placeholder:font-semibold bg-transparent text-sm outline-none" placeholder="Search by keywords..." />
                </div>
            </div>
        </>
    )
}