// summary screen - displays all selected meals in a grid layout with filtering
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { getTotalCalories, getAllSelectedMeals, getTotalMacros } from '../utils/mealHelpers';

export default function SummaryScreen({ selectedMeals, currentDay, userData, onBack, onRemoveMeal }) {
  const [sortBy, setSortBy] = useState('all');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const dailyCalories = userData?.dailyCalories || 2500;

  const daysOfWeek = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDayName = daysOfWeek[currentDay] || `Day ${currentDay}`;

  const sortOptions = [
    { label: 'All Meals', value: 'all' },
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Snacks', value: 'snacks' },
    { label: 'Dinner', value: 'dinner' },
  ];

  const selectSort = (value) => {
    setSortBy(value);
    setSortModalVisible(false);
  };

  // assign unique background color for each meal type
  const getMealTypeColor = (mealType) => {
    const colors = {
      breakfast: '#E8A0C8',
      lunch: '#A0D8E8',
      snacks: '#F8E8A0',
      dinner: '#B8D8A0',
    };
    return colors[mealType] || '#E0E0E0';
  };

  // convert meal type codes to display names
  const getMealTypeName = (mealType) => {
    const names = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      snacks: 'Snack',
      dinner: 'Diner',
    };
    return names[mealType] || mealType;
  };

  // get all meals and calculate totals
  const allMeals = getAllSelectedMeals(selectedMeals);
  const totalCalories = getTotalCalories(selectedMeals);
  const totalMacros = getTotalMacros(selectedMeals);

  // calculate recommended daily macros - standard 50% carbs, 25% protein, 25% fat
  // carbs and protein = 4 cal/gram, fat = 9 cal/gram
  const recommendedCarbs = Math.round((dailyCalories * 0.50) / 4);
  const recommendedProtein = Math.round((dailyCalories * 0.25) / 4);
  const recommendedFat = Math.round((dailyCalories * 0.25) / 9);

  // filter meals based on selected meal type
  const filteredMeals = sortBy === 'all' 
    ? allMeals 
    : allMeals.filter(meal => meal.mealType === sortBy);

  // render each meal as a card in the grid
  const renderMealCard = (meal) => {
    return (
      <View key={`${meal.mealType}-${meal.id}`} style={styles.mealCard}>
        <View style={[styles.mealTypeLabel, { backgroundColor: getMealTypeColor(meal.mealType) }]}>
          <Text style={styles.mealTypeLabelText}>{getMealTypeName(meal.mealType)}</Text>
        </View>

        {meal.image ? (
          <View style={styles.mealImageContainer}>
            <Image 
              source={meal.image} 
              style={styles.mealImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.mealImagePlaceholder}>
            <Text style={styles.mealEmoji}>{meal.icon}</Text>
          </View>
        )}

        <View style={styles.mealDetails}>
          <Text style={styles.mealName}>{meal.name}</Text>
          
          <View style={styles.caloriesBadge}>
            <Text style={styles.caloriesText}>{meal.calories} cal</Text>
          </View>

          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{meal.protein} g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{meal.carbs} g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>{meal.fat}g</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => onRemoveMeal(meal.mealType, meal)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/PlateMateNew.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>PlateMate</Text>
          <Text style={styles.subtitle}>Your friendly meal-planning buddy!</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Summary - Day {currentDay} ({currentDayName})</Text>
          
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Filter by :</Text>
            <TouchableOpacity 
              style={styles.sortDropdown}
              onPress={() => setSortModalVisible(true)}
            >
              <Text style={styles.sortText}>
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Text>
              <Text style={styles.sortIcon}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Macro bars section - shows carbs, protein, fat progress */}
        <View style={styles.macrosSection}>
          <Text style={styles.macrosTitle}>Macronutrients</Text>
          
          <View style={styles.macroBarContainer}>
            <View style={styles.macroBarHeader}>
              <Text style={styles.macroBarLabel}>Glucides (Carbs)</Text>
              <Text style={styles.macroBarValue}>{totalMacros.carbs}g / {recommendedCarbs}g</Text>
            </View>
            <View style={styles.macroBarTrack}>
              <View 
                style={[
                  styles.macroBarFill, 
                  styles.macroBarCarbs,
                  { width: `${Math.min((totalMacros.carbs / recommendedCarbs) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.macroBarContainer}>
            <View style={styles.macroBarHeader}>
              <Text style={styles.macroBarLabel}>Protéines (Protein)</Text>
              <Text style={styles.macroBarValue}>{totalMacros.protein}g / {recommendedProtein}g</Text>
            </View>
            <View style={styles.macroBarTrack}>
              <View 
                style={[
                  styles.macroBarFill, 
                  styles.macroBarProtein,
                  { width: `${Math.min((totalMacros.protein / recommendedProtein) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.macroBarContainer}>
            <View style={styles.macroBarHeader}>
              <Text style={styles.macroBarLabel}>Lipides (Fat)</Text>
              <Text style={styles.macroBarValue}>{totalMacros.fat}g / {recommendedFat}g</Text>
            </View>
            <View style={styles.macroBarTrack}>
              <View 
                style={[
                  styles.macroBarFill, 
                  styles.macroBarFat,
                  { width: `${Math.min((totalMacros.fat / recommendedFat) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <Modal
          visible={sortModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSortModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setSortModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter by Meal Type</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    sortBy === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => selectSort(option.value)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    sortBy === option.value && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {sortBy === option.value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setSortModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.mealsGrid}>
          {filteredMeals.length > 0 ? (
            filteredMeals.map(meal => renderMealCard(meal))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No meals selected yet</Text>
              <TouchableOpacity style={styles.addMealsButton} onPress={onBack}>
                <Text style={styles.addMealsButtonText}>Add Meals</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back to Meal Plan</Text>
        </TouchableOpacity>
        <Text style={styles.totalText}>Total Calories : {totalCalories} / {dailyCalories} Calories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sortLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  sortDropdown: {
    backgroundColor: '#F8E0FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0B0E0',
    minWidth: 150,
  },
  sortText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    flex: 1,
  },
  sortIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  modalOptionSelected: {
    backgroundColor: '#E0B0FF',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextSelected: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#C77DC7',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  mealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  mealCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 12,
    margin: '1%',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  mealTypeLabel: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
  },
  mealTypeLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  mealImageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#D0E8D0',
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#D0E8D0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealEmoji: {
    fontSize: 40,
  },
  mealDetails: {
    alignItems: 'center',
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  caloriesBadge: {
    backgroundColor: '#C8A2D8',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  caloriesText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  macroItem: {
    backgroundColor: '#D5C0E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    margin: 3,
    minWidth: 60,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 9,
    color: '#666',
  },
  macroValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  removeButton: {
    alignSelf: 'center',
    marginTop: 5,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textDecorationLine: 'underline',
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  addMealsButton: {
    backgroundColor: '#9370DB',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addMealsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#8B5BA8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#E0B0FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  macrosSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0B0FF',
  },
  macrosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  macroBarContainer: {
    marginBottom: 15,
  },
  macroBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  macroBarValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  macroBarTrack: {
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  macroBarCarbs: {
    backgroundColor: '#FFD700',
  },
  macroBarProtein: {
    backgroundColor: '#FF6B6B',
  },
  macroBarFat: {
    backgroundColor: '#4ECDC4',
  },
});
