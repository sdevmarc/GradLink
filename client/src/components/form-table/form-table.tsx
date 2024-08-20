import { DropDownMenu } from "../dropdown-menu";
import FormTableToolbar from "./form-table-toolbar";

export default function FormTable() {
    const items = Array(7).fill(0);
    return (
        <div className="space-y-4 pb-[13rem]">
            <FormTableToolbar />
            <div className="rounded-md border flex flex-wrap gap-4 p-4">
                {
                    items.map((_, i) => (
                        <div key={i} className="w-[calc(100%-70%)] h-[10rem] bg-muted rounded-lg flex flex-col justify-between p-4 shadow-[_0_7px_10px_-3px_rgba(0,0,0,0.1)]">
                            <div className="flex justify-between items-center">
                                <h1 className="text-lg font-semibold line-clamp-1">
                                    ALUMNI GOOGLE FORM
                                </h1>
                                <DropDownMenu />
                            </div>
                            <p className="line-clamp-4 text-[.95rem] font-normal">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos esse porro error, excepturi veritatis animi fugit earum veniam consequuntur vel temporibus odit facilis, quia officiis incidunt, cumque nemo maxime minima.
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
