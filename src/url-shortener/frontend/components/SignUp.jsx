import React from "react";
import "./SignUp.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import { LockKeyhole, TrendingUp, Link2 ,Mail,UserRound, Eye} from "lucide-react";
import AuthCard from "./AuthCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



function SignUp() {

    const navigate = useNavigate();

    const [error, setError] = useState("");
    
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [passwordWarning, setPasswordWarning] = useState("");
    

    async function handleSignup(name, email, password) {
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:3000/auth/signup" , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({name, email, password}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            navigate("/login");
        } catch (err) {
            setError(err.message || "Unable to signup. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
    
        <div className="main-page">
            <Navbar/>

                <main className="hero-section">
                <HeroSection    
                    badge="Create your account"
                    title={
                        <>
                            Join linkly <span>today!</span>
                        </>
                    }
    
                    description="Create an account to start shortening, tracking
                    and managing your links -- all in one place."

                    features={[
                        {
                            icon: Link2,
                            title: "Shorten & customize",
                            description: "Create short links with custom aliases.",
                        },

                        {
                            icon: TrendingUp,
                            title: "Track perfomance",
                            description: "Get insights with simnple analytics.",
                        },

                        {
                            icon: LockKeyhole,
                            title: "Your data always safe",
                            description:"Secure private and accessible only to you",
                        },
                        

                    ]}

                    />

                
         {              <AuthCard 
                        title="Create your account."
                        description="Get started for free and make your links smarter"
                        buttonText="Sign up"
                        bottomText="Already have an account?"
                        bottomLinkText="Login"
                        bottomLink="/login"
                        onSubmit={(e) => {
                            const form = e.currentTarget;
                            const formData = new FormData(form);

                            const name = formData.get("name");
                            const email = formData.get("email");
                            const password = formData.get("password");

                            

                            handleSignup(name, email, password);
                        }}
                    > 

                          <div className="input-fields">
                            <label htmlFor="login-name">Name</label>
                            <div className="input-container">
                                 <UserRound className="input-icon"/> 
                                <input type="name" placeholder="Enter your name" name="name" className="input-element"/>
                            </div>
                        </div>
                        
                         <div className="input-fields">
                            <label htmlFor="login-email">Email</label>
                         <div className="input-container">
                            <Mail className="input-icon"/>

                            <input className="input-element" type="email" name="email"  placeholder="Enter your email"/>
                        </div>   
                        </div> 

                         <div className="input-fields">
                            <label htmlFor="login-password">Create your password</label>

                            <div className="input-container">
                                <LockKeyhole className="input-icon"/>

                                <input className="input-element" 
                                type={showPassword ? "text" : "password"} 
                                name="password" placeholder="Enter your password"
                                minLength={8}
                                onChange={(e) => {
                                    if (e.target.value.length > 0 && e.target.value.length < 8) {
                                        setPasswordWarning("Password must be atleast 8 characters long");
                                    } else {
                                        setPasswordWarning("");
                                    }
                                }}
                            />

                                 <Eye className="eye-icon" 
                                 onClick={() => setShowPassword(!showPassword)}
                                 style={{ cursor: "pointer"}}
                                 /> 

                            </div>

                                {passwordWarning && (
                                    <p className="auth-error">{passwordWarning}</p>
                                )}
                        </div>       
                 </AuthCard>     }
                    
               </main>
        </div>
 )   
}



export default SignUp;