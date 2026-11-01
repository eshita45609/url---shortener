import React from "react";
import {Link2} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import "./AuthCard.css";





function AuthCard({title, description, children,buttonText, bottomText, bottomLinkText, bottomLink,onSubmit}) {
    return (
        <section className="right-section">
            <div className="login-card-container">
                <div className="login-logo">
                    <Link2 className="login-logo-icon"/>
                    <span>Linkly</span>
                </div>
                <h2 className="login-heading">{title}</h2>
                <p className="login-description">{description}</p>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit?.(e);
                }}>
                    {children}
                
            
                <button className="login-buttons">{buttonText}</button>
                <div className="or-divider">
                    <span className="lines"></span>
                    <span className="or">OR</span>
                    <span className="lines"></span>
                </div>

                <p className="signup">{bottomText}{" "}
                    <a className="signup-link" href={bottomLink}>{bottomLinkText}</a>
                </p>
                


            </form>
            </div>
            
        </section>
    )
}




export default AuthCard;