import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import Main from './tbsmain';
import PickupScreen from './PickupScreen';
import DeliveryScreen from './DeliveryScreen';
import AssignedScreen from './AssignedScreen';
import CompleteScreen from './CompleteScreen';
import InvoicedScreen from './InvoicedScreen';
import DispatchedScreen from './DispatchedScreen';
import PhotoScreen from './PhotoScreen';

const apiBaseUrl = 'http://50.6.170.96:8088';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/login`, { username, password });

      if (response.data.message === 'Login successful') {
        const { drv_Id, carrId } = response.data;

        if (drv_Id && carrId) {
          navigation.replace('Main', { drv_Id, carrId, status: 'CarrierChosen' });
        } else {
          setErrorMessage('Unexpected server response. Please try again.');
        }
      } else {
        setErrorMessage('Incorrect username or password, please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message || error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/TBSIcon.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            accessibilityLabel="Login Button"
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="PickupScreen" component={PickupScreen} />
        <Stack.Screen name="AssignedScreen" component={AssignedScreen} />
        <Stack.Screen name="DispatchedScreen" component={DispatchedScreen} />
        <Stack.Screen name="DeliveryScreen" component={DeliveryScreen} />
        <Stack.Screen name="InvoicedScreen" component={InvoicedScreen} />
        <Stack.Screen name="CompleteScreen" component={CompleteScreen} />
        <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
      </Stack.Navigator>
   
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default App;
