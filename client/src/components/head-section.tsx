import { IFCChildren } from "@/interface/index";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function HeadSection({ children }: IFCChildren) {
    return (
        <>
            <section className="w-full py-2 flex flex-col justify-center items-start gap-5">
                {children}
            </section>
        </>
    )
}

export const SubHeadSectionDetails = ({ title, description }: IFCChildren) => {
    return (
        <div className="flex flex-col gap-2 px-4">
            <h1 className="text-text font-semibold text-lg">
                {title}
            </h1>
            <p className="text-text font-light text-sm">
                {description}
            </p>
        </div>
    )
}

export const BackHeadSection = () => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }
    return (
        <button onClick={handleBack} className="flex items-center gap-2 h-9 px-4 rounded-lg hover:bg-muted">
            <IoIosArrowBack /> Back
        </button>
    )
}
