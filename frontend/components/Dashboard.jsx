import React, {useState, useEffect} from "react";
import "./Dashboard.css";
import {Link2, ChevronRight, ChevronLeft, Home,LogOut, CalendarDays, ChartNoAxesColumn,MousePointer2, Clock
    ,Search, Copy, Trash2, AtSign,
    
    
} from "lucide-react";
import { data } from "react-router-dom";
import { Link } from "react-router-dom";



function Dashboard() {

        
        const user = JSON.parse(localStorage.getItem("user") || "{}");
    
         const [longUrl, setLongUrl] = React.useState("");
         
         const [shortUrl , setShortUrl] = React.useState("")
     
         const [customAlias, setCustomAlias] = React.useState("");
         
         const [expiryDate, setExpiryDate] = React.useState("");
     
         const [urls, setUrls] = React.useState([]);

         const [searchTerm, setSearchTerm] = React.useState("");

         const [statusFilter, setStatusFilter] = React.useState("all");

         const [sortBy, setSortBy] = React.useState("newest");

         const [currentPage, setCurrentPage] = React.useState(1);
     
     
         function urlInput(event) {
             console.log("input");    
             setLongUrl(event.target.value);
             
         }
     
         function custom(event) {
             console.log("custom");
             setCustomAlias(event.target.value);    
         }
     
         function expiry(event) {
             console.log("expiry date");
             setExpiryDate(event.target.value);
         }


            const totalLinks = urls.length;

            const totalClicks = urls.reduce((total, url) => total + (url.clicks || 0),0);

            const activeLinks = urls.filter((url) => !url.expiryDate || new Date(url.expiryDate) > new Date()).length;

            const expiredLinks = urls.filter((url) => url.expiryDate && new Date(url.expiryDate) <= new Date()).length;


        //  search, sorting anf filtering logic together
         const filteredUrls = urls.filter((url) => { 
            const matchesSearch =  url.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.shortCode.toLowerCase().includes(searchTerm.toLowerCase());

            const isExpired = url.expiryDate && new Date(url.expiryDate) <= new Date();

            const matchesStatus = statusFilter === "all" || 
            (statusFilter === "active" && !isExpired) ||
            (statusFilter === "expired" && isExpired);

            return matchesSearch && matchesStatus;      

        });

        const sortedUrls = [...filteredUrls].sort((a,b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            if (sortBy === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }

            if (sortBy === "clicks") {
                return (b.clicks || 0) - (a.clicks || 0);
            }

            return 0;

        });

            // pagination
            const urlsPerPage = 5;

            const totalPages = Math.ceil(sortedUrls.length / urlsPerPage);

            const startIndex = (currentPage - 1) * urlsPerPage;

            const currentUrls = sortedUrls.slice(startIndex, startIndex + urlsPerPage);


     
         async function handleShortenUrl(event) {     
                event.preventDefault();
            console.log("shorten button");
                try {
        console.log("fetch");
        const response = await fetch("http://localhost:3000/url/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                longUrl: longUrl,
                customAlias: customAlias,
                expiryDate: expiryDate,
            }),
        });

        const data = await response.json();

        setShortUrl(`http://localhost:3000/url/${data.shortCode}`);
        fetchUrl();
    
    } catch(error) {
        console.log(error);
    }
   }



   async function fetchUrl() {
    try {
        const token = window.localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/url/urls", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch urls");
        }

        setUrls(Array.isArray(data) ? data : data.urls || []);
    
    } catch (error) {
        console.log("Error fetching URLs:" , error);
    }


}
                 
     
         React.useEffect(() => {
             fetchUrl();
         },[]);



         async function deleteUrl(id) {
        try {
            const response = await fetch(`http://localhost:3000/url/${id}` , {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete URL");
            }

            await fetchUrl();

        } catch(error) {
            console.error("Error deleting URL:" , error);
        }
    }

         async function copyShortUrl(shortCode) {
       const shortUrl = `http://localhost:3000/${shortCode}`;

       await navigator.clipboard.writeText(shortUrl);
     }

     function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/login";
     }



    return (
       <div className="dashboard-page">
          <header className="dashboard-header">
               <div className="dashboard-brand">
                    <Link2 className="link-icon"/>
                    <span>Linkly</span>
                </div> 
          </header>


        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
                <nav className="sidebar-nav">
                    <a href="/dashboard" className="sidebar-link active">
                        <Home/>
                        <span>Dashboard</span>
                    </a>

                    <Link to="/my-links" className="sidebar-link">
                        <Link2/>
                        <span>My Links</span>
                    </Link>

                    <div className="sidebar-divider"></div>

                        <button type="button" className="sidebar-link logout-link" onClick={handleLogout}>
                            <LogOut/>
                            <span>Logout</span>
                        </button>
                    
                </nav>
          </aside>

          <main className="dashboard-main">
                <section className="welcome-section">
                    <h1>Welcome back, {user.name || "there"}!</h1>
                    <p>
                        Shorten, manage and track all your links from here.
                    </p>
                </section>



                <section className="create-link-section">
                    <h2>Create a new short link</h2>

                    <form className="create-link-form" onSubmit={handleShortenUrl}>
                        <div className="form-field long-url-field">
                            <label htmlFor="long-url">Long URL</label>

                            <div className="input-wrapper">
                                <Link2/>
                                <input onChange={urlInput} value={longUrl} type="url" placeholder="https://example.com/very/long/url"/>
                            </div>
                        </div>

                        <div className="form-field alias -field">
                            <label htmlFor="custom-alias">Custom alias
                                <span>(optional)</span>
                            </label>

                            <div className="input-wrapper">
                                <AtSign/>
                                <input onChange={custom} value={customAlias} type="text" placeholder="my-link"/>
                            </div>
                        </div>

                        <div className="form-field expiry-field">
                            <label htmlFor="expiry-date">Expiry date
                                <span>(optional)</span>
                            </label>

                            <div className="input-wrapper">
                                <CalendarDays/>
                                <input onChange={expiry} value={expiryDate} type="date"/>
                            </div>
                        </div>

                        <button className="shorten-buttons" type="submit">
                            Shorten URL
                            <ChevronRight/>
                        </button>
                    </form>
                </section>


                <section className="stats-section">
                    <article className="stat-card">
                        <div className="stat-icon total-links-icon">
                            <Link2/>
                        </div>

                        <div className="stat-info">
                            <h3>Total Links</h3>
                            <p className="stat-count">{totalLinks}</p>
                            <p className="stat-description">Links created by you</p>    
                        </div>
                    </article>

                    <article className="stat-card">
                        <div className="stat-icon total-clicks-icon">
                            <ChartNoAxesColumn/>
                        </div>

                        <div className="stat-info">
                            <h3>Total Clicks</h3>
                            <p className="stat-count">{totalClicks}</p>
                            <p className="stat-description">Across all your links.</p>
                        </div>
                    </article>


                    <article className="stat-card">
                        <div className="stat-icon active-links-icon">
                            <MousePointer2/>
                        </div>

                        <div className="stat-info">
                            <h3>Active Links</h3>
                            <p className="stat-count">{activeLinks}</p>
                            <p className="stat-description">Not expired.</p>
                        </div>
                    </article>


                    <article className="stat-card">
                        <div className="stat-icon expired-links-icon">
                            <Clock/>
                        </div>

                        <div className="stat-info">
                            <h3>Expired Links</h3>
                            <p className="stat-count">{expiredLinks}</p>
                            <p className="stat-description">Already expired.</p>
                        </div>
                    </article>

                </section>



                <section className="links-section">
                    <div className="links-header">
                        <div className="links-heading">
                            <h2>Your Links</h2>
                            <p>View, search, filter and manage your shortened links.</p>
                        </div>

                        <div className="links-control">
                            <div className="search-wrapper">
                                <Search/>
                                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="search" placeholder="search links.." aria-label="Search links"/>
                            </div>

                            <select defaultValue="all" aria-label="Filter links" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">All links</option>
                                <option value="active">Active links</option>
                                <option value="expired">Expired links</option>
                            </select>

                            <select defaultValue="newest" aria-label="Sort links" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="clicks">Most clicks</option>
                            </select>
                        </div>
                    </div>



                    <div className="table-container">
                            <table className="links-table">
                                <thead>
                                    <tr>
                                        <th>Original URL</th>
                                        <th>Short</th>
                                        <th>Clicks</th>
                                        <th>Created At</th>
                                        <th>Expiry</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {urls.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">No urls created yet.</td>
                                        </tr>
                                    ) : (
                                        currentUrls.map((url) => (
                                            
                                    <tr key={url._id}>
                                        <td className="original-url-cell">
                                            <span className="original-url">
                                               {url.longUrl}
                                            </span>
                                        </td>

                                        <td className="short-url-cell">
                                            <a href={`http://localhost:3000/${url.shortCode}`} target="_blank" rel="noreferrer">http://localhost:3000/{url.shortCode}</a>
                                        </td>


                                        <td className="data-cell">{url.clicks}</td>

                                        <td className="data-cell">
                                            <span>
                                                {new Date(url.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>

                                            <span className="secondary-date-text">
                                                Created  {Math.floor((Date.now() - new Date(url.createdAt).getTime()) / 
                                                    (1000 * 60 * 60 * 24)
                                                )} days ago
                                            </span>
                                        </td>



                                        <td className="data-cell">
                                            <span>
                                                {url.expiryDate ? new Date(url.expiryDate).toLocaleDateString("en-GB",{
                                                           day:"2-digit",
                                                           month: "short",
                                                           year: "numeric" 
                                                })
                                                : "No expiry"}
                                            </span>


                                            <span className="secondary-date-text">
                                                {url.expiryDate ? new Date(url.expiryDate) < new Date()
                                                        ? "Expired"
                                                    : `Expires in ${Math.ceil(
                                                        (
                                                            new Date(url.expiryDate).getTime() - Date.now()
                                                        ) / (1000 * 60 * 60 * 24)
                                                    )} days` 
                                                : "Never expires"}
                                            </span>
                                        </td>



                                        <td className="action-buttons">
                                            <button type="button" className="copy-button" aria-label="Copy short URL" onClick={() => copyShortUrl(url.shortCode)}>
                                                <Copy/>
                                            </button>

                                            <button type="button" className="delete-button" aria-label="Delete link" onClick={() => deleteUrl(url._id)}>
                                                <Trash2/>
                                            </button>
                                        </td>
                                    </tr>

                                        ))                
                                    )}
                                </tbody>
                            </table>
                    </div>




                    <div className="table-footer">
                        <p className="results-count">
                            Showing {sortedUrls.length === 0 ? 0 : startIndex + 1} to{" "}
                                    {Math.min(startIndex + urlsPerPage, sortedUrls.length)} of{" "}
                                        {sortedUrls.length} links                 
                        </p>

                        <nav className="pagination" aria-label="pagination">
                            <button type="button" aria-label="previous page">
                                <ChevronLeft onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}/>
                            </button>

                            <button onClick={() => setCurrentPage(1)} type="button" className="current-page">1</button>
                            <button onClick={() => setCurrentPage(2)} type="button">2</button>
                            <button onClick={() => setCurrentPage(3)} type="button">3</button>
                            <button type="button" aria-label="Next page">
                                <ChevronRight onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}/>
                            </button>
                        </nav>
                    </div>

                </section>
          </main>  
      </div>      
       </div>
    )
}


export default Dashboard;