import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import NavbarLink from "./components/NavbarLink.tsx";
import { Box, HStack } from "@chakra-ui/react";

import HomePage from './pages/HomePage';
import ExercisePage from './pages/ExercisePage';
import FoodPage from './pages/FoodPage';
import UserPage from './pages/UserPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

import { CgGym } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";


export default function App() {
    return (
    <HStack spacing={0} minHeight="100vh" minWidth="100vw" align="stretch" justify="flex-start">
        <Navbar>
            <NavbarLink Icon={FaHome}      to="/"          text="Home" />
            <NavbarLink Icon={CgGym}      to="/exercise"  text="Exercises" />
            <NavbarLink Icon={MdFastfood} to="/food"      text="Foods" />
            <NavbarLink Icon={FaUser}     to="/user"      text="Profile" />
            <NavbarLink Icon={FaLock}     to="/auth"      text="Log in" />
        </Navbar>
        <Box as="main" flex="1" minHeight="100vh">
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