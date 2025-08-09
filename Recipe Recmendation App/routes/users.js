import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addToFavorites,
  removeFromFavorites
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.get('/', protect, getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

router.post('/favorites/:recipeId', protect, addToFavorites);
router.delete('/favorites/:recipeId', protect, removeFromFavorites);

export default router;