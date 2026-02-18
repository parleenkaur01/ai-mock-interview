import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {PublicLayout} from '@/layouts/public-layout';
import HomePage from '@/routes/home';
import AuthenticationLayout from '@/layouts/auth-layout';
import { SignInPage } from './routes/sign-in';
import { SignUpPage} from './routes/sign-up';

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
         
      </Routes>
    </Router>
  );
}

export default App;