// calorie gauge component - shows a progress bar for daily calories
// not currently used but could be handy for displaying progress
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalorieGauge = ({ current, total }) => {
  // calculate percentage but cap it at 100 so the bar doesn't overflow
  const percentage = Math.min((current / total) * 100, 100);

  // simple progress bar with percentage and calorie count
  return (

    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Calories Today</Text>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>
      
      <View style={ styles.progressBarContainer }>
        <View style={ styles.progressBarBackground }>
          <View style={[styles.progressBarFill, { width: `${percentage}%` 
          }]} />
        </View>


      </View>

      
      <View style =  { styles.textContainer }>
        <Text style={ styles.calorieText }>
          {Math.round(current)} / {Math.round(total)} cal
        </Text>
      </View>
    </View>


  );
};

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#FFE6F0',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 15,
    borderWidth: 2,
    borderColor: '#E6B0E6',

  },
  headerRow: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,

  },
  title: {

    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',

  },
  percentage: {

    fontSize: 18,
    fontWeight: 'bold',
    color: '#A855F7',

  },
  progressBarContainer: {
    marginBottom: 10,
  },
  
  progressBarBackground: {

    height: 30,
    backgroundColor: '#FFF8DC',
    borderRadius: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A855F7',
    borderRadius: 15,
  },
  textContainer: {

    alignItems: 'center',

  },
  calorieText: {


    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',

  },
});

export default CalorieGauge;
