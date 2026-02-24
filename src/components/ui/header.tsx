import {useAuth} from "@clerk/clerk-react";
import {cn} from "@/lib/utils";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";




const Header =()=>{
    const{userId} = useAuth();


    return (
        <header className={cn("w-full border-b duration-150 transition-all ease-in-out  ")}>
            <Container>
                <div className="flex items-center gap-4 w-full">
                    {/*Logo*/}
                    <LogoContainer/>

                    {/*Navigation*/}
                    <nav className="hidden md:flex items-center gap-3">
                        <NavigationRoutes />
                    </nav>
                    
                    

                    {/*Profile*/}
                </div>
            </Container>
        </header>


    )
   
};

export default Header;