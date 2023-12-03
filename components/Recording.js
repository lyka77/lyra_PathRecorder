import { useState } from 'react';
import {Dimensions,Modal, TextInput,FlatList, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { SegmentedButtons,Button } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";
//import samplePaths from ".../samplePaths.js";
import * as Location from 'expo-location';

let subscription = null; // location tracking service
const { width } = Dimensions.get("window");

export default function Recording({}){
    const [permissionText, setPermissionText] 
    = useState('Location permission not requested yet');
    const [myCoord, setMyCoord] = useState(null);
    //const [prevCoord, setPrevCoord] = useState(null)
    const [coords, setCoords] = useState([]);
    const [start, setStart] = useState(null);
    const [spot,setSpot] = useState(null);
    const [spots, setSpots] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    /* // Original app hand only one text state.
       // Lyn split it into two states for simplicity
  
       // Manages text input 
       const [inputValue, setInputValue] = useState('');
    */

    // Manages text within the dialog popup
    const [Title, setTitle] = useState('');
    const [MoreInfo, setMoreInfo] = useState('');

    // Manages text returned by the dialog popup
    const [dialogResultValue, setDialogResultValue] = useState('');

    function enterDialog() {
        setTitle('');
        setModalVisible(true);
    }
    function exitDialog () {
      setDialogResultValue(Title);
      setModalVisible(false);
      newSpot({myCoord, Title, MoreInfo, })

  }

function newSpot({coord, ttl, info}){
  date = Date.now;
  d1 = new Date(date)
  let ns = {title: ttl,
  moreInfo: info,
  time: d1.toLocaleString(),  // "09/26/2015 08:35:45 AM"
  coord: coord,	 };
  setSpot((prevSpots =>{
    return([...prevSpots, ns]);
  }));
}

async function startTracking() {
  let perm = await Location.requestForegroundPermissionsAsync();
  setPermissionText(perm);
  if (perm.status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  // Shut down a foreground service subscription that's already running
  if (subscription !== null) {
    console.log('Stopping active location subscription service.')
    subscription.remove();
  }

  // Reset myCoord and coords state variables for new tracking session 
  setMyCoord(null);
  setCoords([]);
 
  

  console.log('Starting location subscription service.')
  let s = await Location.getCurrentPositionAsync();
  if (s !== null){setStart({latitude: s.coords.latitude, longitude: s.coords.longitude});
  setCoords([start]);}
  //setPrevCoord(start);
  subscription = await Location.watchPositionAsync(
    // Argument #1: location options                      
    {
    // accuracy options at https://docs.expo.dev/versions/latest/sdk/location/#accuracy
      // accuracy: Location.Accuracy.Lowest, // 3km
      // accuracy: Location.Accuracy.Low, // 1km
      // accuracy: Location.Accuracy.Balanced, // 100m
      // accuracy: Location.Accuracy.High, // 10m
      // accuracy: Location.Accuracy.Highest,
      accuracy: Location.Accuracy.BestForNavigation,
      
      distanceInterval: 5 // In meters. Try other distance intervals!
    // Argument #2: callback invoked on each new location from tracking service 
    },          
                                                                
    newLocation => {
      const newCoord = {
        latitude: newLocation.coords.latitude, 
        longitude: newLocation.coords.longitude
      }
      console.log('Moved to new coord.', newCoord);
   
      console.log('myCoord =', myCoord, '; coords =', coords);
      //setPrevCoord(myCoord);
      setMyCoord(prevMyCoord => {
        console.log('prevMyCoord =', prevMyCoord); 
        return newCoord;
      });
      
      setCoords(prevCoords => {
        console.log('prevCoords =', prevCoords); 
        return [...prevCoords, newCoord]; 
      });
    }
  );
}
return(
    <View style= {styles.pscreen}>
        
    
  { (myCoord === null) ?
  <Text>Waiting for location to display map ...</Text> :
  <MapView style={styles.map} 
  initialRegion={{
  latitude: myCoord.latitude,
  longitude: myCoord.longitude,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
  }}
  showsCompass={true} 
  showsUserLocation={true} 
  rotateEnabled={true}
>
  
    <Marker
      key = "start"
      coordinate = {start}
      pinColor = "red"
      title = "Start">
    </Marker>

    <Polyline 
     coordinates={coords}
     strokeColor= "#1B5299"
    strokeWidth={3}
   />

{spots.map(spot => (
          
          <Marker
            key = {spot.title}
            coordinate = {spot.coord}
            pinColor = "blue"
            title = {spot.title}
            description = {checkUndefined(spot.moreInfo) + " "+ readableTime(spot.time)}
            />
          ))}

</MapView>  
}

        <View style={{ flexDirection:"row", justifyContent: "center"}}>
            <View style={styles.button}>
                <Button 
                textColor = "#1B5299"
                buttonColor =  "#9FC2CC"
                onPress={startTracking}
                mode="elevated" >Start Recording</Button>
            </View>
            <View style={styles.button}>
                <Button textColor = "#1B5299"
                buttonColor =  "#9FC2CC"  
                mode="elevated" >Stop Recording</Button>
            </View>
            
        </View>
        <View style={{ flexDirection:"row", justifyContent: "center"}}>
            <View style={styles.button}>
                <Button textColor = "#9FC2CC"
                buttonColor =  "#1B5299"
                onPress = {enterDialog}
                mode="elevated" >Add Stop</Button>
            </View>
        </View>
      

            {/**  Show the text entered from most recent dialog popup*/}
            <Text style={styles.textOutput}>You entered the text:{'\n'}{dialogResultValue}</Text>
  
            {/** This is our modal component containing textinput and a button */}
            <Modal animationType="slide" 
                   transparent visible={isModalVisible} 
                   presentationStyle="overFullScreen" 
                   onDismiss={exitDialog}>
                <View style={styles.modalViewWrapper}>
                    <View style={styles.modalView}>
                        <TextInput placeholder="Title..." 
                                   value={Title} style={styles.textInput} 
                                   onChangeText={(value) => setTitle(value)} />
                                   <TextInput placeholder="More Info..." 
                                   value={MoreInfo} style={styles.textInput} 
                                   onChangeText={(value) => setMoreInfo(value)} />
  
                        {/** This button is responsible to close the modal */}
                        <Button 
                           mode="contained"
                           labelStyle={styles.buttonText}
                           onPress={exitDialog}
                        >
                          Add
                        </Button> 
                    </View>
                </View>
            </Modal>

    </View>
);
}

const styles = StyleSheet.create({

    pscreen:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    map: {
      flex: 1, 
      width: '100%',
      height: '100%',
      //alignItems: 'center',
      //justifyContent: 'center',
      borderWidth: 1,
      //padding: 150,
    },
    data: {
      flex: 1
    },
    listWrapper: {
      height: '90%', 
      width: '95%',
    },
    list: {
      //borderWidth: 1,
      //borderColor: 'blue',
      backgroundColor: '#F1ECCE',
      paddingTop: 10,
    },
    listItem: {
      flexDirection: "row",
      //marginTop: 20,
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: '#9FC2CC',
    },
    listItemTitle: {
      fontSize: 15,
      margin: 10,
      width: '100%',
      color: "#1B5299",
      fontWeight: 'bold'
    },
    listItemText: {
      fontSize: 10,
      margin: 10,
      width: '100%',
      color: "#1B5299",
  
    },
    title:{
      textAlign: "center",
      fontSize: 20,
      margin: 20,
      color: "#1B5299",
      fontWeight: "bold"
    },
    button: {
        margin: 10,
    },
    modalViewWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      elevation: 5,
      transform: [{ translateX: -(width * 0.4) }, 
                  { translateY: -90 }],
      height: 180,
      width: width * 0.8,
      backgroundColor: "#fff",
      borderRadius: 7,
  },
  textInput: {
      fontSize: 25,
      width: "80%",
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
      marginBottom: 8,
  },
  });