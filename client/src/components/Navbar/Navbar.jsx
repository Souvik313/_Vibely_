import { useState , useEffect } from "react";
import { useNavigate , Link, useParams } from "react-router-dom";
import { useFetchPosts } from "../../hooks/useFetchPosts.js";
import nav_icon from '../../assets/nav_icon.png';
import search_icon from '../../assets/search.png';
import menu_icon from '../../assets/menu.png';
import Sidebar from "../Sidebar/Sidebar.jsx";
import './Navbar.css';

const Navbar = ({onSearch}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const {posts , loading , error} = useFetchPosts(`/all-posts`);

    const handleSearchChange = async(e) => {
        const value = e.target.value;
        setSearch(value);
        onSearch(value);
    }

    return (
        <div className="navbar-components">
            <div className="navbar-components-left">
                <img src={menu_icon} alt="" className={`menu-icon ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(!sidebarOpen)} />
                {sidebarOpen && <Sidebar />}
                <img src={nav_icon} alt="navbar-icon" />
                <p className="project-name">Vibely</p>
            </div>
            <div className="navbar-components-middle">
                <input
                    type="text"
                    placeholder="Search for posts"
                    className="search-bar"
                    value={search}
                    onChange={handleSearchChange}
                />
                <img src={search_icon} alt="search icon" className="search-icon" />
            </div>
            <div className="navbar-components-right">
                <ul>
                    <li className="nav-right-items">
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/create-post">Create post</Link>
                        {token && userId 
                            ? <Link to={`/profile/${userId}`}>Profile</Link>
                            : <Link to="/register">Create account</Link>
                        }
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;