import express from 'express';
import {
    getTables,
    getTableById,
    addTable,
    updateTable,
    deleteTable,
} from '../controllers/tableController.js';
import { verifyToken, isAdminOrOperator } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdminOrOperator, getTables);
router.get('/:id', verifyToken, isAdminOrOperator, getTableById);
router.put('/:id/status', verifyToken, isAdminOrOperator, updateTable);
router.post('/', verifyToken, isAdminOrOperator, addTable);
router.delete('/:id', verifyToken, isAdminOrOperator, deleteTable);

export default router;