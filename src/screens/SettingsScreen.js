// settings screen - lets users update their info after registering
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from 'react-native';

export default function SettingsScreen({ userData, onUpdateUserData, onBack }) {
  // pre-fill all the fields with current user data
  const [name, setName] = useState(userData?.name || '');
  const [password, setPassword] = useState(userData?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState(userData?.gender || '');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [age, setAge] = useState(userData?.age?.toString() || '');
  const [height, setHeight] = useState(userData?.height?.toString() || '');
  const [weight, setWeight] = useState(userData?.weight?.toString() || '');
  const [activityLevel, setActivityLevel] = useState(userData?.activityLevel || '');
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [dietPreference, setDietPreference] = useState(userData?.dietPreference || '');
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [objective, setObjective] = useState(userData?.objective || '');
  const [objectiveModalVisible, setObjectiveModalVisible] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const activityOptions = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Light', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Active', value: 'active' },
    { label: 'Very Active', value: 'very_active' },
  ];

  const dietOptions = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'No Preference', value: 'none' },
  ];

  const objectiveOptions = [
    { label: 'Lose Weight', value: 'lose' },
    { label: 'Maintain Weight', value: 'maintain' },
    { label: 'Gain Weight', value: 'gain' },
  ];

  const selectGender = (value) => {
    setGender(value);
    setGenderModalVisible(false);
  };

  const selectActivity = (value) => {
    setActivityLevel(value);
    setActivityModalVisible(false);
  };

  const selectDiet = (value) => {
    setDietPreference(value);
    setDietModalVisible(false);
  };

  const selectObjective = (value) => {
    setObjective(value);
    setObjectiveModalVisible(false);
  };

  // validate all required fields are filled then send updated data back to App.js
  const handleSave = () => {
    if (!name || !password || !gender || !age || !height || !weight || !activityLevel || !dietPreference || !objective) {
      alert('Please fill all fields');
      return;
    }

    // pass updated data to parent - App.js will recalculate health metrics and update database
    onUpdateUserData({
      name,
      password,
      gender,
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      activityLevel,
      dietPreference,
      objective
    });
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
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Settings</Text>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Username</Text>
          <TextInput
            style={styles.inputRight}
            value={name}
            onChangeText={setName}
            placeholder="Text"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Gender</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setGenderModalVisible(true)}
          >
            <Text style={gender ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
              {gender ? genderOptions.find(opt => opt.value === gender)?.label : 'Select Gender'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={genderModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setGenderModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setGenderModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    gender === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => selectGender(option.value)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    gender === option.value && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {gender === option.value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setGenderModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Age</Text>
          <TextInput
            style={styles.inputRight}
            value={age}
            onChangeText={setAge}
            placeholder="Number"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Height</Text>
          <TextInput
            style={styles.inputRight}
            value={height}
            onChangeText={setHeight}
            placeholder="Number"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Weight</Text>
          <TextInput
            style={styles.inputRight}
            value={weight}
            onChangeText={setWeight}
            placeholder="Number"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Activity Level</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setActivityModalVisible(true)}
          >
            <Text style={activityLevel ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
              {activityLevel ? activityOptions.find(opt => opt.value === activityLevel)?.label : 'Select Activity Level'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={activityModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActivityModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setActivityModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Activity Level</Text>
              {activityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    activityLevel === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => selectActivity(option.value)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    activityLevel === option.value && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {activityLevel === option.value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setActivityModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Diet Preference</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setDietModalVisible(true)}
          >
            <Text style={dietPreference ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
              {dietPreference ? dietOptions.find(opt => opt.value === dietPreference)?.label : 'Select Diet Preference'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={dietModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDietModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setDietModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Diet Preference</Text>
              {dietOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    dietPreference === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => selectDiet(option.value)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    dietPreference === option.value && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {dietPreference === option.value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setDietModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Objective</Text>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setObjectiveModalVisible(true)}
          >
            <Text style={objective ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
              {objective ? objectiveOptions.find(opt => opt.value === objective)?.label : 'Select Objective'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={objectiveModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setObjectiveModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setObjectiveModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Objective</Text>
              {objectiveOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    objective === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => selectObjective(option.value)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    objective === option.value && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {objective === option.value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setObjectiveModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#E0B0FF',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F0C8FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  labelLeft: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  inputRight: {
    flex: 1.5,
    backgroundColor: '#F8E0FF',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8E0FF',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  eyeButton: {
    padding: 10,
  },
  eyeIcon: {
    fontSize: 20,
  },
  dropdownButton: {
    flex: 1.5,
    backgroundColor: '#F8E0FF',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0B0E0',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#999',
  },
  dropdownButtonTextSelected: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#999',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#DDA0DD',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});
