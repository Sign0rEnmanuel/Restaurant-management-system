import { readJSON, writeJSON } from '../utils/fileHandler.js';

export const getMenu = async (req, res) => {
    try {
        const menu = await readJSON('menu.json');
        res
            .status(200)
            .json(menu);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const getMenuById = async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await readJSON('menu.json');
        const menuItem = menu.find(item => item.id === parseInt(id));
        if (!menuItem) {
            return res
                .status(404)
                .json({ message: 'Menu item not found' });
        }
        res
            .status(200)
            .json(menuItem);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, available } = req.body;

        if (!name || !description || !price || !category || !available) {
            return res
                .status(400)
                .json({ message: 'Missing required fields' });
        }

        const menu = await readJSON('menu.json');
        const menuItemExists = menu.find(item => item.name === name);
        if (menuItemExists) {
            return res
                .status(400)
                .json({ message: 'Menu item already exists' });
        }

        const newMenuItem = {
            id: menu.length + 1,
            name,
            description,
            price: parseFloat(price),
            category,
            available,
            createdAt: new Date().toISOString(),
        };

        menu.push(newMenuItem);
        await writeJSON('menu.json', menu);

        res
            .status(201)
            .json({ message: 'Menu item created successfully', menuItem: newMenuItem });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, available } = req.body;
        
        const menu = await readJSON('menu.json');
        const itemIndex = menu.findIndex(item => item.id === parseInt(id));
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (name) menu[itemIndex].name = name;
        if (description) menu[itemIndex].description = description;
        if (price) menu[itemIndex].price = price;
        if (category) menu[itemIndex].category = category;
        if (available) menu[itemIndex].available = available;

        await writeJSON('menu.json', menu);

        res
            .status(200)
            .json({ message: 'Menu item updated successfully' });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await readJSON('menu.json');
        const itemIndex = menu.findIndex(item => item.id === parseInt(id));
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }

        menu.splice(itemIndex, 1);
        await writeJSON('menu.json', menu);

        res
            .status(200)
            .json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};