import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    getOrders, 
    getTables,
    getMenu,
    createOrder, 
    addItemToOrder, 
    removeItemFromOrder, 
    closeOrder 
} from '../services/api';
import Navbar from '../components/Navbar';
import './Orders.css';

function Orders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        tableId: '',
        menuItemId: '',
        quantity: '',
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            await Promise.all([loadOrders(), loadTables(), loadMenu()]);
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        try {
            const data = await getOrders();
            if (data && data.orders) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            setOrders([]);
        }
    };

    const loadTables = async () => {
        try {
            const data = await getTables();
            if (data && data.tables) {
                setTables(data.tables);
            } else {
                setTables([]);
            }
        } catch (error) {
            console.error('Error loading tables:', error);
            setTables([]);
        }
    };

    const loadMenu = async () => {
        try {
            const data = await getMenu();
            if (data && data.menu) {
                setMenu(data.menu);
            } else if (Array.isArray(data)) {
                setMenu(data);
            } else {
                setMenu([]);
            }
        } catch (error) {
            console.error('Error loading menu:', error);
            setMenu([]);
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();

        if (!formData.tableId) {
            alert('Please select a table');
            return;
        }

        try {
            await createOrder(formData.tableId);
            await loadOrders();
            closeCreateOrderModal();
            alert('Order created successfully');
        } catch (error) {
            console.error('Error creating order:', error);
            alert(error.response?.data?.message || 'Error creating the order');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();

        if (!formData.menuItemId || !formData.quantity) {
            alert('Please select a menu item and enter quantity');
            return;
        }

        try {
            await addItemToOrder(selectedOrder.id, formData.menuItemId, formData.quantity);
            await loadOrders();
            closeAddItemModal();
            alert('Item added to order successfully');
            const updatedOrder = orders.find(o => o.id === selectedOrder.id);
            if (updatedOrder) setSelectedOrder(updatedOrder);
        } catch (error) {
            console.error('Error adding item to order:', error);
            alert(error.response?.data?.message || 'Error adding the item to the order');
        }
    };

    const handleRemoveItem = async (menuItemId) => {
        if (!window.confirm('Are you sure you want to remove this item?')) {
            return;
        }

        try {
            await removeItemFromOrder(selectedOrder.id, menuItemId);
            await loadOrders();
            const updatedOrder = orders.find(o => o.id === selectedOrder.id);
            if (updatedOrder) {
                setSelectedOrder(updatedOrder);
            }
            alert('Item removed from order successfully');
        } catch (error) {
            console.error('Error removing item from order:', error);
            alert(error.response?.data?.message || 'Error removing the item from the order');
        }
    };

    const handleCloseOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to close this order?')) {
            return;
        }

        try {
            await closeOrder(orderId);
            await loadOrders();
            await loadTables();
            if (selectedOrder && selectedOrder.id === orderId) {
                closeItemsModal();
            }
            alert('Order closed successfully');
        } catch (error) {
            console.error('Error closing order:', error);
            alert(error.response?.data?.message || 'Error closing the order');
        }
    };

    const closeCreateOrderModal = () => {
        setShowCreateOrderModal(false);
        setFormData({
            tableId: '',
            menuItemId: '',
            quantity: '',
        });
    };

    const closeItemsModal = () => {
        setShowItemsModal(false);
        setSelectedOrder(null);
    };

    const closeAddItemModal = () => {
        setShowAddItemModal(false);
        setFormData({
            tableId: '',
            menuItemId: '',
            quantity: '',
        });
    };

    const openItemsModal = (order) => {
        setSelectedOrder(order);
        setShowItemsModal(true);
    };

    const getAvailableTables = () => {
        return tables.filter(table => table.status === 'available');
    };

    const isAdmin = user?.role === 'admin';

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className='order-container'>
            <Navbar />

            <div className='order-content'>
                <div className='order-header'>
                    <h1>📦 Orders Management</h1>
                    {isAdmin && (
                        <button 
                            className='btn-primary' 
                            onClick={() => setShowCreateOrderModal(true)}
                        >
                            + Create Order
                        </button>
                    )}
                </div>

                <div className='order-grid'>
                    {orders.length === 0 ? (
                        <p className='no-orders'>No orders registered</p>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className={`order-card ${order.status === 'active' ? 'active' : 'closed'}`}
                            >
                                <div className='order-number'>Order #{order.id}</div>
                                <div className='order-info'>
                                    <p><strong>👥 Table:</strong> {order.tableId}</p>
                                    <p><strong>📝 Items:</strong> {order.items.length}</p>
                                    <p><strong>💰 Total:</strong> ${order.total?.toFixed(2) || '0.00'}</p>
                                    <p className={`order-status ${order.status}`}>
                                        Status: {order.status === 'active' ? '🟢 Active' : '🔴 Closed'}
                                    </p>
                                </div>
                                <div className='order-actions'>
                                    {order.status === 'active' && (
                                        <>
                                            <button 
                                                className='btn-primary-small' 
                                                onClick={() => openItemsModal(order)}
                                            >
                                                👁️ View Items
                                            </button>
                                            <button 
                                                className='btn-delete-small' 
                                                onClick={() => handleCloseOrder(order.id)}
                                            >
                                                ✓ Close
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'closed' && (
                                        <span className='order-closed-badge'>✓ Closed</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal para crear orden */}
            {showCreateOrderModal && (
                <div className='modal-overlay' onClick={closeCreateOrderModal}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-header'>
                            <h2>Create New Order</h2>
                            <button className='close-btn' onClick={closeCreateOrderModal}>✕</button>
                        </div>
                        <form onSubmit={handleCreateOrder}>
                            <div className='form-group'>
                                <label htmlFor='table-select'>Select Table:</label>
                                <select
                                    id='table-select'
                                    value={formData.tableId}
                                    onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                                    required
                                >
                                    <option value=''>-- Choose a table --</option>
                                    {getAvailableTables().map((table) => (
                                        <option key={table.id} value={table.id}>
                                            Table {table.number} (Capacity: {table.capacity})
                                        </option>
                                    ))}
                                </select>
                                {getAvailableTables().length === 0 && (
                                    <p className='no-available-tables'>No available tables</p>
                                )}
                            </div>
                            <div className='form-actions'>
                                <button type='submit' className='btn-primary' disabled={getAvailableTables().length === 0}>
                                    Create Order
                                </button>
                                <button type='button' className='btn-secondary' onClick={closeCreateOrderModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para ver y editar items */}
            {showItemsModal && selectedOrder && (
                <div className='modal-overlay' onClick={closeItemsModal}>
                    <div className='modal-content modal-large' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-header'>
                            <h2>Order #{selectedOrder.id} - Table {selectedOrder.tableId}</h2>
                            <button className='close-btn' onClick={closeItemsModal}>✕</button>
                        </div>

                        <div className='modal-body'>
                            <div className='items-section'>
                                <h3>📋 Order Items</h3>
                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    <div className='items-list'>
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.menuItemId} className='item-row'>
                                                <div className='item-details'>
                                                    <p className='item-name'>{item.name}</p>
                                                    <p className='item-price'>${item.price?.toFixed(2)} x {item.quantity}</p>
                                                </div>
                                                <div className='item-subtotal'>
                                                    ${item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)}
                                                </div>
                                                {selectedOrder.status === 'active' && (
                                                    <button
                                                        className='btn-delete-item'
                                                        onClick={() => handleRemoveItem(item.menuItemId)}
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='no-items'>No items in this order</p>
                                )}

                                <div className='items-total'>
                                    <strong>Total: ${selectedOrder.total?.toFixed(2) || '0.00'}</strong>
                                </div>
                            </div>

                            {selectedOrder.status === 'active' && (
                                <div className='add-items-section'>
                                    <h3>➕ Add Items to Order</h3>
                                    <form onSubmit={(e) => { e.preventDefault(); setShowAddItemModal(true); }}>
                                        <button type='submit' className='btn-primary'>
                                            Add Item
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className='order-info-section'>
                                <p><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                {selectedOrder.updatedAt && (
                                    <p><strong>Last Updated:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                                )}
                                {selectedOrder.createdBy && (
                                    <p><strong>Created by:</strong> {selectedOrder.createdBy}</p>
                                )}
                            </div>
                        </div>

                        <div className='modal-footer'>
                            {selectedOrder.status === 'active' && (
                                <button 
                                    className='btn-delete' 
                                    onClick={() => {
                                        closeItemsModal();
                                        handleCloseOrder(selectedOrder.id);
                                    }}
                                >
                                    Close Order
                                </button>
                            )}
                            <button type='button' className='btn-secondary' onClick={closeItemsModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para agregar item */}
            {showAddItemModal && selectedOrder && (
                <div className='modal-overlay' onClick={closeAddItemModal}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-header'>
                            <h2>Add Item to Order</h2>
                            <button className='close-btn' onClick={closeAddItemModal}>✕</button>
                        </div>
                        <form onSubmit={handleAddItem}>
                            <div className='form-group'>
                                <label htmlFor='item-select'>Select Item:</label>
                                <select
                                    id='item-select'
                                    value={formData.menuItemId}
                                    onChange={(e) => setFormData({ ...formData, menuItemId: e.target.value })}
                                    required
                                >
                                    <option value=''>-- Choose an item --</option>
                                    {menu.map((item) => (
                                        <option key={item.id} value={item.id} disabled={!item.available}>
                                            {item.name} - ${item.price?.toFixed(2)} {!item.available ? '(Unavailable)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='quantity'>Quantity:</label>
                                <input
                                    id='quantity'
                                    type='number'
                                    min='1'
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder='Enter quantity'
                                    required
                                />
                            </div>
                            <div className='form-actions'>
                                <button type='submit' className='btn-primary'>
                                    Add Item
                                </button>
                                <button type='button' className='btn-secondary' onClick={closeAddItemModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;