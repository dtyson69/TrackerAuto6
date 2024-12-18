import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const DeliveryScreen = ({ route }) => {
  const { loadId } = route.params;
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      console.log('Load ID:', loadId);
      try {
        const response = await axios.get(`http://50.6.170.96:8088/delivery`, {
          params: { loadid: loadId },
        });
        setDeliveryDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delivery details:', error);
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [loadId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!deliveryDetails || deliveryDetails.length === 0) {
    return <Text style={styles.errorText}>No delivery details found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Delivery Details</Text>
      {deliveryDetails.map((detail, index) => (
        <View key={index} style={styles.detailContainer}>
          <Text style={styles.detailText}>Load Transaction ID: {detail.drvName}</Text>
          <Text style={styles.detailText}>Load Description: {detail.drvPhone}</Text>
        </View>
      ))}
      <Button
        title="Start Pickup"
        onPress={() => navigation.navigate('PhotoScreen', { loadId })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default DeliveryScreen;