import { validationResult } from 'express-validator';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const query = { isPublic: true };

    const recipes = await Recipe.find(query)
      .populate('author', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('likes', 'name');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if recipe is public or user is the author
    if (!recipe.isPublic && (!req.user || recipe.author._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: { recipe }
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const recipeData = {
      ...req.body,
      author: req.user.id
    };

    const recipe = await Recipe.create(recipeData);
    
    // Add recipe to user's created recipes
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdRecipes: recipe._id }
    });

    await recipe.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: { recipe }
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own recipes.'
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: { recipe: updatedRecipe }
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own recipes.'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    // Remove recipe from user's created recipes and all users' favorites
    await User.updateMany(
      {},
      {
        $pull: {
          createdRecipes: req.params.id,
          favoriteRecipes: req.params.id
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Like recipe
// @route   POST /api/recipes/:id/like
// @access  Private
export const likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if already liked
    if (recipe.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already liked'
      });
    }

    recipe.likes.push(req.user.id);
    await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe liked successfully',
      data: { likesCount: recipe.likesCount }
    });
  } catch (error) {
    console.error('Like recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unlike recipe
// @route   DELETE /api/recipes/:id/like
// @access  Private
export const unlikeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if not liked
    if (!recipe.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe not liked yet'
      });
    }

    recipe.likes = recipe.likes.filter(id => id.toString() !== req.user.id);
    await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Recipe unliked successfully',
      data: { likesCount: recipe.likesCount }
    });
  } catch (error) {
    console.error('Unlike recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get recipes by category
// @route   GET /api/recipes/category/:category
// @access  Public
export const getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { category: category.toLowerCase(), isPublic: true };

    const recipes = await Recipe.find(query)
      .populate('author', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        recipes,
        category,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get recipes by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search recipes
// @route   GET /api/recipes/search
// @access  Public
export const searchRecipes = async (req, res) => {
  try {
    const { q, category, difficulty } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category) {
      query.category = category.toLowerCase();
    }

    // Difficulty filter
    if (difficulty) {
      query.difficulty = difficulty.toLowerCase();
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'name avatar')
      .sort(q ? { score: { $meta: 'textScore' } } : '-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        recipes,
        searchQuery: q,
        filters: { category, difficulty },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's favorite recipes
// @route   GET /api/recipes/favorites
// @access  Private
export const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favoriteRecipes',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    res.status(200).json({
      success: true,
      data: { recipes: user.favoriteRecipes }
    });
  } catch (error) {
    console.error('Get favorite recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's created recipes
// @route   GET /api/recipes/my-recipes
// @access  Private
export const getMyRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find({ author: req.user.id })
      .populate('author', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments({ author: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};