import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    maxlength: [100, 'Recipe name cannot exceed 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Recipe image is required']
  },
  ingredients: {
    type: String,
    required: [true, 'Ingredients are required'],
    maxlength: [1000, 'Ingredients cannot exceed 1000 characters']
  },
  steps: {
    type: String,
    required: [true, 'Cooking steps are required'],
    maxlength: [2000, 'Steps cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['breakfast', 'lunch', 'dinner', 'fastfood'],
    lowercase: true
  },
  time: {
    type: String,
    required: [true, 'Cooking time is required'],
    match: [/^\d+\s*(mins?|minutes?|hrs?|hours?)$/i, 'Please enter valid time format (e.g., "30 mins", "1 hour")']
  },
  rating: {
    type: String,
    default: '0.0',
    match: [/^[0-5](\.\d)?$/, 'Rating must be between 0.0 and 5.0']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  servings: {
    type: Number,
    default: 4,
    min: [1, 'Servings must be at least 1'],
    max: [20, 'Servings cannot exceed 20']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  nutritionInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better performance
recipeSchema.index({ category: 1 });
recipeSchema.index({ author: 1 });
recipeSchema.index({ name: 'text', ingredients: 'text' });
recipeSchema.index({ likesCount: -1 });
recipeSchema.index({ createdAt: -1 });

// Update likes count when likes array changes
recipeSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  next();
});

export default mongoose.model('Recipe', recipeSchema);