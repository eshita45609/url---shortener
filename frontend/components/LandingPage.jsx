import React from "react";
import "./LandingPage.css";
import Navbar from "./Navbar";
import { useState } from "react";
import { Link2, Sparkles, ArrowRight, AtSign, CalendarDays, Copy, Zap, ChartNoAxesColumn, PenLine, MousePointerClick} from "lucide-react";






function LandingPage() {

    const [longUrl, setLongUrl] = useState("");

    const [customAlias, setCustomAlias] = useState("");

    const [expiryDate, setExpiryDate] = useState("7");

    const [shortUrl, setShortUrl] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [copied, setCopied] = useState(false);


    async function handleShortenUrl(event) {
        event.preventDefault();

        setError("");
        setShortUrl("");
        setCopied(false);
        setLoading(true);

        try {
            if (!longUrl.trim()) {
                throw new Error("Please enter a URL");
            }

            const response = await fetch("http://localhost:3000/url/guest/shorten", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    longUrl,
                    customAlias,
                    expiryDate: expiryDate === "never" ? 
                    null : new Date(Date.now() + Number(expiryDate) * 24 * 60 * 60 * 1000).toISOString(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to shorten URL");
            }

            setShortUrl(data.shortUrl);
        } catch (error) {
            setError(error.message || "Something went wrong. Please try again.");
        
        } finally {
            setLoading(false);
        }

    }

    async function handleCopyUrl() {
        if (!shortUrl) return;  
            
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
        } catch (error) {
            setError("Unable to copy the url. Please copy it manually");
        }
    }

    return (
       <div className="landing-page">
            <div className="landing-navbar">
                <Navbar/>
            </div>

        <main>
            <section className="landing-hero">
                <div className="hero-left">

                    <div className="hero-badge">
                        <Sparkles className="sparkle"/>
                        <span>Your links,your way</span>
                    </div>

                    <h1>
                        Short links.
                        <br/>
                        <span>Bigger possibilities</span>
                    </h1>

                    <p className="hero-description">
                        Turn long, messy URLs into clean,manageable links.
                        Track their perfomance and customize them -- all 
                        in one simple place.</p>

                    <div className="hero-buttons">
                        <button type="button" className="primary-button">
                            Get Started
                          <ArrowRight/>  
                        </button>

                        <button type="button" className="secondary-button">
                            View Features
                        </button>
                    </div>

                </div>

                <div className="hero-right">
                    <form className="shorten-form" onSubmit={handleShortenUrl}>
                        <div className="landing-field">
                            <label htmlFor="landing-long-url">Long URL</label>

                            <div className="landing-input">
                                <Link2/>
                                <input type="url" placeholder="https://example.com/very/long/url"
                                 value={longUrl} onChange={(e) => setLongUrl(e.target.value)}/>
                            </div>
                        </div>

                        <div className="optional-fields">
                            <div className="landing-field">
                                <label htmlFor="landing-alias">Custom alias (optional)</label>

                                <div className="landing-input">
                                    <AtSign/>

                                    <input type="text" placeholder="my-link" 
                                    value={customAlias} onChange={(e) => setCustomAlias(e.target.value)}/>
                                </div>
                            </div>

                            <div className="landing-field">
                                <label htmlFor="landing-expiry">Expiry (optional)</label>

                                <div className="landing-input">
                                    <CalendarDays/>
                                    <select defaultValue="7" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}>
                                       <option value="1">1 Day</option>
                                       <option value="7">7 Days</option>
                                       <option value="30">30 Days</option>
                                       <option value="never">Never</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="shorten-button" disabled={loading}> 
                            {loading ? "shortening..." : "Shorten URL"}
                            {/* Shorten URL */}
                        </button>

                        <div className="generated-link">
                            <div className="generated-link-info">
                                <Link2/>
                                <span>{shortUrl || "Your shortened URL will appear here"}</span>
                            </div>

                            <button type="button" className="copy-button" onClick={handleCopyUrl}>
                                <Copy/>
                                <span>{copied ? "Copied!" : "Copy"}</span>
                            </button>
                        </div>
                    </form>

                    {error && <p className="auth-error">{error}</p>}
                </div>

            </section>

            <section className="features-section">
                <div className="section-heading">
                    <h2>Everything you need to manage links.</h2>
                    <p>
                        Simple yet powerful features to make your link management easier and smarter.
                    </p>
                </div>


                <div className="features-container">
                    <article className="feature-card">
                        <div className="feature-icon">
                            <Zap/>
                        </div>

                        <div className="feature-content">
                            <h3>Fast link shotening</h3>
                            <p>
                                Turn long URLs into short, clean links in seconds.
                            </p>
                        </div>
                    </article>

                     <article className="feature-card">
                        <div className="feature-icon analytics-icon">
                            <ChartNoAxesColumn/>
                        </div>

                        <div className="feature-content">
                            <h3>Track analytics</h3>
                            <p>
                                See how many people click your links with simple and clear analytics.
                            </p>
                        </div>
                    </article>


                     <article className="feature-card">
                        <div className="feature-icon">
                            <PenLine/>
                        </div>

                        <div className="feature-content">
                            <h3>Custom aliases</h3>
                            <p>
                                Create your own short aliases to make links easy to remember.
                            </p>
                        </div>
                    </article>

                </div>
            </section>



            <section className="how-works">
                <div className="section-heading">
                    <h2>How it works</h2>
                    <p>
                        Create and manage your short links in just 3 simple steps.
                    </p>
                </div>  

                <div className="steps-container">
                    <article className="step-card">
                        <div className="step-visual">
                            <span className="step-number">1</span>

                            <div className="step-icon">
                                <Link2/>
                            </div>
                        </div>

                        <h3>Paste your links</h3>
                        <p>Enter your long URL and (optional) custom alias.</p>
                    </article>

                    <ArrowRight className="step-arrow"/>


                    <article className="step-card">
                        <div className="step-visual">
                            <span className="step-number">2</span>

                            <div className="step-icon">
                                <MousePointerClick/>
                            </div>
                        </div>

                        <h3>Shorten it</h3>
                        <p>Click the shorten button to get your short links.</p>
                    </article>

                    <ArrowRight className="step-arrow"/>


                    <article className="step-card">
                        <div className="step-visual">
                            <span className="step-number">3</span>

                            <div className="step-icon">
                                <ChartNoAxesColumn/>
                            </div>
                        </div>

                        <h3>Track perfomance</h3>
                        <p>View click counts and manage your links anytime.</p>
                    </article>
                </div>
            </section>
            
        </main>    
      </div>
        
    )
}





export default LandingPage;