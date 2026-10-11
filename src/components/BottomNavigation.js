// bottom navigation bar component - not currently used in the app but here for future features
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BottomNavigation = ({ navigation, activeScreen }) => {
  return (
    <View style={styles.bottomNav}>
      {/* diary button - would show food diary if implemented */}
      <TouchableOpacity 
      
        style={[
          styles.navButton,
          activeScreen === 'Diary' && styles.navButtonActive
        ]}
        onPress={() => navigation.navigate('Diary')}
      >
        <Text style={styles.navEmoji}>📝</Text>
        <Text style={[
          styles.navLabel,
          activeScreen === 'Diary' && styles.navLabelActive
        ]}>Diary</Text>
      </TouchableOpacity>

      <TouchableOpacity 

        style={[
          styles.navButton,
          activeScreen === 'MealSelection' && styles.navButtonActive
        ]}
        onPress={() => navigation.navigate('MealSelection')}
      >
        <Text style={styles.navEmoji}>🍽️</Text>
        <Text style={[
          styles.navLabel,
          activeScreen === 'MealSelection' && styles.navLabelActive
        ]}>Meal Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity 

        style={[
          styles.navButton,
          activeScreen === 'Profile' && styles.navButtonActive
        ]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.navEmoji}>👤</Text>
        <Text style={[
          styles.navLabel,
          activeScreen === 'Profile' && styles.navLabelActive
        ]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  bottomNav: {

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#A855F7',
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,

  },
  navButton: {

    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,

  },
  navButtonActive: {

    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,

  },
  navEmoji: {

    fontSize: 24,
    marginBottom: 4,

  },
  navLabel: {

    fontSize: 11,
    color: '#E6B0E6',
    fontWeight: '600',

  },
  navLabelActive: {

    color: '#FFF',
  },
});

export default BottomNavigation;
