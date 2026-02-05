import express from 'express';
import {
    getTables,
    getTableById,
    addTable,
    updateTableStatus,
    deleteTable,
} from '../controllers/tableController.js';
import { verifyToken, isAdmin, isAdminOrOperator } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdminOrOperator, getTables);
router.get('/:id', verifyToken, isAdminOrOperator, getTableById);
router.put('/:id/status', verifyToken, isAdminOrOperator, updateTableStatus);
router.post('/', verifyToken, isAdmin, addTable);
router.delete('/:id', verifyToken, isAdmin, deleteTable);

export default router;