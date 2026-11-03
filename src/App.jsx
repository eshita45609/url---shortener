import React from "react";
import "./url-shortener/frontend/components/Global.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./url-shortener/frontend/components/Login";
import SignUp from "./url-shortener/frontend/components/SignUp";
import Dashboard from "./url-shortener/frontend/components/Dashboard";
import LandingPage from "./url-shortener/frontend/components/LandingPage";
import ErrorPage from "./url-shortener/frontend/components/ErrorPage";
import ProtectedRoute from "./url-shortener/frontend/components/ProtectedRoute";





function  App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/dashboard"
                 element={
                 <ProtectedRoute>
                     <Dashboard/>   
                </ProtectedRoute>
            }
        />
                <Route path="/my-links" 
                element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }
            />
                <Route path="*" element={<ErrorPage/>}/>
            </Routes>   
        </BrowserRouter>
    )
}


export default App;

