import React from "react";
import "./Login.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AuthCard from "./AuthCard";
import {Link2,TrendingUp, Shield, Mail,Lock, Eye} from "lucide-react";
import { useNavigate } from "react-router-dom";
import  {useState} from "react";





function Login() {  

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin(email, password) {
        setError("");
        setLoading(true);

        try {
            console.log("Login data:" , {
                email,
                password: password ? "[hidden]" : "",
            })
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Unable to log in.Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main-page">
            <Navbar/>

            <main className="hero-section">
                <HeroSection    
                    badge="Welcome back!"
                    title={
                        <>
                            Glad to see you <span>again!</span>
                        </>
                    }
    
                    description="Login to continue shortening,managing
                    and tracking your links-- all in one place."

                    features={[
                        {
                            icon: Link2,
                            title: "Access your links",
                            description: "view and manage all your shortened links.",
                        },

                        {
                            icon: TrendingUp,
                            title: "Track perfomance",
                            description: "Monitor clicks and understand your audience.",
                        },

                        {
                            icon: Shield,
                            title: "Your data stays safe",
                            description:"Your links and data are securely protected",
                        },
                        

                    ]}
                    />

                
                    <AuthCard 
                        title="Login to your account."
                        description="Enter your credentials to continue"
                        buttonText="Login"
                        bottomText="Dont have an account?"
                        bottomLinkText="Sign up"
                        bottomLink="/signup"
                        onSubmit={(e) => {
                            const form = e.currentTarget;
                            const formData = new FormData(form);

                            const email = formData.get("email");
                            const password = formData.get("password");

                            console.log("Email value:", email);
                            console.log("password exist:" , password ? "Entered" : "Empty");

                            handleLogin(email, password);
                        }}
                    >
                        
                        
                        <div className="input-fields">
                            <label htmlFor="login-email">Email</label>
                         <div className="input-container">
                            <Mail className="input-icon"/>

                            <input className="input-element" type="email" id="login-email" name="email" placeholder="Enter your email"/>
                        </div>   
                        </div>

                        <div className="input-fields">
                            <label htmlFor="login-password">Password</label>

                            <div className="input-container">
                                <Lock className="input-icon"/>

                                <input className="input-element" type={showPassword ? "text" : "password"} id="login-password" name="password" placeholder="Enter your password"/>
                                <Eye className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{cursor: "pointer"}}
                                />
                            
                            </div>


                                {error && <p className="auth-error">{error}</p>}


                            
                        </div>

                        
                        
                        </AuthCard>    
                    
                    
                    
                
            </main>
        </div>
    )
}


export default Login;