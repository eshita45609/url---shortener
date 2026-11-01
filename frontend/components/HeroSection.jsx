import React from "react";
import "./HeroSection.css";
import { Sparkles } from "lucide-react";




function HeroSection({badge, title, description, features}) {
    return (
        <section className="left-section">
                <div className="welcome">
                    <Sparkles className="star"/>
                    <span>{badge}</span>
                </div>

                <h1>{title}</h1>
                <p className="description">{description}</p>

                {features.map((feature, index) => (
                    <div className="feature-row" key={index}>
                        <div className="icon-container">
                            {React.createElement(feature.icon, {
                                className:"feature-icons",
                            })}
                             
                        </div>

                        <div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>  
                    </div>
                ))}


        </section>
    )
}

export default HeroSection;