import React from 'react'
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function NavItem({ to, children }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
    // end: true means that the path must match exactly
    return (
        <div className='nav-item'>
            <li className={isActive ? "active" : "not-active"}>
                <Link to={to}>{children}</Link>
            </li>

            {/* <div className={isActive ? "active-line" : "not-active-line"}/> */}
        </div>
    );
}
