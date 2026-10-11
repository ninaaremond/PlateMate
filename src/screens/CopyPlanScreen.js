// copy plan screen - lets users copy meal plans from one day to others
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Alert } from 'react-native';

export default function CopyPlanScreen({ 
  currentDay,
  weeklyMeals,
  onCopyToDay,
  onCopyToAllDays,
  onSkip,
  onBack
}) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const daysOfWeek = [
    { id: 1, name: 'Day 1', label: 'Monday' },
    { id: 2, name: 'Day 2', label: 'Tuesday' },
    { id: 3, name: 'Day 3', label: 'Wednesday' },
    { id: 4, name: 'Day 4', label: 'Thursday' },
    { id: 5, name: 'Day 5', label: 'Friday' },
    { id: 6, name: 'Day 6', label: 'Saturday' },
    { id: 7, name: 'Day 7', label: 'Sunday' },
  ];

  // filter out the current day from selection options
  const availableDays = daysOfWeek.filter(day => day.id !== currentDay);

  const toggleDaySelection = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(id => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleCopyToSelected = () => {
    if (selectedDays.length === 0) {
      alert('Please select at least one day to copy to');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCopy = () => {
    // pass all selected days at once for batch database update - more efficient than one-by-one
    onCopyToDay(currentDay, selectedDays);
    setShowConfirmModal(false);
    onBack();
  };

  const handleCopyToAll = () => {
    Alert.alert(
      'Copy to All Days',
      'Copy this plan to all remaining days? This will overwrite any existing plans.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy to All',
          onPress: () => {
            onCopyToAllDays(currentDay);
            onBack();
          }
        }
      ]
    );
  };

  const getCurrentDayName = () => {
    const day = daysOfWeek.find(d => d.id === currentDay);
    return day ? `${day.name} (${day.label})` : '';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/PlateMateNew.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appTitle}>Copy Meal Plan</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Great! You've planned {getCurrentDayName()}</Text>
        <Text style={styles.description}>
          Would you like to copy this plan to other days?
        </Text>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickButton}
            onPress={handleCopyToAll}
          >
            <Text style={styles.quickButtonIcon}>📋</Text>
            <Text style={styles.quickButtonText}>Copy to All Days</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickButton, styles.skipButton]}
            onPress={onSkip}
          >
            <Text style={styles.quickButtonIcon}>⏭️</Text>
            <Text style={styles.quickButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Or select specific days:</Text>

        <View style={styles.daysContainer}>
          {availableDays.map(day => {
            const isSelected = selectedDays.includes(day.id);
            const hasExistingPlan = weeklyMeals[day.id] && 
              Object.values(weeklyMeals[day.id]).some(meals => meals && meals.length > 0);

            return (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayOption,
                  isSelected && styles.dayOptionSelected,
                  hasExistingPlan && styles.dayOptionHasPlan
                ]}
                onPress={() => toggleDaySelection(day.id)}
              >
                <View style={styles.dayOptionHeader}>
                  <Text style={[
                    styles.dayOptionName,
                    isSelected && styles.dayOptionNameSelected
                  ]}>
                    {day.name}
                  </Text>
                  <Text style={styles.dayOptionLabel}>{day.label}</Text>
                </View>
                
                {hasExistingPlan && (
                  <Text style={styles.warningText}>⚠️ Has existing plan</Text>
                )}
                
                {isSelected && (
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedDays.length > 0 && (
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={handleCopyToSelected}
          >
            <Text style={styles.copyButtonText}>
              Copy to {selectedDays.length} selected day{selectedDays.length > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Copy</Text>
            <Text style={styles.modalText}>
              This will copy your meal plan to {selectedDays.length} day{selectedDays.length > 1 ? 's' : ''}.
              {'\n\n'}Any existing plans for those days will be overwritten.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonConfirm}
                onPress={confirmCopy}
              >
                <Text style={styles.modalButtonConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 30,
    paddingBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#9370DB',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  skipButton: {
    backgroundColor: '#999',
  },
  quickButtonIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  daysContainer: {
    marginBottom: 20,
  },
  dayOption: {
    backgroundColor: '#F5E6F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0B0FF',
    position: 'relative',
  },
  dayOptionSelected: {
    backgroundColor: '#E0B0FF',
    borderColor: '#9370DB',
  },
  dayOptionHasPlan: {
    borderColor: '#FFB347',
  },
  dayOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayOptionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  dayOptionNameSelected: {
    color: '#FFF',
  },
  dayOptionLabel: {
    fontSize: 14,
    color: '#666',
  },
  warningText: {
    fontSize: 12,
    color: '#FF8C00',
    marginTop: 5,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
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
    padding: 25,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#999',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
