import {Outlet} from "react-router-dom";

export const Generate = () => {
    return(
        <div className="flex-col">
            <Outlet />
        </div>
    )
}