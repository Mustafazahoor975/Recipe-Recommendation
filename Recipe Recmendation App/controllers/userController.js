import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favoriteRecipes', 'name image category rating')
      .populate('createdRecipes', 'name image category rating likesCount');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    // Only allow users to update their own profile
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.'
      });
    }

    const { name, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req, res) => {
  try {
    // Only allow users to delete their own account
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own account.'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add recipe to favorites
// @route   POST /api/users/favorites/:recipeId
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already in favorites
    if (user.favoriteRecipes.includes(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in favorites'
      });
    }

    user.favoriteRecipes.push(recipeId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recipe added to favorites',
      data: { favoriteRecipes: user.favoriteRecipes }
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove recipe from favorites
// @route   DELETE /api/users/favorites/:recipeId
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const user = await User.findById(req.user.id);

    // Check if in favorites
    if (!user.favoriteRecipes.includes(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe not in favorites'
      });
    }

    user.favoriteRecipes = user.favoriteRecipes.filter(
      id => id.toString() !== recipeId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recipe removed from favorites',
      data: { favoriteRecipes: user.favoriteRecipes }
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};