import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal, Button } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // For the menu icon
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PickupScreen from './PickupScreen';
const apiBaseUrl = 'http://50.6.170.96:8088';

const LoadsScreen = ({ navigation, route }) => {
  const { drv_Id, carrId } = route.params;
  //console.log('Route params:', route.params); 
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // For the menu modal visibility

  // Fetch loads based on status
  const fetchLoadsByStatus = async (status) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/loads`, {
        params: { status, drv_Id, carrId }
      });
      setLoads(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching loads:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoadsByStatus('CarrierChosen');
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleItemPress = (item) => {
    switch (selectedStatus) {
      case 'PickUp':
        navigation.navigate('PickupScreen', { loadId: item.load_id , status: item.load_status });
        break;
      case 'Assigned':
        navigation.navigate('AssignedScreen', { loadId: item.load_id, status: item.load_status  });
        break;
      case 'Dispatched':
        navigation.navigate('DispatchedScreen', { loadId: item.load_id, status: item.load_status  });
        break;
      case 'Delivered':
        navigation.navigate('DeliveryScreen', { loadId: item.load_id });
        break;
      case 'Invoiced':
        navigation.navigate('InvoicedScreen', { loadId: item.load_id, status: item.load_status  });
        break;
      case 'Complete':
        navigation.navigate('CompleteScreen', { loadId: item.load_id, status: item.load_status  });
        break;
      default:
        console.warn(`No screen mapped for status: ${selectedStatus}`);
    }
  };
  return (
    <View style={styles.container}>
      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleModal}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Loads Management</Text>

      <ScrollView
        horizontal={true}
        style={styles.buttonScrollView}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {['Dispatched', 'Assigned', 'PickUp', 'Delivered', 'Invoiced', 'Complete'].map((status) => (
          <View style={styles.buttonWrapper} key={status}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedStatus === status ? styles.selectedButton : styles.deselectedButton,
              ]}
              onPress={() => {
                setSelectedStatus(status);
                fetchLoadsByStatus(status);
              }}
            >
              <Text style={styles.buttonText}>{status}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.subtitle}>Status: {selectedStatus || 'All'}</Text>
          <FlatList
            data={loads}
            keyExtractor={(item) => item.load_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <View style={styles.item}>
                  <Text>{`Load ID: ${item.load_id}` }</Text>
                  <Text>{`Pickup: ${item.locPickup}`}</Text>
                  <Text>{`Delivery: ${item.locDelivery}`}</Text>
                  <Text>{`Status: ${item.load_status}`}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Button title="Log Off" onPress={() => alert('Logging Off')} />
            <Button title="Support" onPress={() => alert('Support Information')} />
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  menuButton: {
    position: 'absolute',
    top: 70,
    left: 10,
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 80,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  buttonScrollView: {
    position: 'absolute',  // Fix the buttons to the top of the screen
    top: 150,  // Adjust the position based on where you want them
    left: 0,
    right: 0,
    zIndex: 1000,  // Ensure it's above the content
    paddingBottom: 10, // Space below buttons
  },
  scrollContentContainer: {
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    marginRight: 15,
  },
  button: {
    backgroundColor: '#432162',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#432162',
  },
  deselectedButton: {
    backgroundColor: '#ead8fa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default LoadsScreen;