import {Container} from "@/components/ui/container";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import {Outlet} from "react-router-dom";

export const MainLayout=()=>{
    return(
        <div className="flex flex-col h-screen">
           
            <Header />

            <Container className="flex-grow">
                <main className="flex-grow">
                    <Outlet />
                </main>
            </Container>

            <Footer />

        </div>
    )
}