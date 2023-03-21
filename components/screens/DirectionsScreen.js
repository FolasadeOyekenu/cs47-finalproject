import MapView from 'react-native-maps'
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

export default function DirectionsScreen({ navigation }) {

    return (
        <View style={styles.container}>
        <Text>
          Coming soon...
        </Text>
        </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly"
    },
    map: {
      width: width * 0.9,
		  height: height * 0.4,
    },
});