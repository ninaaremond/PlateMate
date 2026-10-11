// welcome screen - entry point for login and registration
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

export default function WelcomeScreen({onLogin, onRegister}) {
  return (
    <View style = {styles.container}>
      <View style ={styles.header}>
        <Image 
          source={require('../../assets/PlateMateNew.png')}
          style={[styles.logo, {width: 280, height: 280}]}
          resizeMode="contain"
        />
        <Text style={[styles.title, {fontSize: 28}]}>Welcome to PlateMate</Text>
        <Text style= {[styles.subtitle, {fontSize: 22}]}>Your friendly meal-planning buddy!</Text>
        <Text style={[styles.description, {fontSize: 16}]}>
          PlateMate helps you calculate your BMI and daily calorie needs, then plan your meals for breakfast, lunch, snacks, and dinner.
        </Text>
        <Text style={[styles.description, {fontSize: 16}]}>
          Pick your plates, track your calories, and stay on top of your goals one meal at a time.
        </Text>
      </View>

      <View style = {styles.form}>
        <TouchableOpacity style={[styles.loginButton, {padding: 16}]} onPress={onLogin}>
          <Text style={[styles.loginButtonText, {fontSize: 18}]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.registerButton, {padding: 16}]} onPress={onRegister}>
          <Text style={[styles.registerButtonText, {fontSize: 18}]}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center' , 
     alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#FFF8DC' 
  },
   header:    
   {
    alignItems: 'center',
    marginBottom: 30 },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C77DC7',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  form: { 
    width: '100%',
    maxWidth: 400,
  },
  loginButton: {
    backgroundColor: '#C77DC7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#DDA0DD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  registerButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});