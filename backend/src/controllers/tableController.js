import { readJSON, writeJSON } from '../utils/fileHandler.js';

export const getTables = async (req, res) => {
    try {
        const tables = await readJSON('tables.json');
        res
            .status(200)
            .json({ tables });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const getTableById = async (req, res) => {
    try {
        const { id } = req.params;
        const tables = await readJSON('tables.json');
        const table = tables.find(item => item.id === parseInt(id));
        if (!table) {
            return res
                .status(404)
                .json({ message: 'Table not found' });
        }
        res
            .status(200)
            .json({ table });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const addTable = async (req, res) => {
    try {
        const { number, capacity } = req.body;

        if (!number || !capacity) {
            return res
                .status(400)
                .json({ message: 'Missing required fields' });
        }

        const tables = await readJSON('tables.json');
        const tableExists = tables.find(item => item.number === number);
        if (tableExists) {
            return res
                .status(400)
                .json({ message: 'Table already exists' });
        }

        const newTable = {
            id: tables.length + 1,
            number: parseInt(number),
            capacity: parseInt(capacity),
            status: 'available',
            currentOrder: null,
            createdAt: new Date().toISOString(),
        };

        tables.push(newTable);
        await writeJSON('tables.json', tables);

        res
            .status(201)
            .json({ message: 'Table created successfully', table: newTable });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, capacity, status } = req.body;
        
        const tables = await readJSON('tables.json');
        const itemIndex = tables.findIndex(item => item.id === parseInt(id));
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (number) tables[itemIndex].number = parseInt(number);
        if (capacity) tables[itemIndex].capacity = parseInt(capacity);
        if (status) tables[itemIndex].status = status;

        await writeJSON('tables.json', tables);

        res
            .status(200)
            .json({ message: 'Table updated successfully', table: tables[itemIndex] });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const updateTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || (status !== 'available' && status !== 'occupied')) {
            return res
                .status(400)
                .json({ message: 'Invalid status value' });
        }

        const tables = await readJSON('tables.json');
        const itemIndex = tables.findIndex(item => item.id === parseInt(id));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }

        tables[itemIndex].status = status;
        tables[itemIndex].updatedAt = new Date().toISOString();

        await writeJSON('tables.json', tables);

        res
            .status(200)
            .json({ message: 'Table status updated successfully', table: tables[itemIndex] });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const tables = await readJSON('tables.json');
        const itemIndex = tables.findIndex(item => item.id === parseInt(id));
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (tables[itemIndex].status === 'occupied') {
            return res
                .status(400)
                .json({ message: 'Cannot delete an occupied table' });
        }

        tables.splice(itemIndex, 1);
        await writeJSON('tables.json', tables);

        res
            .status(200)
            .json({ message: 'Table deleted successfully' });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};