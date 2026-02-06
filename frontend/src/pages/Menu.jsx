import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import Navbar from '../components/Navbar';
import './Menu.css';

function Menu() {
    const { user } = useContext(AuthContext);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        available: true,
    });

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await getMenu();
            let menuItems = [];
            if (data && data.menu) {
                menuItems = data.menu;
            } else if (Array.isArray(data)) {
                menuItems = data;
            }
            
            const normalizedMenu = menuItems.map(item => ({
                ...item,
                price: parseFloat(item.price)
            }));
            setMenu(normalizedMenu);
            setLoading(false);
        } catch (error) {
            console.error('Error loading menu:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingItem) {
                await updateMenuItem(editingItem.id, formData);
            } else {
                await createMenuItem(formData);
            }

            loadMenu();
            closeModal();
        } catch (error) {
            console.error('Error saving item:', error);
            alert(error.response?.data?.message || 'Error saving the dish');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            available: item.available,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this dish?')) {
            try {
                await deleteMenuItem(id);
                loadMenu();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Error deleting the dish');
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            available: true,
        });
    };

    const isAdmin = user?.role === 'admin';

    if (loading) return <div>Loading...</div>;

    return (
        <div className="menu-container">
            <Navbar />

            <div className="menu-content">
                <div className="menu-header">
                    <h1>📋 Restaurant Menu</h1>
                    {isAdmin && (
                        <button
                            className="btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            + Add Dish
                        </button>
                    )}
                </div>

                <div className="menu-grid">
                    {menu.length === 0 ? (
                        <p>No dishes in the menu</p>
                    ) : (
                        menu.map((item) => (
                            <div key={item.id} className="menu-item-card">
                                <div className="menu-item-header">
                                    <h3>{item.name}</h3>
                                    <span
                                        className={`badge ${item.available ? 'available' : 'unavailable'
                                            }`}
                                    >
                                        {item.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>

                                <p className="description">{item.description}</p>
                                <p className="category">Category: {item.category}</p>
                                <p className="price">${Number(item.price).toFixed(2)}</p>

                                {isAdmin && (
                                    <div className="menu-item-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(item)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>{editingItem ? 'Edit Dish' : 'Add Dish'}</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Dish Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.available}
                                            onChange={(e) =>
                                                setFormData({ ...formData, available: e.target.checked })
                                            }
                                        />
                                        Available
                                    </label>
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
                                        {editingItem ? 'Update' : 'Create'}
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

export default Menu;