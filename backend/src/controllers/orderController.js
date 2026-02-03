import { readJSON, writeJSON } from '../utils/fileHandler.js';

export const getOrders = async (req, res) => {
    try {
        const orders = await readJSON('orders.json');
        res.json({ orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await readJSON('orders.json');
        
        const order = orders.find(order => order.id === parseInt(id));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({ order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getActiveOrderByTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const orders = await readJSON('orders.json');
        
        const activeOrder = orders.find(
            order => order.tableId === parseInt(tableId) && order.status === 'active'
        );
        
        if (!activeOrder) {
            return res.status(404).json({ message: 'No active order for this table' });
        }
        
        res.json({ order: activeOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { tableId } = req.body;
        
        if (!tableId) {
            return res.status(400).json({ message: 'Table ID is required' });
        }
        
        const tables = await readJSON('tables.json');
        const table = tables.find(t => t.id === parseInt(tableId));
        
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }
        
        const orders = await readJSON('orders.json');
        const activeOrder = orders.find(
            order => order.tableId === parseInt(tableId) && order.status === 'active'
        );
        
        if (activeOrder) {
            return res.status(400).json({ message: 'Table already has an active order' });
        }
        
        const newOrder = {
            id: orders.length + 1,
            tableId: parseInt(tableId),
            items: [],
            total: 0,
            status: 'active',
            createdBy: req.user.username,
            createdAt: new Date().toISOString(),
        };
        
        orders.push(newOrder);
        await writeJSON('orders.json', orders);
        
        const tableIndex = tables.findIndex(t => t.id === parseInt(tableId));
        tables[tableIndex].status = 'occupied';
        tables[tableIndex].currentOrder = newOrder.id;
        await writeJSON('tables.json', tables);
        
        res.status(201).json({ 
            message: 'Order created successfully', 
            order: newOrder 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addItemToOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { menuItemId, quantity } = req.body;
        
        if (!menuItemId || !quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid menu item or quantity' });
        }
        
        const menu = await readJSON('menu.json');
        const menuItem = menu.find(item => item.id === parseInt(menuItemId));
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        if (!menuItem.available) {
            return res.status(400).json({ message: 'Menu item is not available' });
        }
        
        const orders = await readJSON('orders.json');
        const orderIndex = orders.findIndex(order => order.id === parseInt(orderId));
        
        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (orders[orderIndex].status !== 'active') {
            return res.status(400).json({ message: 'Cannot add items to a closed order' });
        }
        
        const existingItemIndex = orders[orderIndex].items.findIndex(
            item => item.menuItemId === parseInt(menuItemId)
        );
        
        if (existingItemIndex !== -1) {
            orders[orderIndex].items[existingItemIndex].quantity += parseInt(quantity);
            orders[orderIndex].items[existingItemIndex].subtotal = 
                orders[orderIndex].items[existingItemIndex].quantity * menuItem.price;
        } else {
            const newItem = {
                menuItemId: parseInt(menuItemId),
                name: menuItem.name,
                price: menuItem.price,
                quantity: parseInt(quantity),
                subtotal: menuItem.price * parseInt(quantity),
            };
            orders[orderIndex].items.push(newItem);
        }
        
        orders[orderIndex].total = orders[orderIndex].items.reduce(
            (sum, item) => sum + item.subtotal, 0
        );
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        await writeJSON('orders.json', orders);
        
        res.json({ 
            message: 'Item added to order successfully', 
            order: orders[orderIndex] 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeItemFromOrder = async (req, res) => {
    try {
        const { orderId, menuItemId } = req.params;
        
        const orders = await readJSON('orders.json');
        const orderIndex = orders.findIndex(order => order.id === parseInt(orderId));
        
        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (orders[orderIndex].status !== 'active') {
            return res.status(400).json({ message: 'Cannot modify a closed order' });
        }
        
        const itemIndex = orders[orderIndex].items.findIndex(
            item => item.menuItemId === parseInt(menuItemId)
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in order' });
        }
        
        orders[orderIndex].items.splice(itemIndex, 1);
        
        orders[orderIndex].total = orders[orderIndex].items.reduce(
            (sum, item) => sum + item.subtotal, 0
        );
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        await writeJSON('orders.json', orders);
        
        res.json({ 
            message: 'Item removed from order successfully', 
            order: orders[orderIndex] 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const closeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const orders = await readJSON('orders.json');
        const orderIndex = orders.findIndex(order => order.id === parseInt(orderId));
        
        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (orders[orderIndex].status === 'closed') {
            return res.status(400).json({ message: 'Order is already closed' });
        }
        
        orders[orderIndex].status = 'closed';
        orders[orderIndex].closedBy = req.user.username;
        orders[orderIndex].closedAt = new Date().toISOString();
        
        await writeJSON('orders.json', orders);
        
        const tables = await readJSON('tables.json');
        const tableIndex = tables.findIndex(
            table => table.id === orders[orderIndex].tableId
        );
        
        if (tableIndex !== -1) {
            tables[tableIndex].status = 'available';
            tables[tableIndex].currentOrder = null;
            await writeJSON('tables.json', tables);
        }
        
        res.json({ 
            message: 'Order closed successfully', 
            order: orders[orderIndex] 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};