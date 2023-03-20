import MapView from 'react-native-maps'
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

export default function DirectionsScreen({ navigation }) {
    const [location, setLocation] = useState(null); 
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
      }, []);
      let text = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        text = JSON.stringify(location);
      }

    function userLocation(location){
        if (location === null){return;}
        return {
            latitude: location["coords"]["latitude"],
            longitude: location["coords"]["longitude"],
            latitudeDelta: ASPECT_RATIO * 0.001,
            longitudeDelta: ASPECT_RATIO * 0.01,
        }
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} 
                region={userLocation(location)}
                showsUserLocation={true}
                followsUserLocation={true}> 
            </MapView>
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