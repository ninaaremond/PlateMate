// main app component - manages navigation and state for all screens
import React, { useState, useRef } from 'react';
import { SafeAreaView, StatusBar, PanResponder, View, Alert } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import MenuScreen from './src/screens/MenuScreen';
import WeeklyPlanScreen from './src/screens/WeeklyPlanScreen';
import MealPlanScreen from './src/screens/MealPlanScreen';
import MealSelectionScreen from './src/screens/MealSelectionScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CopyPlanScreen from './src/screens/CopyPlanScreen';
import AICoachScreen from './src/screens/AICoachScreen';
// helper functions for calculations and meal management
import { processUserData } from './src/utils/calorieCalculator';
import { toggleMeal } from './src/utils/mealHelpers';
// meal data with images
import { mealsData } from './src/data/mealsData';
// supabase configuration
import { supabase } from './src/config/supabase';

export default function App() {
  // track which screen is currently active
  const [currentScreen, setCurrentScreen] = useState('welcome');
  // stores user information including calculated calories and health metrics
  const [userData, setUserData] = useState(null);
  
  // weekly meals structure - stores meals for each day of the week (1-7)
  const [weeklyMeals, setWeeklyMeals] = useState({
    1: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    2: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    3: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    4: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    5: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    6: { breakfast: [], lunch: [], snacks: [], dinner: [] },
    7: { breakfast: [], lunch: [], snacks: [], dinner: [] },
  });
  
  // track which day and meal type are currently being edited
  const [currentDay, setCurrentDay] = useState(1);
  const [currentMealType, setCurrentMealType] = useState('breakfast');

  // maintains navigation history for back button functionality
  const screenHistory = useRef(['welcome']);

  // navigate to a new screen while saving current screen to history
  const navigateToScreen = (screen) => {
    screenHistory.current.push(currentScreen);
    setCurrentScreen(screen);
  };

  // return to previous screen using history
  const navigateBack = () => {
    if (screenHistory.current.length > 0) {
      const previousScreen = screenHistory.current.pop();
      setCurrentScreen(previousScreen);
    }
  };

  // swipe gesture handler for navigation - allows swiping right to go back
  const panResponder = useRef(
    PanResponder.create({
      // trigger on swipe gestures over 50 pixels
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 50;
      },
      // navigate back if swipe distance exceeds threshold
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          navigateBack();
        }
      },
    })
  ).current;

  // authenticate user with database - verifies credentials and loads user data + meal plans
  const handleLogin = async (username, password) => {
    try {
      // query database for user with matching username
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error || !users) {
        Alert.alert('Login Failed', 'Username not found. Please check your username or register.');
        return;
      }
      
      // verify password
      if (users.password_hash !== password) {
        Alert.alert('Login Failed', 'Incorrect password. Please try again.');
        return;
      }
      
      // login successful - load user data
      const loadedUserData = {
        userId: users.id,
        name: users.name,
        password: users.password_hash,
        gender: users.gender,
        age: users.age,
        height: users.height,
        weight: users.weight,
        activityLevel: users.activity_level,
        dietPreference: users.diet_preference,
        objective: users.objective,
        dailyCalories: users.daily_calories,
        bmi: users.bmi,
        bmr: users.bmr
      };
      
      console.log('Loaded user data from database:', {
        username: users.username,
        dietPreference: users.diet_preference
      });
      
      setUserData(loadedUserData);
      
      // load user's meal plans from database
      await loadMealPlans(users.id);
      
      Alert.alert('Success', `Welcome back, ${users.name}!`);
      navigateToScreen('menu');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  // load meal plans from database
  const loadMealPlans = async (userId) => {
    try {
      const { data: mealPlans, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error loading meal plans:', error);
        return;
      }
      
      console.log(`Loading ${mealPlans.length} meals from database for user ${userId}`);
      
      // organize meal plans by day and meal type
      const organizedMeals = {
        1: { breakfast: [], lunch: [], snacks: [], dinner: [] },
        2: { breakfast: [], lunch: [], snacks: [], dinner: [] },
        3: { breakfast: [], lunch: [], snacks: [], dinner: [] },
        4: { breakfast: [], lunch: [], snacks: [], dinner: [] },
        5: { breakfast: [], lunch: [], snacks: [], dinner: [] },
        6: { breakfast: [], lunch: [], snacks: [], dinner: [] },
        7: { breakfast: [], lunch: [], snacks: [], dinner: [] },
      };
      
      // convert database records back to meal objects
      // Note: meal.id here is the database ID, NOT the mealsData.js ID - we use meal.name for comparisons
      for (const plan of mealPlans) {
        // Find the original meal from mealsData to get the image
        const originalMeal = Object.values(mealsData)
          .flat()
          .find(m => m.name === plan.meal_name);
        
        const meal = {
          id: plan.id,
          name: plan.meal_name,
          calories: plan.meal_calories,
          protein: plan.meal_protein,
          carbs: plan.meal_carbs,
          fat: plan.meal_fat,
          icon: plan.meal_icon,
          image: originalMeal?.image || null
        };
        
        console.log(`Loading meal: ${plan.meal_name} for day ${plan.day_number}, ${plan.meal_type}`);
        organizedMeals[plan.day_number][plan.meal_type].push(meal);
      }
      
      setWeeklyMeals(organizedMeals);
      console.log('Meal plans loaded successfully');
    } catch (error) {
      console.error('Error in loadMealPlans:', error);
    }
  };

  // process new user registration and calculate health metrics
  const handleRegister = async (data) => {
    try {
      // calculate health metrics
      const updatedData = processUserData(data);
      
      console.log('Attempting to save user with data:', {
        username: data.name,
        name: data.name,
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
        activity_level: data.activityLevel,
        diet_preference: data.dietPreference,
        objective: data.objective
      });
      
      // save user to Supabase database
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            username: data.name,
            name: data.name,
            password_hash: data.password,
            gender: data.gender,
            age: parseInt(data.age),
            height: parseInt(data.height),
            weight: parseInt(data.weight),
            activity_level: data.activityLevel,
            diet_preference: data.dietPreference,
            objective: data.objective,
            daily_calories: parseInt(updatedData.dailyCalories),
            bmi: parseFloat(updatedData.bmi),
            bmr: parseFloat(updatedData.bmr)
          }
        ])
        .select();
      
      if (error) {
        console.error('Error saving user to database:', error);
        Alert.alert('Registration Error', `Failed to save user data: ${error.message}`);
        return;
      }
      
      console.log('User saved successfully:', newUser);
      
      // store the user ID from database
      updatedData.userId = newUser[0].id;
      
      setUserData(updatedData);
      Alert.alert('Success', 'Account created successfully!');
      navigateToScreen('menu');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', `An error occurred during registration: ${error.message}`);
    }
  };

  const handleChooseMeals = () => {
    navigateToScreen('weeklyPlan');
  };

  const handleSelectDay = (dayId) => {
    setCurrentDay(dayId);
    navigateToScreen('mealPlan');
  };

  const handleNavigateToMeal = (mealType) => {
    setCurrentMealType(mealType);
    navigateToScreen('mealSelection');
  };

  // handle adding or removing meals - validates against daily calorie limit before adding
  const handleToggleMeal = (mealType, meal, isAdding) => {
    const dailyCalories = userData?.dailyCalories || null;
    const currentDayMeals = weeklyMeals[currentDay];
    const result = toggleMeal(currentDayMeals, mealType, meal, isAdding, dailyCalories);
    
    // alert user if adding meal would exceed daily calorie limit
    if (result.exceeded) {
      Alert.alert(
        'Calorie Limit Reached',
        `You've reached the maximum amount of calories allocated to you! Adding this meal would exceed your daily limit of ${dailyCalories} calories.`,
        [{ text: 'OK' }]
      );
    } else {
      // update meal selection for current day
      setWeeklyMeals({
        ...weeklyMeals,
        [currentDay]: result.selectedMeals
      });
      
      // save to database
      if (userData?.userId) {
        saveMealPlanToDatabase(currentDay, mealType, meal, isAdding);
      }
    }
  };

  // save or remove meal plan entry in database - handles both insert and delete operations
  const saveMealPlanToDatabase = async (dayNumber, mealType, meal, isAdding) => {
    try {
      if (isAdding) {
        // add meal to database with all nutritional data
        const { error } = await supabase
          .from('meal_plans')
          .insert([
            {
              user_id: userData.userId,
              day_number: dayNumber,
              meal_type: mealType,
              meal_name: meal.name,
              meal_calories: meal.calories,
              meal_protein: meal.protein || 0,
              meal_carbs: meal.carbs || 0,
              meal_fat: meal.fat || 0,
              meal_icon: meal.icon || ''
            }
          ]);
        
        if (error) {
          console.error('Error saving meal plan:', error);
        } else {
          console.log('Meal plan saved to database');
        }
      } else {
        // remove meal from database - uses meal_name for matching since database IDs differ from mealsData.js IDs
        const { error } = await supabase
          .from('meal_plans')
          .delete()
          .eq('user_id', userData.userId)
          .eq('day_number', dayNumber)
          .eq('meal_type', mealType)
          .eq('meal_name', meal.name);
        
        if (error) {
          console.error('Error removing meal plan:', error);
        } else {
          console.log('Meal plan removed from database');
        }
      }
    } catch (error) {
      console.error('Error in saveMealPlanToDatabase:', error);
    }
  };

  const handleNavigateToSummary = () => {
    navigateToScreen('summary');
  };

  const handleBackToMealPlan = () => {
    setCurrentScreen('mealPlan');
  };

  const handleBackToWeeklyPlan = () => {
    setCurrentScreen('weeklyPlan');
  };

  const handleNavigateToCopyPlan = () => {
    navigateToScreen('copyPlan');
  };

  const handleNavigateToSettings = () => {
    navigateToScreen('settings');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  // navigate to AI coach screen
  const handleNavigateToAICoach = () => {
    navigateToScreen('aiCoach');
  };

  // update user settings - recalculates health metrics and handles diet preference changes
  const handleUpdateUserData = async (data) => {
    try {
      // calculate updated health metrics (BMI, BMR, daily calories)
      const updatedData = processUserData(data);
      
      // check if diet preference changed - need to remove incompatible meals if switching to vegan/vegetarian
      const dietPreferenceChanged = userData?.dietPreference !== data.dietPreference;
      const oldPreference = userData?.dietPreference;
      const newPreference = data.dietPreference;
      
      // update user in Supabase database
      if (userData?.userId) {
        const { error } = await supabase
          .from('users')
          .update({
            username: data.name,
            name: data.name,
            password_hash: data.password,
            gender: data.gender,
            age: parseInt(data.age),
            height: parseInt(data.height),
            weight: parseInt(data.weight),
            activity_level: data.activityLevel,
            diet_preference: data.dietPreference,
            objective: data.objective,
            daily_calories: parseInt(updatedData.dailyCalories),
            bmi: parseFloat(updatedData.bmi),
            bmr: parseFloat(updatedData.bmr),
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.userId);
        
        if (error) {
          console.error('Error updating user in database:', error);
          Alert.alert('Update Error', 'Failed to update user data in database.');
          return;
        }
        
        console.log('User updated successfully in database with diet preference:', data.dietPreference);
        
        // if diet preference changed, handle meal removal
        if (dietPreferenceChanged) {
          await handleDietPreferenceChange(userData.userId, oldPreference, newPreference);
        }
      }
      
      // update local state with new user data
      setUserData(updatedData);
      
      // Small delay to ensure database write completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setCurrentScreen('weeklyPlan');
      Alert.alert(
        'Settings Updated',
        'Your information has been successfully updated!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'An error occurred while updating your information.');
    }
  };

  // handle diet preference changes - removes meat/fish meals when switching TO vegan/vegetarian (one-way only)
  const handleDietPreferenceChange = async (userId, oldPreference, newPreference) => {
    try {
      // Only remove meals when changing TO vegan or vegetarian (keeps all meals when changing back to 'none')
      if (newPreference === 'vegan' || newPreference === 'vegetarian') {
        // List of meals containing meat/fish that aren't compatible with vegan/vegetarian diets
        const nonVegetarianMeals = [
          'Grilled Chicken Salad',
          'Turkey Sandwich',
          'Salmon with Rice',
          'Grilled Steak with Veggies',
          'Chicken Curry with Rice',
          'Fish Tacos'
        ];
        
        // Delete these meals from user's meal plans
        const { error } = await supabase
          .from('meal_plans')
          .delete()
          .eq('user_id', userId)
          .in('meal_name', nonVegetarianMeals);
        
        if (error) {
          console.error('Error removing non-vegetarian meals:', error);
        } else {
          console.log(`Removed non-vegetarian meals for ${newPreference} preference`);
        }
        
        // Reload meal plans to reflect changes
        await loadMealPlans(userId);
      }
      // If changing back to 'none', do nothing - keep all current meals
    } catch (error) {
      console.error('Error handling diet preference change:', error);
    }
  };

  // copy meal plan from one day to another - supports copying to single or multiple target days
  const handleCopyToDay = async (fromDay, toDays) => {
    const planToCopy = weeklyMeals[fromDay];
    const updatedWeeklyMeals = { ...weeklyMeals };
    
    // convert to array format for consistent processing (handles both number and array inputs)
    const daysArray = Array.isArray(toDays) ? toDays : [toDays];
    
    daysArray.forEach(toDay => {
      updatedWeeklyMeals[toDay] = {
        breakfast: [...planToCopy.breakfast],
        lunch: [...planToCopy.lunch],
        snacks: [...planToCopy.snacks],
        dinner: [...planToCopy.dinner],
      };
    });
    
    setWeeklyMeals(updatedWeeklyMeals);
    
    // save copied plans to database
    if (userData?.userId) {
      await saveCopiedPlansToDatabase(fromDay, daysArray);
    }
  };

  // copy current day's meal plan to all days of the week
  const handleCopyToAllDays = async (fromDay) => {
    const planToCopy = weeklyMeals[fromDay];
    const newWeeklyMeals = {};
    
    for (let day = 1; day <= 7; day++) {
      newWeeklyMeals[day] = {
        breakfast: [...planToCopy.breakfast],
        lunch: [...planToCopy.lunch],
        snacks: [...planToCopy.snacks],
        dinner: [...planToCopy.dinner],
      };
    }
    
    setWeeklyMeals(newWeeklyMeals);
    
    // save all copied plans to database
    if (userData?.userId) {
      const allDays = [1, 2, 3, 4, 5, 6, 7];
      await saveCopiedPlansToDatabase(fromDay, allDays);
    }
  };

  const handleSkipCopyPlan = () => {
    navigateToScreen('weeklyPlan');
  };

  // save copied meal plans to database - clears target days first then inserts all meals from source day
  const saveCopiedPlansToDatabase = async (fromDay, toDays) => {
    try {
      const planToCopy = weeklyMeals[fromDay];
      
      for (const toDay of toDays) {
        // delete existing meals for target day to avoid duplicates
        await supabase
          .from('meal_plans')
          .delete()
          .eq('user_id', userData.userId)
          .eq('day_number', toDay);
        
        // insert all meals from source day to target day
        const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
        
        for (const mealType of mealTypes) {
          const meals = planToCopy[mealType];
          
          for (const meal of meals) {
            await supabase
              .from('meal_plans')
              .insert([
                {
                  user_id: userData.userId,
                  day_number: toDay,
                  meal_type: mealType,
                  meal_name: meal.name,
                  meal_calories: meal.calories,
                  meal_protein: meal.protein || 0,
                  meal_carbs: meal.carbs || 0,
                  meal_fat: meal.fat || 0,
                  meal_icon: meal.icon || ''
                }
              ]);
          }
        }
      }
      
      console.log('Copied plans saved to database successfully');
    } catch (error) {
      console.error('Error saving copied plans:', error);
    }
  };

  // reset all days in the weekly meal plan - shows confirmation dialog before clearing all meals
  const handleResetAllDays = () => {
    Alert.alert(
      'Reset All Days',
      'Are you sure you want to reset your entire weekly meal plan? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: async () => {
            try {
              // delete all meal plans from database
              if (userData?.userId) {
                const { error } = await supabase
                  .from('meal_plans')
                  .delete()
                  .eq('user_id', userData.userId);
                
                if (error) {
                  console.error('Error deleting meal plans:', error);
                  Alert.alert('Error', 'Failed to reset meal plans in database.');
                  return;
                }
                
                console.log('All meal plans deleted from database');
              }
              
              // reset local state
              setWeeklyMeals({
                1: { breakfast: [], lunch: [], snacks: [], dinner: [] },
                2: { breakfast: [], lunch: [], snacks: [], dinner: [] },
                3: { breakfast: [], lunch: [], snacks: [], dinner: [] },
                4: { breakfast: [], lunch: [], snacks: [], dinner: [] },
                5: { breakfast: [], lunch: [], snacks: [], dinner: [] },
                6: { breakfast: [], lunch: [], snacks: [], dinner: [] },
                7: { breakfast: [], lunch: [], snacks: [], dinner: [] },
              });
              
              Alert.alert('Success', 'All meal plans have been reset.');
            } catch (error) {
              console.error('Error resetting meal plans:', error);
              Alert.alert('Error', 'An error occurred while resetting meal plans.');
            }
          }
        }
      ]
    );
  };

  // reset a specific day in the meal plan - clears all meals for that day after confirmation
  const handleResetDay = (dayNumber) => {
    const daysOfWeek = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = daysOfWeek[dayNumber] || `Day ${dayNumber}`;
    
    Alert.alert(
      `Reset ${dayName}`,
      `Are you sure you want to reset your meal plan for ${dayName}? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset Day',
          style: 'destructive',
          onPress: async () => {
            try {
              // delete meal plans for this day from database
              if (userData?.userId) {
                const { error } = await supabase
                  .from('meal_plans')
                  .delete()
                  .eq('user_id', userData.userId)
                  .eq('day_number', dayNumber);
                
                if (error) {
                  console.error('Error deleting day meal plan:', error);
                  Alert.alert('Error', 'Failed to reset day meal plan in database.');
                  return;
                }
                
                console.log(`Meal plan for day ${dayNumber} deleted from database`);
              }
              
              // reset local state for this day
              setWeeklyMeals(prev => ({
                ...prev,
                [dayNumber]: { breakfast: [], lunch: [], snacks: [], dinner: [] }
              }));
              
              Alert.alert('Success', `Meal plan for ${dayName} has been reset.`);
            } catch (error) {
              console.error('Error resetting day meal plan:', error);
              Alert.alert('Error', 'An error occurred while resetting the day meal plan.');
            }
          }
        }
      ]
    );
  };


  // render appropriate screen based on current navigation state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onLogin={() => navigateToScreen('login')}
            onRegister={() => navigateToScreen('registration')}
          />
        );

      case 'login':
        return (
          <LoginScreen 
            onLogin={handleLogin}
            onBack={navigateBack}
          />
        );

      case 'registration':
        return (
          <RegistrationScreen 
            onRegister={handleRegister}
          />
        );

      case 'menu':
        return (
          <MenuScreen 
            userData={userData}
            onChooseMeals={handleChooseMeals}
            onNavigateToAICoach={handleNavigateToAICoach}
          />
        );

      case 'weeklyPlan':
        return (
          <WeeklyPlanScreen 
            weeklyMeals={weeklyMeals}
            onSelectDay={handleSelectDay}
            onNavigateToSettings={handleNavigateToSettings}
            onBackToMenu={handleBackToMenu}
            userData={userData}
            onNavigateToAICoach={handleNavigateToAICoach}
            onResetAllDays={handleResetAllDays}
          />
        );

      case 'mealPlan':
        return (
          <MealPlanScreen 
            userData={userData}
            selectedMeals={weeklyMeals[currentDay]}
            currentDay={currentDay}
            onNavigateToMeal={handleNavigateToMeal}
            onNavigateToSummary={handleNavigateToSummary}
            onNavigateToSettings={handleNavigateToSettings}
            onBackToWeeklyPlan={handleBackToWeeklyPlan}
            onNavigateToCopyPlan={handleNavigateToCopyPlan}
            onBackToMenu={handleBackToMenu}
            onNavigateToAICoach={handleNavigateToAICoach}
            onResetDay={handleResetDay}
          />
        );

      case 'mealSelection':
        return (
          <MealSelectionScreen 
            mealType={currentMealType}
            selectedMeals={weeklyMeals[currentDay]}
            onToggleMeal={handleToggleMeal}
            onBack={navigateBack}
            onNavigateToMeal={handleNavigateToMeal}
            onNavigateToMenu={handleBackToMealPlan}
            onNavigateToSummary={handleNavigateToSummary}
            userData={userData}
            onNavigateToAICoach={handleNavigateToAICoach}
          />
        );

      case 'summary':
        return (
          <SummaryScreen 
            selectedMeals={weeklyMeals[currentDay]}
            currentDay={currentDay}
            userData={userData}
            onBack={handleBackToMealPlan}
            onRemoveMeal={handleToggleMeal}
          />
        );

      case 'copyPlan':
        return (
          <CopyPlanScreen 
            currentDay={currentDay}
            weeklyMeals={weeklyMeals}
            onCopyToDay={handleCopyToDay}
            onCopyToAllDays={handleCopyToAllDays}
            onSkip={handleSkipCopyPlan}
            onBack={handleBackToWeeklyPlan}
          />
        );

      case 'settings':
        return (
          <SettingsScreen 
            userData={userData}
            onUpdateUserData={handleUpdateUserData}
            onBack={navigateBack}
          />
        );

      case 'aiCoach':
        return (
          <AICoachScreen 
            userData={userData}
            onBack={navigateBack}
          />
        );

      default:
        return (
          <WelcomeScreen 
            onLogin={() => navigateToScreen('login')} 
            onRegister={() => navigateToScreen('registration')} 
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8DC" />
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}