import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import styled from 'styled-components';

const HomeContainer = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  height: 500px;
`;

const TitleText = styled.Text`
  font-size: 40px;
  color: black;
  margin-bottom: 20%;
  margin-top: 10%;
  text-align: center;
`;

const StartBtnCont = styled.TouchableOpacity`
  width: 35%;
  height: 5%;
  background-color: #00bbec;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const StartBtnText = styled.Text`
  font-size: 20px;
  color: white;
`;

const ErrText = styled.Text`
  font-size: 20px;
  color: red;
`;

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [camera, setCamera] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({}).catch((err) => {
        setErrorMsg('Could not get location');
      });
      if (location) {
        setLocation(location);
      }

      status = await Camera.requestPermissionsAsync();
      if (status.status !== 'granted') {
        setErrorMsg('Requires camera access');
      } else if (location) {
        setErrorMsg();
      }
    })();
  }, []);

  return (
    <HomeContainer>
      <Image
        source={require('../../assets/cleanEarthSmall.png')}
        style={{
          height: 200,
          width: 150,
        }}
      />
      <TitleText>CleanEarth Drone Camera</TitleText>
      {errorMsg ? (
        <ErrText>{errorMsg}</ErrText>
      ) : (
        <StartBtnCont activeOpacity={0} onPress={() => navigation.navigate('Camera')}>
          <StartBtnText>Start Scanning</StartBtnText>
        </StartBtnCont>
      )}
    </HomeContainer>
  );
}
