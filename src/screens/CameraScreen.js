import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import cleanEarth from '../api/cleanearth';

export default function CameraScreen({ navigation }) {
  const initialTime = 5;

  const [location, setLocation] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [time, setTime] = useState(initialTime);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({}).catch((err) => {
        navigation.navigate('Home');
        console.log('err location');
      });
      if (location) {
        setLocation(location);
      }
    })();
  }, []);

  useEffect(() => {
    // Handle timer
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const tick = () => {
    if (time === 1) {
      setTime(initialTime);
      capture();
    } else {
      setTime(time - 1);
    }
  };

  const capture = () => {
    if (!camera) return;
    (async () => {
      let photo = await camera.takePictureAsync({ quality: 1 });

      let data = new FormData();
      data.append('latitude', location.coords.latitude);
      data.append('longitude', location.coords.longitude);
      data.append('image', { uri: photo.uri, name: 'capture.jpg', type: 'image/jpg' });

      cleanEarth.post('/trashScan', data).then((res) => {
        console.log(res);
      });
      console.log('ping');
      setPhotoCount(photoCount + 1);
    })();
  };

  const stopScan = () => {
    setTime(initialTime);
    setPhotoCount(0);
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={(ref) => {
          setCamera(ref);
        }}
      >
        <View style={styles.cameraControlsContainer}>
          <Text style={{ fontSize: 24, top: '-10%', color: 'white' }}>
            Capturing in {time}...
          </Text>
          <Text style={{ fontSize: 24, top: '-10%', color: 'white' }}>
            Captured {photoCount} image{photoCount === 1 ? '' : 's'}
          </Text>
          <TouchableOpacity
            style={{
              width: '25%',
              height: '25%',
              backgroundColor: 'rgba(255, 20, 20, 0.9)',
              borderRadius: '10',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              stopScan();
            }}
          >
            <Text style={{ fontSize: 24, color: 'white' }}>Stop</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraControlsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '15%',
    top: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
