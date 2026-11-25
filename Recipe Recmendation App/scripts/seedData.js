import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

import { readFileSync } from 'node:fs';

// Load recipe data relative to this module (independent of the working directory)
const breakfastData = JSON.parse(readFileSync(new URL('../data/breakfast.json', import.meta.url), 'utf8'));
const lunchData = JSON.parse(readFileSync(new URL('../data/lunch.json', import.meta.url), 'utf8'));
const dinnerData = JSON.parse(readFileSync(new URL('../data/dinner.json', import.meta.url), 'utf8'));
const fastfoodData = JSON.parse(readFileSync(new URL('../data/fastfood.json', import.meta.url), 'utf8'));

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-app');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Recipe.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create default user for recipes
    let defaultUser = await User.findOne({ email: 'admin@recipeapp.com' });
    if (!defaultUser) {
      defaultUser = await User.create({
        name: 'Recipe Admin',
        email: 'admin@recipeapp.com',
        password: 'password123'
      });
    }

    // Create categories
    const categories = [
      {
        name: 'breakfast',
        displayName: 'Breakfast',
        emoji: '🍳',
        color: '#FFE4B5',
        description: 'Start your day with delicious Pakistani breakfast dishes'
      },
      {
        name: 'lunch',
        displayName: 'Lunch',
        emoji: '🍛',
        color: '#E6F3FF',
        description: 'Hearty and satisfying lunch recipes'
      },
      {
        name: 'dinner',
        displayName: 'Dinner',
        emoji: '🍽️',
        color: '#F0E6FF',
        description: 'Traditional dinner recipes for the family'
      },
      {
        name: 'fastfood',
        displayName: 'Fast Food',
        emoji: '🍔',
        color: '#FFE6E6',
        description: 'Quick and tasty fast food options'
      }
    ];

    await Category.insertMany(categories);
    console.log('📂 Created categories');

    // Prepare recipe data
    const allRecipes = [
      ...breakfastData.map(recipe => ({ ...recipe, category: 'breakfast', author: defaultUser._id })),
      ...lunchData.map(recipe => ({ ...recipe, category: 'lunch', author: defaultUser._id })),
      ...dinnerData.map(recipe => ({ ...recipe, category: 'dinner', author: defaultUser._id })),
      ...fastfoodData.map(recipe => ({ ...recipe, category: 'fastfood', author: defaultUser._id }))
    ];

    // Add missing fields to recipes
    const recipesWithDefaults = allRecipes.map(recipe => ({
      ...recipe,
      difficulty: 'medium',
      servings: 4,
      isPublic: true,
      tags: [],
      likes: [],
      likesCount: 0
    }));

    // Insert recipes
    await Recipe.insertMany(recipesWithDefaults);
    console.log(`🍽️ Created ${recipesWithDefaults.length} recipes`);

    // Update category recipe counts
    for (const category of categories) {
      const count = await Recipe.countDocuments({ category: category.name });
      await Category.updateOne(
        { name: category.name },
        { recipeCount: count }
      );
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
