import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Dashboard.css";

function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard-container">
            <Navbar />

            <div className="dashboard-content">
                <h1>Welcome {user?.username}</h1>
                <p className="role-badge">Role: {user?.role === "admin" ? "Admin" : "Operator"}</p>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Menu</h3>
                        <p>View and manage your menu items.</p>
                        {user?.role === "admin" ? (
                            <span className="permission">Permission: Admin</span>
                        ) : (
                            <span className="permission">Permission: Operator</span>
                        )}
                    </div>

                    <div className="dashboard-card">
                        <h3>Tables</h3>
                        <p>View and manage your tables.</p>
                        <span>Permission: Succes!</span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Orders</h3>
                        <p>View and manage your orders.</p>
                        <span>Permission: Succes!</span>
                    </div>

                    {user?.role === "admin" && (
                        <div className="dashboard-card">
                            <h3>Users</h3>
                            <p>View and manage your users.</p>
                            <span>Permission: Succes!</span>
                        </div>
                    )};
                </div>

                <div className="quick-stats">
                    <h2>Quick Stats</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>Create Order</h4>
                            <p>Init a new order</p>
                        </div>
                        <div className="stat-card">
                            <h4>View Tables</h4>
                            <p>View all your tables</p>
                        </div>
                        {user?.role === "admin" && (
                            <div className="stat-card">
                                <h4>Add a Item</h4>
                                <p>Add an item to an order</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;