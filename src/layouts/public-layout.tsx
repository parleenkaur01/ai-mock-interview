import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import {Outlet} from "react-router-dom";
import AuthHandler  from "@/handlers/auth-handler";
export const PublicLayout=()=>{
    return(
        <div className="w-full">
            {/*Handler to store the user data */}
            <AuthHandler />
            <Header />

            <Outlet />

            <Footer />

        </div>
    )
}