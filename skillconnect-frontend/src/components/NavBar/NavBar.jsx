import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./NavBar.css";
import NavItem from "./NavItems/NavItem";
import CompanyLogo from "../../assets/company-logo.png"
import NavItemMyAccount from "./NavItems/NavItemMyAccount";

export default function NavBar() {
    return (
        <nav className="nav">
            <div className="site-title">
                <Link to="/" className="site-title-text">
                    <img className="brand-icon" src={CompanyLogo} alt="" />
                    Skill Connect
                </Link>
            </div>
            <ul>
                <NavItem to="/posts">Posts</NavItem>
                <NavItem to="/">Projects</NavItem>
                <NavItem to="saved-posts">Saved Posts</NavItem>
            </ul>
            <NavItemMyAccount />
        </nav>
    );
}
