// Supabase configuration and client setup
import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const SUPABASE_URL = 'https://jolzoahucjqkmvllydag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbHpvYWh1Y2pxa212bGx5ZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDYxNjEsImV4cCI6MjA3OTcyMjE2MX0.DERxIc9L9lNLYhDZtdyDuzIDoB7LuIqUB2bvVNeecvo';

// initialize Supabase client with auto-refresh and session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for database operations

// Get all meals from database
export const fetchMeals = async () => {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    return null;
  }
};

// Get meals by category
export const fetchMealsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    return null;
  }
};

// Save user meal plan
export const saveMealPlan = async (userId, dayNumber, mealType, mealId) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert([
        { user_id: userId, day_number: dayNumber, meal_type: mealType, meal_id: mealId }
      ]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving meal plan:', error);
    return null;
  }
};

// Get user's meal plans
export const fetchUserMealPlans = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select(`
        *,
        meals (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return null;
  }
};

// Register new user (custom authentication)
export const registerUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
};

// Login user
export const loginUser = async (username, password) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) throw error;
    
    // WARNING: storing plain text passwords - in production use bcrypt for hashing
    if (data.password_hash === password) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};
