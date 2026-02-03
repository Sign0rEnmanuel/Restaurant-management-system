import express from 'express';
import { 
    getMenu, 
    getMenuById, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
} from '../controllers/menuController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenu);                    
router.get('/:id', getMenuById);             

router.post('/', verifyToken, isAdmin, addMenuItem);
router.put('/:id', verifyToken, isAdmin, updateMenuItem);
router.delete('/:id', verifyToken, isAdmin, deleteMenuItem);

export default router;