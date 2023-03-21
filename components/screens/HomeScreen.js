import MapView from 'react-native-maps'
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { useRoute } from "@react-navigation/native"
import { supabase } from '../../env';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

export default function HomeScreen({ navigation }) {
    const [location, setLocation] = useState(null); 
    const [errorMsg, setErrorMsg] = useState(null);
    
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [pins, setPins] = useState([]);

    const fetchPins = async() => {
      setLoading(true);
      const {data, error } = await supabase.from("pins").select();
      setPins(data);
      setLoading(false);
    };

    useEffect(() => {
      fetchPins();
    }, []);


//route.params.item
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
    console.log(pins[0])
    return (
        <View style={styles.container}>
            <MapView style={styles.map} 
                region={userLocation(location)}
                > 
                {pins.map((pin) => {
                  return (
                  <Marker
                  coordinate={{ latitude : pin.latitude, longitude : pin.longitude}}>
                    <Callout>
                      <Text> {pin.item}</Text>
                      <Image style={styles.image} source={{uri: pin.imageUri}}/>
                    </Callout>
                  </Marker>
                );
                })}
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
      height: height * .4,
    },
    image: {
      width: "100%",
      height: "100%",
    }
});