import React from "react";
import "./ErrorPage.css";
import { Link2, FileText, House } from "lucide-react";
import {  useNavigate } from "react-router-dom";




function ErrorPage() {
const navigate = useNavigate();

    return (
        <div className="error-page">
          <div className="error-navbar">
            <Link2 className="link"/>
            <h1>Linkly</h1>
          </div>
      
            <main className="error-hero">
                <div>
                    <FileText className="fileText"/>
                    <h1>Page not found</h1>
                    <p>The page you're looking for doesn't exist or may have been moved</p>
                </div>  

            
                <button className="home-button" onClick={() => navigate("/")}>
                    <House className="house"/>
                   <span>Go to Home</span>
                </button>
           
            </main>
        </div>
    )
}


export default ErrorPage;