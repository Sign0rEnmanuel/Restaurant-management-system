import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const register = async (username, password, role) => {
    const response = await api.post('/auth/register', { username, password, role });
    return response.data;
};

export const getMenu = async () => {
    const response = await api.get('/menu');
    return response.data;
};

export const createMenuItem = async (item) => {
    const response = await api.post('/menu', item);
    return response.data;
};

export const updateMenuItem = async (id, item) => {
    const response = await api.put(`/menu/${id}`, item);
    return response.data;
};

export const deleteMenuItem = async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
}

export const getTables = async () => {
    const response = await api.get('/tables');
    return response.data;
};

export const createTable = async (table) => {
    const response = await api.post('/tables', table);
    return response.data;
};

export const updateTableStatus = async (id, status) => {
    const response = await api.put(`/tables/${id}/status`, { status });
    return response.data;
};

export const deleteTable = async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
};

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const getActiveOrderByTable = async (tableId) => {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
};

export const createOrder = async (tableId) => {
    const response = await api.post('/orders', { tableId });
    return response.data;
};

export const addItemToOrder = async (orderId, menuItemId, quantity) => {
    const response = await api.post(`/orders/${orderId}/items`, { menuItemId, quantity });
    return response.data;
};

export const removeItemFromOrder = async (orderId, menuItemId) => {
    const response = await api.delete(`/orders/${orderId}/items/${menuItemId}`);
    return response.data;
};

export const closeOrder = async (orderId) => {
    const response = await api.put(`/orders/${orderId}/close`);
    return response.data;
};
    return response.data;
};

export default api;