// meal plan screen - overview of all meal types with a cool pie chart
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getTotalCalories, getTotalMacros } from '../utils/mealHelpers';

export default function MealPlanScreen({ 
  userData, 
  selectedMeals, 
  currentDay, 
  onNavigateToMeal, 
  onNavigateToSummary, 
  onNavigateToSettings, 
  onBackToWeeklyPlan,
  onBackToMenu,
  onNavigateToCopyPlan,
  onNavigateToAICoach,
  onResetDay
}) {
  const dailyCalories = userData?.dailyCalories || 2500;

  // calculate how many calories and macros they've selected so far
  const totalCalories = getTotalCalories(selectedMeals);
  const macros = getTotalMacros(selectedMeals);
  const caloriePercentage = (totalCalories / dailyCalories) * 100;

  const daysOfWeek = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDayName = daysOfWeek[currentDay] || `Day ${currentDay}`;

  // check if the user has selected any meals for this day
  const hasMeals = totalCalories > 0;

  // each meal type gets its own color for the pie chart
  const mealTypeColors = {
    breakfast: '#FFD700',
    lunch: '#FF6B6B',
    snacks: '#4ECDC4',
    dinner: '#9370DB',
  };

  // helper to get calories for a specific meal type
  const getMealTypeCalories = (type) => {
    return selectedMeals[type]?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
  };

  // grab calories for each meal type
  const breakfastCals = getMealTypeCalories('breakfast');
  const lunchCals = getMealTypeCalories('lunch');
  const snacksCals = getMealTypeCalories('snacks');
  const dinnerCals = getMealTypeCalories('dinner');

  // Calculate percentages based on total calories selected (not daily limit)
  const totalSelectedCalories = breakfastCals + lunchCals + snacksCals + dinnerCals;
  
  // these percentages are what we use for the pie chart slices
  const breakfastPercent = totalSelectedCalories > 0 ? (breakfastCals / totalSelectedCalories) * 100 : 0;
  const lunchPercent = totalSelectedCalories > 0 ? (lunchCals / totalSelectedCalories) * 100 : 0;
  const snacksPercent = totalSelectedCalories > 0 ? (snacksCals / totalSelectedCalories) * 100 : 0;
  const dinnerPercent = totalSelectedCalories > 0 ? (dinnerCals / totalSelectedCalories) * 100 : 0;

  // returns the icon image for each meal type (breakfast, lunch, snacks, dinner)
  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: require('../../assets/meals/meal icons/Breakfast Icon.png'),
      lunch: require('../../assets/meals/meal icons/Lunch Icon.png'),
      snacks: require('../../assets/meals/meal icons/Snack Icon.png'),
      dinner: require('../../assets/meals/meal icons/Dinner Icon.png'),
    };
    return icons[mealType] || icons.breakfast;
  };

  // builds pie chart by creating colored segments based on meal type calorie proportions
  const renderPieChart = () => {
    const size = 140;
    
    // If no meals selected, show empty gray circle
    if (totalSelectedCalories === 0) {
      return (
        <View style={styles.pieChartContainer}>
          <View style={[styles.pieChart, { width: size, height: size, backgroundColor: '#E0E0E0' }]} />
        </View>
      );
    }
    
    // Build the segments array with cumulative degrees
    const segments = [];
    let cumulativeDegrees = 0;
    
    // create pie slice for each meal type - convert percentage to degrees (360° = full circle)
    if (breakfastPercent > 0) {
      const degrees = (breakfastPercent / 100) * 360;
      segments.push({ color: mealTypeColors.breakfast, start: cumulativeDegrees, degrees });
      cumulativeDegrees += degrees;
    }
    
    if (lunchPercent > 0) {
      const degrees = (lunchPercent / 100) * 360;
      segments.push({ color: mealTypeColors.lunch, start: cumulativeDegrees, degrees });
      cumulativeDegrees += degrees;
    }
    
    if (snacksPercent > 0) {
      const degrees = (snacksPercent / 100) * 360;
      segments.push({ color: mealTypeColors.snacks, start: cumulativeDegrees, degrees });
      cumulativeDegrees += degrees;
    }
    
    if (dinnerPercent > 0) {
      const degrees = (dinnerPercent / 100) * 360;
      segments.push({ color: mealTypeColors.dinner, start: cumulativeDegrees, degrees });
      cumulativeDegrees += degrees;
    }
    
    // now render the actual pie chart by creating thin slices for each degree
    return (
      <View style={styles.pieChartContainer}>
        <View style={[styles.pieChart, { width: size, height: size }]}>
          {segments.map((segment, index) => {
            // Each segment is made up of triangular slices
            const sliceCount = Math.ceil(segment.degrees);
            const slices = [];
            
            for (let i = 0; i < sliceCount; i++) {
              const angle = segment.start + i;
              slices.push(
                <View
                  key={`${index}-${i}`}
                  style={[
                    styles.pieSlice,
                    {
                      backgroundColor: segment.color,
                      transform: [{ rotate: `${angle}deg` }],
                    }
                  ]}
                />
              );
            }
            
            return slices;
          })}
        </View>
      </View>
    );
  };

  const renderMealCard = (mealType, displayName) => {
    const mealCount = selectedMeals[mealType]?.length || 0;
    const mealTypeCalories = getMealTypeCalories(mealType);
    
    return (
      <TouchableOpacity 
        style={styles.mealCard}
        onPress={() => onNavigateToMeal(mealType)}
        activeOpacity={0.7}
      >
        <View style={styles.mealIconContainer}>
          <Image source={getMealIcon(mealType)} style={styles.mealIconImage} resizeMode="contain" />
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealTitle}>{displayName}</Text>
          <Text style={styles.mealCalories}>{mealTypeCalories} calories</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>▶</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/PlateMateNew.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appTitle}>PlateMate</Text>
        <Text style={styles.subtitle}>Your friendly meal-planning buddy!</Text>
        
        <View style={styles.topLeftButton}>
          <TouchableOpacity style={styles.topButton} onPress={onNavigateToAICoach}>
            <Text style={styles.topButtonText}>🤖</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.topRightButtons}>
          <TouchableOpacity style={styles.topButton} onPress={onBackToWeeklyPlan}>
            <Text style={styles.topButtonText}>📅</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topButton} onPress={onBackToMenu}>
            <Text style={styles.topButtonText}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topButton} onPress={onNavigateToSettings}>
            <Text style={styles.topButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dayIndicator}>
        <Text style={styles.dayIndicatorText}>Planning: Day {currentDay} - {currentDayName}</Text>
      </View>

      <View style={styles.gaugeSection}>
        {renderPieChart()}
        <View style={styles.legendContainer}>
          <View style={styles.legendRowPair}>
            <View style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: mealTypeColors.breakfast }]} />
              <Text style={styles.legendText}>Breakfast: {breakfastCals} cal</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: mealTypeColors.lunch }]} />
              <Text style={styles.legendText}>Lunch: {lunchCals} cal</Text>
            </View>
          </View>
          <View style={styles.legendRowPair}>
            <View style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: mealTypeColors.snacks }]} />
              <Text style={styles.legendText}>Snacks: {snacksCals} cal</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendColor, { backgroundColor: mealTypeColors.dinner }]} />
              <Text style={styles.legendText}>Dinner: {dinnerCals} cal</Text>
            </View>
          </View>
        </View>
        <Text style={styles.totalCaloriesText}>{totalCalories} / {dailyCalories} cal</Text>

        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <View style={styles.macroBar} />
            <Text style={styles.macroText}>{macros.carbs}g glucides</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.macroBar} />
            <Text style={styles.macroText}>{macros.protein}g proteines</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={styles.macroBar} />
            <Text style={styles.macroText}>{macros.fat}g lipides</Text>
          </View>
        </View>
      </View>

      <View style={styles.mealsSection}>
        {renderMealCard('breakfast', 'Breakfast')}
        {renderMealCard('lunch', 'Lunch')}
        {renderMealCard('snacks', 'Snacks')}
        {renderMealCard('dinner', 'Dinner')}
      </View>

      <View style={styles.buttonSection}>
        {hasMeals && (
          <>
            <TouchableOpacity 
              style={styles.copyPlanButton}
              onPress={onNavigateToCopyPlan}
            >
              <Text style={styles.copyPlanButtonText}>📋 Copy This Plan to Other Days</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resetDayButton}
              onPress={() => onResetDay(currentDay)}
            >
              <Text style={styles.resetDayButtonText}>Reset This Day</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity 
          style={styles.summaryButton}
          onPress={onNavigateToSummary}
        >
          <Text style={styles.summaryButtonText}>View Summary</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    position: 'relative',
  },
  topRightButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  topLeftButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  topButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E0B0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#C77DC7',
  },
  topButtonText: {
    fontSize: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    marginTop: 3,
  },
  dayIndicator: {
    backgroundColor: '#E0B0FF',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  dayIndicatorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  gaugeSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pieChartContainer: {
    marginBottom: 15,
  },
  pieChart: {
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#C77DC7',
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    width: 1,
    height: '50%',
    left: '50%',
    top: 0,
    transformOrigin: 'bottom',
  },
  legendContainer: {
    width: '90%',
    marginBottom: 10,
    alignItems: 'center',
  },
  legendRowPair: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#999',
  },
  legendText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  totalCaloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
    marginBottom: 15,
  },
  dynamicText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  gauge: {
    width: 250,
    height: 120,
    borderRadius: 125,
    borderWidth: 20,
    borderColor: '#E0B0FF',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '180deg' }],
    marginBottom: 10,
  },
  gaugeFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#C77DC7',
    borderRadius: 125,
  },
  gaugeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: -60,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroBar: {
    width: 100,
    height: 8,
    backgroundColor: '#E0B0FF',
    borderRadius: 4,
    marginBottom: 5,
  },
  macroText: {
    fontSize: 12,
    color: '#000',
  },
  mealsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0D0F0',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0B0FF',
  },
  mealIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  mealIconImage: {
    width: 60,
    height: 60,
  },
  mealIcon: {
    fontSize: 30,
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  mealCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9370DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#FFF',
  },
  pageIndicator: {
    alignSelf: 'flex-end',
    marginRight: 30,
    marginBottom: 10,
  },
  pageNumber: {
    fontSize: 18,
    color: '#666',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  copyPlanButton: {
    backgroundColor: '#FFB347',
    marginVertical: 10,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  copyPlanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  resetDayButton: {
    backgroundColor: '#FF6B6B',
    marginVertical: 10,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  resetDayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  summaryButton: {
    backgroundColor: '#9370DB',
    marginVertical: 5,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  summaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
