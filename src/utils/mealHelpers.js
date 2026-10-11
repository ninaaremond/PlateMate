// helper functions for working with meal selections

// adds up all the calories from all selected meals
export const getTotalCalories = (selectedMeals) => {
  let total = 0;
  Object.values(selectedMeals).forEach(mealList => {
    mealList.forEach(meal => {
      total += meal.calories;
    });
  });
  return total;
};

// calculates total macros (protein, carbs, fat) across all meals
export const getTotalMacros = (selectedMeals) => {
  let protein = 0, carbs = 0, fat = 0;
  Object.values(selectedMeals).forEach(mealList => {
    mealList.forEach(meal => {
      protein += meal.protein;
      carbs += meal.carbs;
      fat += meal.fat;
    });
  });
  return { protein, carbs, fat };
};

// handles adding or removing a meal from the selection
export const toggleMeal = (selectedMeals, mealType, meal, isAdding, dailyCalories = null) => {
  const currentMeals = selectedMeals[mealType] || [];
  
  if (isAdding) {
    // make sure we don't add the same meal twice (compare by name)
    if (!currentMeals.some(m => m.name === meal.name)) {
      // check if adding this meal would exceed daily calorie limit
      if (dailyCalories) {
        const currentTotal = getTotalCalories(selectedMeals);
        const newTotal = currentTotal + meal.calories;
        
        // calorie limit exceeded
        if (newTotal > dailyCalories) {
          return { exceeded: true, selectedMeals };
        }
      }
      
      // all good, add the meal
      return {
        exceeded: false,
        selectedMeals: {
          ...selectedMeals,
          [mealType]: [...currentMeals, meal],
        }
      };
    }
  } else {
    // removing a meal - filter it out (compare by name)
    return {
      exceeded: false,
      selectedMeals: {
        ...selectedMeals,
        [mealType]: currentMeals.filter(m => m.name !== meal.name),
      }
    };
  }
  
  return { exceeded: false, selectedMeals };
};

// flattens all meals into one array with their meal type attached
export const getAllSelectedMeals = (selectedMeals) => {
  const allMeals = [];
  Object.keys(selectedMeals).forEach(mealType => {
    selectedMeals[mealType].forEach(meal => {
      allMeals.push({ ...meal, mealType });
    });
  });
  return allMeals;
};
