// login screen - where users enter credentials to access their account
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LoginScreen({ onLogin, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }
    onLogin(username, password);
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.formTitle}>Log In</Text>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Username</Text>
          <TextInput
            style={styles.inputRight}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.labelLeft}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
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

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#E0B0FF',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#999',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  loginButton: {
    backgroundColor: '#C77DC7',
    padding: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
