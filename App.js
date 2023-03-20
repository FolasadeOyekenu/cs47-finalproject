import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/screens/HomeScreen';
import Pin from './components/MapComponents/Pin'
import DirectionsScreen from './components/screens/DirectionsScreen'

const Drawer = createDrawerNavigator();

export default function App() {
  return (
     <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Create a New Pin" component={Pin} />
        <Drawer.Screen name="Navigate Around" component={DirectionsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}