import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getTables, createTable, updateTableStatus, deleteTable } from '../services/api';
import Navbar from '../components/Navbar';
import './Tables.css';

function Tables() {
    const { user } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        number: '',
        capacity: '',
    });

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            const data = await getTables();
            console.log(data);
            if (data && data.tables) {
                setTables(data.tables);
            } else {
                setTables([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading tables:', error);
            setTables([]);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createTable(formData);
            loadTables();
            closeModal();
        } catch (error) {
            console.error('Error creating table:', error);
            alert(error.response?.data?.message || 'Error creating the table');
        }
    };

    const handleStatusChange = async (tableId, newStatus) => {
        try {
            await updateTableStatus(tableId, newStatus);
            loadTables();
        } catch (error) {
            console.error('Error updating table status:', error);
            alert('Error changing table status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            try {
                await deleteTable(id);
                loadTables();
            } catch (error) {
                console.error('Error deleting table:', error);
                alert(error.response?.data?.message || 'Error deleting the table');
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            number: '',
            capacity: '',
        });
    };

    const isAdmin = user?.role === 'admin';

    if (loading) return <div>Loading...</div>;

    return (
        <div className="tables-container">
            <Navbar />

            <div className="tables-content">
                <div className="tables-header">
                    <h1>🪑 Table Management</h1>
                    {isAdmin && (
                        <button
                            className="btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            + Add Table
                        </button>
                    )}
                </div>

                <div className="tables-grid">
                    {tables.length === 0 ? (
                        <p>No tables registered</p>
                    ) : (
                        tables.map((table) => (
                            <div
                                key={table.id}
                                className={`table-card ${table.status === 'occupied' ? 'occupied' : 'available'
                                    }`}
                            >
                                <div className="table-number">Table {table.number}</div>
                                <div className="table-info">
                                    <p>👥 Capacity: {table.capacity} people</p>
                                    <p className={`status ${table.status}`}>
                                        {table.status === 'available' ? '✅ Available' : '🔴 Occupied'}
                                    </p>
                                </div>
                                <div className="table-actions">
                                    <button
                                        className={`btn-status ${table.status === 'available' ? 'occupy' : 'free'
                                            }`}
                                        onClick={() =>
                                            handleStatusChange(
                                                table.id,
                                                table.status === 'available' ? 'occupied' : 'available'
                                            )
                                        }
                                    >
                                        {table.status === 'available' ? 'Occupy' : 'Free'}
                                    </button>

                                    {isAdmin && table.status === 'available' && (
                                        <button
                                            className="btn-delete-small"
                                            onClick={() => handleDelete(table.id)}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal for adding a new table */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>Add New Table</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Table Number</label>
                                    <input
                                        type="number"
                                        value={formData.number}
                                        onChange={(e) =>
                                            setFormData({ ...formData, number: e.target.value })
                                        }
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Capacity (people)</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) =>
                                            setFormData({ ...formData, capacity: e.target.value })
                                        }
                                        required
                                        min="1"
                                    />
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
                                        Create Table
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

export default Tables;