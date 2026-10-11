// weekly plan screen - lets users choose which days to plan for
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function WeeklyPlanScreen({ 
  weeklyMeals, 
  onSelectDay, 
  onNavigateToSettings, 
  onBackToMenu,
  userData,
  onNavigateToAICoach,
  onResetAllDays
}) {
  const daysOfWeek = [
    { id: 1, name: 'Day 1', label: 'Monday' },
    { id: 2, name: 'Day 2', label: 'Tuesday' },
    { id: 3, name: 'Day 3', label: 'Wednesday' },
    { id: 4, name: 'Day 4', label: 'Thursday' },
    { id: 5, name: 'Day 5', label: 'Friday' },
    { id: 6, name: 'Day 6', label: 'Saturday' },
    { id: 7, name: 'Day 7', label: 'Sunday' },
  ];

  // check if a day has any meals planned - used to show checkmark indicator
  const isDayPlanned = (dayId) => {
    const dayMeals = weeklyMeals[dayId];
    if (!dayMeals) return false;
    return Object.values(dayMeals).some(mealList => mealList && mealList.length > 0);
  };

  // get total calories for a specific day - sums all meals across breakfast/lunch/snacks/dinner
  const getDayCalories = (dayId) => {
    const dayMeals = weeklyMeals[dayId];
    if (!dayMeals) return 0;
    
    let total = 0;
    Object.values(dayMeals).forEach(mealList => {
      if (mealList) {
        mealList.forEach(meal => {
          total += meal.calories;
        });
      }
    });
    return total;
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
          <TouchableOpacity style={styles.topButton} onPress={onBackToMenu}>
            <Text style={styles.topButtonText}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topButton} onPress={onNavigateToSettings}>
            <Text style={styles.topButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Weekly Meal Plan</Text>
        <Text style={styles.description}>
          Select a day to plan your meals. You can plan as many days as you want!
        </Text>

        <View style={styles.daysGrid}>
          {daysOfWeek.map((day) => {
            const hasPlanned = isDayPlanned(day.id);
            const calories = getDayCalories(day.id);
            
            return (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayCard,
                  hasPlanned && styles.dayCardPlanned
                ]}
                onPress={() => onSelectDay(day.id)}
              >
                <View style={styles.dayCardHeader}>
                  <Text style={styles.dayName}>{day.name}</Text>
                  <Text style={styles.dayLabel}>{day.label}</Text>
                </View>
                
                {hasPlanned ? (
                  <View style={styles.dayCardContent}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.plannedText}>Planned</Text>
                    <Text style={styles.caloriesText}>{calories} cal</Text>
                  </View>
                ) : (
                  <View style={styles.dayCardContent}>
                    <Text style={styles.plusIcon}>+</Text>
                    <Text style={styles.notPlannedText}>Plan this day</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={onResetAllDays}>
          <Text style={styles.resetButtonText}>Reset All Days</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  dayCard: {
    width: '48%',
    backgroundColor: '#F5E6F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0B0FF',
    minHeight: 120,
  },
  dayCardPlanned: {
    backgroundColor: '#E6F5E6',
    borderColor: '#90EE90',
  },
  dayCardHeader: {
    marginBottom: 10,
  },
  dayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  dayLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dayCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  checkmark: {
    fontSize: 30,
    color: '#4CAF50',
    marginBottom: 5,
  },
  plusIcon: {
    fontSize: 30,
    color: '#9370DB',
    marginBottom: 5,
  },
  plannedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  notPlannedText: {
    fontSize: 14,
    color: '#9370DB',
  },
  caloriesText: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#FF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
