import express from 'express';
import { body } from 'express-validator';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  getRecipesByCategory,
  searchRecipes,
  getFavoriteRecipes,
  getMyRecipes
} from '../controllers/recipeController.js';
import { protect, optional } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const recipeValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Recipe name must be between 2 and 100 characters'),
  body('ingredients')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Ingredients must be between 10 and 1000 characters'),
  body('steps')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Steps must be between 10 and 2000 characters'),
  body('category')
    .isIn(['breakfast', 'lunch', 'dinner', 'fastfood'])
    .withMessage('Category must be one of: breakfast, lunch, dinner, fastfood'),
  body('time')
    .matches(/^\d+\s*(mins?|minutes?|hrs?|hours?)$/i)
    .withMessage('Time must be in format like "30 mins" or "1 hour"'),
  body('image')
    .isURL()
    .withMessage('Image must be a valid URL')
];

// Routes
router.get('/', optional, getRecipes);
router.get('/search', optional, searchRecipes);
router.get('/category/:category', optional, getRecipesByCategory);
router.get('/favorites', protect, getFavoriteRecipes);
router.get('/my-recipes', protect, getMyRecipes);
router.get('/:id', optional, getRecipe);

router.post('/', protect, recipeValidation, createRecipe);
router.put('/:id', protect, recipeValidation, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

router.post('/:id/like', protect, likeRecipe);
router.delete('/:id/like', protect, unlikeRecipe);

export default router;