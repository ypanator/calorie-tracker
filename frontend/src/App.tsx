import { Routes, Route, Link } from "react-router-dom";
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import ExercisePage from './pages/ExercisePage';
import FoodPage from './pages/FoodPage';
import UserPage from './pages/UserPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

import { Box, HStack } from "@chakra-ui/react";
import { CgGym } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";


export default function App() {
    return (
    <HStack spacing={0} minHeight="100vh" minWidth="100vw" align="flex-start" justify="flex-start">
        <Navbar>
            <FaHome /><Link      to="/"          >Home</Link>
            <CgGym /><Link       to="/exercise"  >Exercises</Link>
            <MdFastfood /><Link  to="/food"      >Foods</Link>
            <FaUser /><Link      to="/user"      >Profile</Link>
            <FaLock /><Link      to="/auth"      >Log in</Link>
        </Navbar>
        <Box as="main" flex="1">
        <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/exercise"  element={<ExercisePage />} />
            <Route path="/food"      element={<FoodPage />} />
            <Route path="/user"      element={<UserPage />} />
            <Route path="/auth"      element={<AuthPage />} />
            <Route path="*"          element={<NotFoundPage />} />
        </Routes>
        </Box>
    </HStack>
    )
};