// this file handles all the calorie and bmr calculations
// using the mifflin-st jeor equation which is scientifically proven
export const calculateBMR = (weight, height, age, gender) => {
  // different formula for males vs females
  if (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

// activity level multipliers - how active someone is affects their calorie needs
export const getActivityMultiplier = (activityLevel) => {
  const multipliers = {
    sedentary: 1.2,      // barely moving, desk job
    light: 1.375,        // light exercise 1-3 days a week
    moderate: 1.55,      // moderate exercise 3-5 days
    active: 1.725,       // hard exercise 6-7 days
    very_active: 1.9,    // athlete level activity
  };
  return multipliers[activityLevel] || 1.2;
};

// takes bmr and adjusts it based on activity and goals
export const calculateDailyCalories = (bmr, activityLevel, objective) => {
  const activityMultiplier = getActivityMultiplier(activityLevel);
  let dailyCalories = bmr * activityMultiplier;

  // if they want to lose weight, subtract 500 calories (safe deficit)
  if (objective === 'lose') {
    dailyCalories -= 500;
  } else if (objective === 'gain') {
    // if they want to gain, add 500 (safe surplus)
    dailyCalories += 500;
  }
  // maintain weight? just leave it as is

  return Math.round(dailyCalories);
};

// wrapper function that does all the calculations at once
export const processUserData = (data) => {
  const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
  const dailyCalories = calculateDailyCalories(bmr, data.activityLevel, data.objective);
  
  // Calculate BMI
  const heightInMeters = data.height / 100;
  const bmi = data.weight / (heightInMeters * heightInMeters);

  return {
    ...data,
    dailyCalories,  // add the calculated daily calories to their data
    bmi: bmi.toFixed(2),  // add BMI with 2 decimal places
    bmr: bmr.toFixed(2),  // add BMR with 2 decimal places
  };
};
