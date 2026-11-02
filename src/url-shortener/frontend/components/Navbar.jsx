import React from "react";
import "./Navbar.css";
import {Link2} from "lucide-react";
import {Link} from "react-router-dom";


function Navbar() {
    return (
        <header>
                <nav>
                    <div className="logo">
                        <Link2 className="logo-icon"/>
                        <span>Linkly</span>
                    </div>

                    <div className="nav-link">
                        <Link to="/">Home</Link>
                    </div>

                    <div className="buttons">
                        <Link className="login-button" to="/login">Login</Link>
                        <Link className="start-button" to="/signup">
                            Get started
                        </Link>
                    </div>
                </nav>
            </header>
    )
}

export default Navbar;