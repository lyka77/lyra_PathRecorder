import { useState, useEffect } from 'react';
import {Dimensions,Modal, TextInput,FlatList, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { SegmentedButtons,Button } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";
//import samplePaths from ".../samplePaths.js";
import * as Location from 'expo-location';
import PathView from './PathView';
import {pathDistanceInMeters} from '../distance.js';
import * as PathStore from '../PathStore.js';

let subscription = null; // location tracking service
const { width } = Dimensions.get("window");

export default function Recording({back, extendPaths, pathNames}){
    const [permissionText, setPermissionText] 
    = useState('Location permission not requested yet');
    const [myCoord, setMyCoord] = useState(null);
    const [stop, setStop] = useState(null);
    const [coords, setCoords] = useState([]);
    const [spots, setSpots] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currPath, setCurrPath] = useState({});
    const [recording, setRecording] = useState(false);
    // Manages text within the dialog popup
    const [titleInput, setTitleInput] = useState('');
    const [moreInfoInput, setMoreInfoInput] = useState('');
    const [date, setDate] = useState(null);
    // Manages text returned by the dialog popup
    const [titleResultValue, setTitleResultValue] = useState('');
    const [moreInfoResultValue, setMoreInfoResultValue] = useState('');
    const [saveMode, setSaveMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [pathTitle,setPathTitle] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [stopTime, setStopTime] = useState(null);
    const [pathDistance, setPathDistance] = useState(null);
    const [pathTitleInput, setPathTitleInput] = useState('');
    const [invalidTitle, setInvalidTitle] = useState(false);

    //Modal text input pops up
    function enterDialog() {
        setTitleInput('');
        setMoreInfoInput('');
        setModalVisible(true);
        setDate(new Date(Date.now()));

    }
    //Modal text input goes away and new spot is added to the map
    function exitDialog () {
      setTitleResultValue(titleInput);
      setMoreInfoResultValue(moreInfoInput);
      setModalVisible(false);
      console.log(titleResultValue);
      console.log(moreInfoResultValue);
      const newSpot = {"title": titleInput,
      "moreInfo": moreInfoInput,
      "time": date.toLocaleString(), 
      "coord": myCoord};


      setSpots((prevSpots) => {
        return [...prevSpots, newSpot ];
      });

      //console.log(spots);
  }
  
    function savePath(){
      if (pathNames.includes(pathTitleInput)){
        setInvalidTitle(true);

      } else{
        setInvalidTitle(false);
        setModalVisible(false);
      setPathTitle(pathTitleInput);
      //setCurrPath();
      /* extendPaths({"name": pathTitleInput,
      "startTime": new Date(startTime), 
      "stopTime": new Date(stopTime), 
      "pathDistance": pathDistance/1000, // kilometers
      "spots": spots,
      "coords": coords}); */
      //console.log(currPath);
      PathStore.storePath({"name": pathTitleInput,
      "startTime": new Date(startTime), 
      "stopTime": new Date(stopTime), 
      "pathDistance": pathDistance/1000, // kilometers
      "spots": spots,
      "coords": coords})
      back(null, "Summary");

      }
      
    }

    function deletePath(){
      setModalVisible(false);
      setSpots([]);
      setCurrPath({});
      setCoords([]);
      setStartTime(null);
      setStopTime(null);
      setStop(null);
      setMyCoord(null);
    }


    async function startTracking() {
      setRecording(true);
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
      setMyCoord(null)
      setCoords([]);
     
      console.log('Starting location subscription service.')
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
          
          distanceInterval: 1 // In meters. Try other distance intervals!
        // Argument #2: callback invoked on each new location from tracking service 
        },                                                                        
        newLocation => {
          const newCoord = {
            latitude: newLocation.coords.latitude, 
            longitude: newLocation.coords.longitude
          }
          console.log('Moved to new coord.', newCoord);
          // In console.log below, rather unexpectedly, myCoord is always null and
          // coords is always []! This is an example of the "stale closure" problem
          // This means that in this location callback function, myCoord and coords
          // themselves will *never* appear to be updated! But calls to setMyCoord
          // and setCoords will correctly update these state variables for the JSX,
          // and the correct current values can be accesed using the versions of
          // setMyCoord and setCoords that transform the previous value to the 
          // new value. 
          console.log('myCoord =', myCoord, '; coords =', coords);
          /*
          setMyCoord(newCoord);
          setCoords([...coords, newCoord]);
          */
          //setCoords(prevCoords => [...prevCoords, newCoord])
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
  
    // Stop foreground location tracking
    function stopTracking() {
      if (subscription !== null) {
        console.log('Stopping active location subscription service.')
        subscription.remove();
        setPathDistance(pathDistanceInMeters(coords));
        setStopTime(Date.now);
        setRecording(false);
        setSaveMode(true);
        setModalVisible(true);
        setStop(coords[coords.length-1]);
      }
    };


return(
    <View style= {styles.pscreen}>
  { (myCoord === null) ?
  <Text>Waiting for location to display map ...</Text> :
  <PathView
    start = {coords[0]}
    openCoord = {myCoord}
    end = {stop}
    startTime = {startTime}
    spots = {spots}
    coords = {coords}
    stopTime = {stopTime}
    recording = {recording}

  />
}

        <View style={{ flexDirection:"row", justifyContent: "center"}}>
            <View style={styles.button}>
                <Button 
                disabled = {recording}
                textColor = "#1B5299"
                buttonColor =  "#9FC2CC"
                onPress={startTracking}
                mode="elevated" >Start Recording</Button>
            </View>
            <View style={styles.button}>
            
                <Button textColor = "#1B5299"
                disabled = {!recording}
                buttonColor =  "#9FC2CC"  
                onPress = {stopTracking}
                mode="elevated" >Stop Recording</Button>
            </View>
            
        </View>
        <View style={{ flexDirection:"row", justifyContent: "center"}}>
            <View style={styles.button}>
                <Button textColor = "#9FC2CC"
                disabled = {!recording}
                buttonColor =  "#1B5299"
                onPress = {enterDialog}
                mode="elevated">Add Stop</Button>
            </View>
        </View>
      

           
  
            {/** Multipurpose Modal*/}
            <Modal animationType="slide" 
                   transparent visible={isModalVisible} 
                   presentationStyle="overFullScreen" 
                   //onDismiss={exitDialog}
                   >
                <View style={styles.modalViewWrapper}>
                  {/** View for adding spots  */}
                    {!saveMode && <View style={styles.modalView}>
                        <TextInput placeholder="Title..." 
                                   value={titleInput} style={styles.textInput} 
                                   onChangeText={(value) => setTitleInput(value)} />
                                   <TextInput placeholder="More Info..." 
                                   value={moreInfoInput} style={styles.textInput} 
                                   onChangeText={(value) => setMoreInfoInput(value)} />
  
                        {/** This button is responsible for closing the modal */}
                        <Button 
                           mode="contained"
                           labelStyle={styles.buttonText}
                           onPress={exitDialog}
                        >
                          Add
                        </Button> 
                    </View>}
                    {/** View for  choosing saving or deleting path  */}
                    {saveMode && <View style={styles.modalView}>
                        <Text>Save Path?</Text>
  
                        {/** This button is responsible to close the modal */}
                        {!saving && <Button 
                           mode="contained"
                           labelStyle={styles.buttonText}
                           onPress={()=> setSaving(true)}
                        >
                          Save
                        </Button> }
                        {!saving && <Button 
                           mode="contained"
                           labelStyle={styles.buttonText}
                           onPress={deletePath}
                        >
                          Delete
                        </Button> }
                        
                    </View>}

                    {/** View for saving path/setting title */}
                    {saving && <View style={styles.modalView}>
                    <TextInput placeholder="Path Name" 
                                   value={pathTitleInput} style={styles.textInput} 
                                   onChangeText={(value) => setPathTitleInput(value)} />
                    <Button
                    mode="contained"
                    labelStyle={styles.buttonText}
                    onPress={savePath}>
                      Save Path
                    </Button>
                    {invalidTitle && <Text style = {{color: 'red', marginTop: 5}}>That name is taken, please enter another</Text>}
                      
                      </View>}

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