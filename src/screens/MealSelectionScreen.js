// meal selection screen - where users pick specific meals for a meal type
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { mealsData } from '../data/mealsData';
import { getTotalCalories } from '../utils/mealHelpers';

export default function MealSelectionScreen({ 
  mealType, 
  selectedMeals, 
  onToggleMeal, 
  onBack,
  onNavigateToMeal,
  onNavigateToMenu,
  onNavigateToSummary,
  userData,
  onNavigateToAICoach
}) {
  const dailyCalories = userData?.dailyCalories || 2500;
  const userDietPreference = userData?.dietPreference || 'none';
  
  // filter meals by diet preference - only shows vegan/vegetarian compatible meals if user has that preference
  const allMeals = mealsData[mealType] || [];
  const meals = allMeals.filter(meal => meal.dietType.includes(userDietPreference));
  
  // mapping the meal type codes to nice display names
  const mealTypeNames = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snacks: 'Snacks',
    dinner: 'Dinner',
  };

  // same colors as the meal plan screen for consistency
  const mealTypeColors = {
    breakfast: '#FFD700',
    lunch: '#FF6B6B',
    snacks: '#4ECDC4',
    dinner: '#9370DB',
  };

  // check if a meal is already selected - uses name comparison since database IDs differ from mealsData IDs
  const isMealSelected = (meal) => {
    return selectedMeals[mealType]?.some(m => m.name === meal.name) || false;
  };

  const totalCalories = getTotalCalories(selectedMeals);

  const getMealTypeCalories = (type) => {
    return selectedMeals[type]?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
  };

  const breakfastCals = getMealTypeCalories('breakfast');
  const lunchCals = getMealTypeCalories('lunch');
  const snacksCals = getMealTypeCalories('snacks');
  const dinnerCals = getMealTypeCalories('dinner');

  // calculate percentages based on selected calories (not daily limit) - used for pie chart proportions
  const totalSelectedCalories = breakfastCals + lunchCals + snacksCals + dinnerCals;
  
  const breakfastPercent = totalSelectedCalories > 0 ? (breakfastCals / totalSelectedCalories) * 100 : 0;
  const lunchPercent = totalSelectedCalories > 0 ? (lunchCals / totalSelectedCalories) * 100 : 0;
  const snacksPercent = totalSelectedCalories > 0 ? (snacksCals / totalSelectedCalories) * 100 : 0;
  const dinnerPercent = totalSelectedCalories > 0 ? (dinnerCals / totalSelectedCalories) * 100 : 0;

  const renderPieChart = () => {
    const size = 140;
    
    // If no meals selected, show empty gray circle
    const totalSelectedCalories = breakfastCals + lunchCals + snacksCals + dinnerCals;
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
          <TouchableOpacity style={styles.topButton} onPress={onNavigateToMenu}>
            <Text style={styles.topButtonText}>🏠</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mealTitle}>{mealTypeNames[mealType]} time !</Text>
      </View>

      <View style={styles.chartSection}>
        {renderPieChart()}
        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            <View style={[styles.legendColor, { backgroundColor: mealTypeColors.breakfast }]} />
            <Text style={styles.legendText}>Breakfast: {breakfastCals} cal</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendColor, { backgroundColor: mealTypeColors.lunch }]} />
            <Text style={styles.legendText}>Lunch: {lunchCals} cal</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendColor, { backgroundColor: mealTypeColors.snacks }]} />
            <Text style={styles.legendText}>Snacks: {snacksCals} cal</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendColor, { backgroundColor: mealTypeColors.dinner }]} />
            <Text style={styles.legendText}>Dinner: {dinnerCals} cal</Text>
          </View>
        </View>
        <Text style={styles.totalCaloriesText}>{totalCalories} / {dailyCalories} cal</Text>
      </View>

      <View style={styles.mealsContainer}>
        {meals.map((meal) => {
          const isSelected = isMealSelected(meal);
          return (
            <View 
              key={meal.id} 
              style={[
                styles.mealCard,
                isSelected && styles.mealCardSelected
              ]}
            >
              <View style={styles.mealImagePlaceholder}>
                {meal.image ? (
                  <Image source={meal.image} style={styles.mealImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.mealEmoji}>{meal.icon}</Text>
                )}
              </View>
              
              <View style={styles.mealContent}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.caloriesBadge}>
                    <Text style={styles.caloriesText}>{meal.calories} cal</Text>
                  </View>
                </View>
                
                <Text style={styles.mealDescription}>{meal.description}</Text>
                
                <View style={styles.macrosRow}>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <Text style={styles.macroValue}>{meal.protein} g</Text>
                  </View>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <Text style={styles.macroValue}>{meal.carbs} g</Text>
                  </View>
                  <View style={styles.macroTag}>
                    <Text style={styles.macroLabel}>Fat</Text>
                    <Text style={styles.macroValue}>{meal.fat}g</Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.actionButton, isSelected && styles.selectedButton]}
                    onPress={() => onToggleMeal(mealType, meal, true)}
                  >
                    <Text style={[styles.actionButtonText, isSelected && styles.selectedButtonText]}>
                      Select
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onToggleMeal(mealType, meal, false)}
                  >
                    <Text style={styles.actionButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.summaryButton}
        onPress={onNavigateToSummary}
      >
        <Text style={styles.summaryButtonText}>View Summary</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={onNavigateToMenu}>
          <Text style={styles.navButtonText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, mealType === 'breakfast' && styles.navButtonActive]}
          onPress={() => onNavigateToMeal('breakfast')}
        >
          <Text style={[styles.navButtonText, mealType === 'breakfast' && styles.navButtonTextActive]}>
            Breakfast
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, mealType === 'lunch' && styles.navButtonActive]}
          onPress={() => onNavigateToMeal('lunch')}
        >
          <Text style={[styles.navButtonText, mealType === 'lunch' && styles.navButtonTextActive]}>
            Lunch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, mealType === 'snacks' && styles.navButtonActive]}
          onPress={() => onNavigateToMeal('snacks')}
        >
          <Text style={[styles.navButtonText, mealType === 'snacks' && styles.navButtonTextActive]}>
            Snack
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, mealType === 'dinner' && styles.navButtonActive]}
          onPress={() => onNavigateToMeal('dinner')}
        >
          <Text style={[styles.navButtonText, mealType === 'dinner' && styles.navButtonTextActive]}>
            Dinner
          </Text>
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
    paddingBottom: 10,
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
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 13,
    color: '#000',
    marginTop: 2,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  mealTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#E0B0FF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  colorNote: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  chartSection: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#F8F0FF',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0B0FF',
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
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  mealsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  summaryButton: {
    backgroundColor: '#9370DB',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 70,
  },
  summaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#F5E6F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0B0FF',
  },
  mealCardSelected: {
    backgroundColor: '#E6D5F0',
    borderColor: '#9370DB',
  },
  mealImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#D0E8F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealEmoji: {
    fontSize: 40,
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  caloriesBadge: {
    backgroundColor: '#C8A2D8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  caloriesText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  mealDescription: {
    fontSize: 13,
    color: '#333',
    marginBottom: 10,
  },
  macrosRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  macroTag: {
    backgroundColor: '#D5C0E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 8,
  },
  macroLabel: {
    fontSize: 10,
    color: '#666',
  },
  macroValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: '#E8E0F0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#9370DB',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedButtonText: {
    color: '#FFF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#8B5BA8',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 3,
  },
  navButtonActive: {
    backgroundColor: '#E8D5F0',
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
  },
  navButtonTextActive: {
    color: '#000',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 70,
    right: 20,
  },
  pageNumber: {
    fontSize: 18,
    color: '#666',
  },
});
