import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
    return(
        <div className="footer">
            <p>© 2025 Vibely. All rights reserved.</p>
            <div className="footer-links">
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/privacy">Privacy Policy</Link>
            </div>
        </div>
    )
}

export default Footer;