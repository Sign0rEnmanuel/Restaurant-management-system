import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import './Navbar.css';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Restaurant System</h2>
            </div>

            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/menu">Menu</Link>
                <Link to="/tables">Tables</Link>
                <Link to="/orders">Orders</Link>
                {user?.role === "admin" && (
                    <Link to="/users">Users</Link>
                )}
            </div>

            <div className="navbar-user">
                <span>{user?.username} ({user?.role})</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    )
}

export default Navbar;