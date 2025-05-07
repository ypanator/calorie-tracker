import { Routes, Route, Link } from "react-router-dom";

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExercisePage from './pages/ExercisePage';
import FoodPage from './pages/FoodPage';
import UserPage from './pages/UserPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    <>
      <Navbar>
        <Link to="/"          >Home</Link>
        <Link to="/exercise"  >Exercises</Link>
        <Link to="/food"      >Foods</Link>
        <Link to="/user"      >Profile</Link>
        <Link to="/auth"      >Log in</Link>
      </Navbar>
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/exercise"   element={<ExercisePage />} />
        <Route path="/food"       element={<FoodPage />} />
        <Route path="/user"       element={<UserPage />} />
        <Route path="/auth"       element={<AuthPage />} />
        <Route path="*"           element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
