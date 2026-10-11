// menu screen - displays user profile and calculated health metrics (BMI, BMR, daily calories)
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';

export default function MenuScreen({ userData, onChooseMeals, onNavigateToAICoach }) {

  // state to hold calculated health metrics
  const [bmi, setBmi] = useState(0);
  const [bmr, setBmr] = useState(0);
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState(0);

  // recalculate metrics when user data changes
  useEffect(() => {
    if (userData) {
      calculateMetrics();
    }
  }, [userData]);

  // calculate BMI, BMR, category, and daily calorie needs
  const calculateMetrics = ()  =>  {
    // calculate BMI using standard formula: weight (kg) / height² (m²)
    const heightInMeters = userData.height / 100;
    const calculatedBmi = userData.weight  / (heightInMeters * heightInMeters);
    setBmi(calculatedBmi.toFixed(1));


    // determine weight category based on BMI ranges
    let cat = '';
    if (calculatedBmi < 18.5) {
      cat = 'Underweight';
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      cat = 'Normal';
    } else {
      cat = 'Overweight';
    }
    setCategory(cat);

    // calculate BMR using Mifflin-St Jeor Equation
    // different formulas for male and female
    let calculatedBmr;
    if (userData.gender.toLowerCase() === 'male' || userData.gender.toLowerCase() === 'm') {
      calculatedBmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) + 5;
    } else {
      calculatedBmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) - 161;
    }
    setBmr(calculatedBmr.toFixed(0));


    // calculate daily calorie needs based on activity level
    let activityMultiplier = 1.2;
    switch (userData.activityLevel)   {
      case ' sedentary ' :
        activityMultiplier =  1.2;
        break;
      case 'light':
        activityMultiplier  =  1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'very_active':
        activityMultiplier = 1.9;
        break;
    }


    let  dailyCalories =  calculatedBmr   * activityMultiplier;

    // adjust calories based on weight objective (add/subtract 500)
    if (userData.objective === 'lose') {
      dailyCalories -= 500;
    } else if (userData.objective === 'gain') {
      dailyCalories += 500;
    }
    // maintain objective requires no adjustment

    setCalories(dailyCalories.toFixed(0));
  };

  // display information about BMI and BMR calculations
  const showBmiInfo =  () =>   {
    Alert.alert(

      'What is BMI and BMR?',
      'BMI (Body Mass Index) is a measure of body fat based on height and weight.\n\nBMR (Basal Metabolic Rate) is the number of calories your body needs to perform basic functions at rest.\n\nBMI: Calculated as: weight (kg) / height² (m²) \n\nBMR: Uses the Mifflin-St Jeor Equation: Men: (10 x weight) + (6.25 x height) - (5 x age) + 5 \nWomen: (10 x weight) + (6.25 x height) - (5 x age) - 161',
      [{ text: 'OK' }]

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

        {/* AI coach button - round button on the right side of header */}
        <TouchableOpacity 
          style={styles.aiCoachButton} 
          onPress={onNavigateToAICoach}
        >
          <Text style={styles.aiCoachButtonText}>🤖</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.formContainer}>

        <View style={styles.row}>

          <View style={styles.leftColumn}>


            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Your Username</Text>
              <Text style={styles.fieldValue}>{userData?.name || ''}</Text>

            </View>


            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Your Gender</Text>
              <Text style={ styles.fieldValue }>{userData?.gender || ''}</Text>
            </View>

            <View style={styles.field}>
              <Text style={ styles.fieldLabel}>Your Age</Text>
              <Text style={ styles.fieldValue }>{userData?.age || ''}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Your Weight</Text>

              <Text style={styles.fieldValue}>{userData?.weight || ''}</Text>
            </View>


            <View style={styles.field}>

              <Text style={styles.fieldLabel}>Your Height</Text>

              <Text style={styles.fieldValue}>{userData?.height  ||  ''}</Text>
            </View>
          </View>

          <View style={ styles.rightColumn }>
            <View style={ styles.field }>

              <Text style={ styles.fieldLabel }>Your Objective</Text>

              <Text style={styles.fieldValue}>{userData?.objective || ''}</Text>

            </View>

            <View style =  { styles.field }>
              <Text style={styles.fieldLabel}>Your BMI</Text>
              <Text style={styles.fieldValue}>{bmi}</Text>

            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Your BMR</Text>

              <Text style={styles.fieldValue}>{bmr}</Text>

            </View>

            <TouchableOpacity onPress={showBmiInfo}>
              <Text style={styles.infoText}>
                What is BMI and BMR ?{'\n'}
                (Click here to find out more)
              </Text>
            </TouchableOpacity>
            <View style={styles.categoryField}>

              <Text style={styles.fieldLabel}>Your category</Text>

              <Text style={styles.categoryValue}>{category}</Text>

              <Text style={styles.categorySubtext}>
                Normal / Overweight / Underweight
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.adviceSection}>
          <Text style={styles.adviceTitle}>PlateMate advise you :</Text>
          <View style={styles.calorieBox}>
            <Text style={styles.calorieText}>
              Number of Calories you{'\n'}need per day
            </Text>
            <Text style={styles.calorieValue}>{calories}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.chooseMealsButton} onPress={onChooseMeals}>
          
          <Text style={styles.chooseMealsText}>Choose my meals</Text>

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
    marginLeft: 10,
  },
  field: {
    backgroundColor: '#F8C8DC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginTop: 4,
  },
  fieldValue: {

    fontSize: 16,
    fontWeight: 'bold' ,
    color: '#000',
    textAlign: 'center' ,


  },
  infoText: {

    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 8,

  },
  categoryField: {

    backgroundColor: '#F8C8DC',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,

  },
  categoryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 4,
  },
  categorySubtext: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  adviceSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  calorieBox: {
    backgroundColor: '#F8D0E0',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    minWidth: 250,
  },
  calorieText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  calorieValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  chooseMealsButton: {
    backgroundColor: '#DDA0DD',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'flex-end',
    paddingHorizontal: 30,
  },
  chooseMealsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  // round AI coach button positioned on the top left of header
  aiCoachButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0B0FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#C77DC7',
  },
  aiCoachButtonText: {
    fontSize: 26,
  },
});