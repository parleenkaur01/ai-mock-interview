import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {PublicLayout} from '@/layouts/public-layout';
import HomePage from '@/routes/home';
import AuthenticationLayout from '@/layouts/auth-layout';
import { SignInPage } from './routes/sign-in';
import { SignUpPage} from './routes/sign-up';
import ProtectRoutes from '@/layouts/protected-routes';
import {MainLayout} from '@/layouts/main-layout';
import {Generate} from '@/components/ui/generate';
import {Dashboard} from '@/routes/dashboard';
import { CreateEditPage } from '@/routes/create-edit-page';

const App=()=>{
  return (
    <Router>
      <Routes>
        {/*Public Routes*/}
        <Route element={<PublicLayout />}>
          <Route index element ={<HomePage />}/>
        </Route>

        {/*Authenticaton Layout*/}
        <Route element={<AuthenticationLayout/>}>
          <Route path="/signin/*" element ={<SignInPage />}/>
          <Route path="/signup/*" element ={<SignUpPage />}/>
        </Route>


         {/*Protected Routes*/}
        <Route 
          element={
            <ProtectRoutes>
              <MainLayout />
            </ProtectRoutes>
          } 
          >
            <Route path="/generate" element={<Generate />} >
              <Route index element={<Dashboard />} />
              <Route path=":interviewId" element={<CreateEditPage />} />
            </Route>


        </Route>

      </Routes>
    </Router>
  );
}

export default App;