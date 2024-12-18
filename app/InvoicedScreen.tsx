import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PickupScreen = ({ route }) => {
  // Destructure the parameters passed from navigation
  const { loadId, status } = route.params;

  // Use useEffect to log parameters when the component mounts
  useEffect(() => {
    console.log('PickupScreen loaded with:');
    console.log('Load ID:', loadId);
    console.log('Status:', status);
  }, [loadId, status]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Screen</Text>
      <Text style={styles.subtitle}>Load ID: {loadId}</Text>
      <Text style={styles.subtitle}>Status: {status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default PickupScreen;