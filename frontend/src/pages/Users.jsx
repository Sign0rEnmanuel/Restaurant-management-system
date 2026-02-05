import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { register } from "../services/api";
import Navbar from "../components/Navbar";
import "./Users.css";

function Users() {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "operador",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        setUsers(storedUsers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await register(formData.username, formData.password, formData.role);

            const newUser = {
                id: users.length + 1,
                username: formData.username,
                role: formData.role,
                createdAt: new Date().toISOString(),
            };

            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            localStorage.setItem("allUsers", JSON.stringify(updatedUsers));

            setSuccess("User created successfully!");
            setTimeout(() => {
                closeModal();
                setSuccess("");
            }, 2000);
        } catch (error) {
            console.error("Error creating user:", error);
            setError(error.response?.data?.message || "Error creating user");
        }
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const updatedUsers = users.filter((u) => u.id !== userId);
            setUsers(updatedUsers);
            localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            username: "",
            password: "",
            role: "operador",
        });
        setError("");
    };

    if (user?.role !== "admin") {
        return (
            <div>
                <Navbar />
                <div style={{ padding: "40px", textAlign: "center" }}>
                    <h1>Access Denied</h1>
                    <p>Only administrators can access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="users-container">
            <Navbar />

            <div className="users-content">
                <div className="users-header">
                    <h1>👥 User Management</h1>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        + Add User
                    </button>
                </div>

                {success && <div className="success-message">{success}</div>}

                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        No users registered
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.username}</td>
                                        <td>
                                            <span className={`role-badge ${u.role}`}>
                                                {u.role === "admin" ? "👑 Admin" : "👤 Operator"}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {u.username !== "admin" && (
                                                <button
                                                    className="btn-delete-user"
                                                    onClick={() => handleDelete(u.id)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Add New User</h2>

                            {error && <div className="error-message">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                        required
                                        minLength="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value })
                                        }
                                    >
                                        <option value="operador">Operator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
