import express from 'express';
import { 
    getOrders, 
    getOrderById, 
    getActiveOrderByTable,
    createOrder, 
    addItemToOrder,
    removeItemFromOrder,
    closeOrder 
} from '../controllers/orderController.js';
import { verifyToken, isAdminOrOperator } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdminOrOperator, getOrders);
router.get('/:id', verifyToken, isAdminOrOperator, getOrderById);
router.get('/table/:tableId', verifyToken, isAdminOrOperator, getActiveOrderByTable);

router.post('/', verifyToken, isAdminOrOperator, createOrder);
router.post('/:orderId/items', verifyToken, isAdminOrOperator, addItemToOrder);
router.delete('/:orderId/items/:menuItemId', verifyToken, isAdminOrOperator, removeItemFromOrder);

router.put('/:orderId/close', verifyToken, isAdminOrOperator, closeOrder);

export default router;