import { Text, View, SafeAreaView, StyleSheet, Pressable, TextInput, Dimensions,  Button, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { Camera, CameraType } from 'expo-camera';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

export default function Pin({ navigation }) {
  const [item, setItem] = useState('');
  const [snapshot, setSnapshot] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
	const [ region, setRegion ] = useState({
		latitude: 37.78825,
		longitude: -122.4324,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	})
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === 'granted');

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log(imagePermission.status);

    setGalleryPermission(imagePermission.status === 'granted');

    if (
      imagePermission.status !== 'granted' &&
      cameraPermission.status !== 'granted'
    ) {
      alert('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      setImageUri(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      presentationStyle: 0
    });

    console.log(result);
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

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
    <SafeAreaView style={styles.view}>
      <TextInput
        style={styles.search}
        value={item}
        onChangeText={(item) => setItem(item)}
        placeholder="Describe the food item(s), approximate quantity?"
      />
      <GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data, details)
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
					})
				}}
				query={{
					key: "AIzaSyASfGbT1sVPBJKwfIz3OaRFUv4k-2SJTMg",
					language: "en",
					components: "country:us",
					types: "establishment",
					radius: 30000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { height: height * 0.2, width: width * 0.9 },
					listView: { backgroundColor: "white" }
				}}
			/>
      
      <MapView style={styles.map} 
        region={userLocation(location)}
        showsUserLocation={true}
        followsUserLocation={true}> 
      </MapView>

      <Pressable
        onPress={() => navigation.navigate('Home')}>
        <Text>Back to Home</Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view:{
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
  },
	container: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly"
    },
    map: {
      width: width * 0.9,
      height: height * 0.15,
      flex: 3,
    },
    search: {
      width: width * 0.9,
      height: height * 0.15,
      flex: 2,
    },
    image: {
      width: width * 0.9,
		  height: height * 0.15,
      flex: 2,
    }
});