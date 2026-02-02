import express from 'express';
import {
    getMenu,
    getMenuById,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
} from '../controllers/menuController.js';
import { verifyToken, isAdminOrOperator } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenu);
router.get('/:id', getMenuById);

router.post('/', verifyToken, isAdminOrOperator, addMenuItem);
router.put('/:id', verifyToken, isAdminOrOperator, updateMenuItem);
router.delete('/:id', verifyToken, isAdminOrOperator, deleteMenuItem);

export default router;