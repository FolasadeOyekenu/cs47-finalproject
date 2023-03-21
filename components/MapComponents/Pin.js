import { Text, View, SafeAreaView, StyleSheet, Pressable, TextInput, Dimensions,  Button, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation, useRoute } from "@react-navigation/native"
import { supabase } from '../../env';
import * as ImagePicker from 'expo-image-picker';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

export default function Pin({ navigation }) {

  const [ item, setItem ] = useState('');
  const [ location, setLocation ] = useState(null);
  const [ errorMsg, setErrorMsg ] = useState(null);
	const [ region, setRegion ] = useState({
		latitude: 37.78825,
		longitude: -122.4324,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	})

  //camera state variables
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const pin = async () => {
    const { error } = await supabase
   .from("pins")
   .insert({
    item: item,
    latitude: region.latitude,
    longitude: region.longitude,
    imageUri: imageUri
   })
  };

//camera functions
const permisionFunction = async () => {
  // here is how you can get the camera permission
  cameraPermission = await Camera.requestCameraPermissionsAsync();

  setCameraPermission(cameraPermission.status === 'granted');

  const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

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

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};
// location functions
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
        region={{
          latitude: region.latitude,
          longitude: region.longitude,
        }}
        showsUserLocation={true}
        followsUserLocation={true}> 
      </MapView>


      <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.camera}
          type={type}
        />
      <Button title={'Take Picture'} onPress={takePicture} />
      {/* <Button title={'Gallery'} onPress={pickImage} /> */}
      {imageUri && <Image source={{ uri: imageUri }} style={{ flex: 1 }} />}

      <Button title={'Push Pin'} onPress={() => pin()} />
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
      flex: 1,
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
    },
    cameraContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    camera: {
      width: width * 0.9,
      height: height * 0.2
    },
    button: {
      flex: 0.1,
      padding: 10,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
});