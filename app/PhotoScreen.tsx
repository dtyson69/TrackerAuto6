import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const PhotoScreen = ({ route }: { route: any }) => {
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<{ uri: string; name: string }[]>([]);
  const { loadNumber } = route.params || { loadNumber: '632' };

  const photoLabels = ['OD', 'LS', 'WS', 'FR', 'RS', 'BK', 'TP'];
  const descriptions = [
    'Odometer',
    'Left Side',
    'Windshield',
    'Front',
    'Right Side',
    'Back',
    'Top',
  ];

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    };
    requestCameraPermission();
  }, []);

  if (permission === null) {
    return (
      <View style={styles.center}>
        <Text>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          We need your permission to access the camera.
        </Text>
        <Button
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
          }}
          title="Grant Permission"
        />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        const fileName = `${loadNumber}${photoLabels[currentIndex]}.jpg`;

        // Save the photo locally
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.moveAsync({
          from: photo.uri,
          to: filePath,
        });

        setPhotos((prev) => [...prev, { uri: filePath, name: fileName }]);
        if (currentIndex < photoLabels.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Upload all photos once done
          uploadPhotos();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take or save the photo. Please try again.');
      }
    }
  };

  const uploadPhotos = async () => {
    try {
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append('photos', {
          uri: photo.uri,
          name: photo.name,
          type: 'image/jpeg',
        });
      });

      const response = await fetch('https://yourserver.com/photos', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Photos uploaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload photos. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.overlay}>
          <Text style={styles.description}>
            Take a photo of the: {descriptions[currentIndex]}
          </Text>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  description: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PhotoScreen;
