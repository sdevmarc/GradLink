import { IFCChildren } from "@/interface/index";

export default function HeadSection({ title, description }: IFCChildren) {
    return (
        <>
            <section className="w-full h-[100px] flex flex-col justify-center items-start gap-2 px-8 border-b-[0.7px] border-black/20">
                <h1 className="text-text font-semibold text-xl">
                    {title}
                </h1>
                <p className="text-text font-light text-sm">
                    {description}
                </p>
            </section>
        </>
    )
}
