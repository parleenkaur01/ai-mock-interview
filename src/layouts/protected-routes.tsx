import { useAuth } from "@clerk/clerk-react";
const ProtectedRoutes =({children}:{children:React.ReactNode})=>{

    const {isLoaded,isSignedIn}= useAuth();

    if(!isLoaded){
        return <LoaderPage />
    }
    return<div> ProtectRoutes</div>;
    
};
export default ProtectedRoutes;
