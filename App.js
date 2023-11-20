/*
 * Adapted by Lyn from https://chafikgharbi.com/expo-location-tracking/
 * 
 * Illustrates foreground location tracking. 
 * 
 * Updated 2023/11/02 to remove TaskManager, which is *not* needed for 
 * foreground location tracking.
 */

import { useState } from 'react';
import {FlatList, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Button } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";
import samplePaths from "./samplePaths.js";
import * as Location from 'expo-location';

let subscription = null; // location tracking service

export default function App() {
  const [permissionText, setPermissionText] 
     = useState('Location permission not requested yet');
  const [myCoord, setMyCoord] = useState(null);
  //const [prevCoord, setPrevCoord] = useState(null)
  const [coords, setCoords] = useState([]);
  const [start, setStart] = useState(null);
  const [spot,setSpot] = useState(null);
  const [spots, setSpots] = useState([]);
  [pscreen, setPscreen] = useState("summary")
  //const [distances, set distances] = useState([]);

    // Start foreground location tracking
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
    setMyCoord(null)
    setCoords([]);
   
    console.log('Starting location subscription service.')
    let s = await Location.getCurrentPositionAsync();
    setStart({latitude: s.coords.latitude, longitude: s.coords.longitude});
    setCoords([start]);
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
        // In console.log below, rather unexpectedly, myCoord is always null and
        // coords is always []! This is an example of the "stale closure" problem
        // This means that in this location callback function, myCoord and coords
        // themselves will *never* appear to be updated! But calls to setMyCoord
        // and setCoords will correctly update these state variables for the JSX,
        // and the correct current values can be accesed using the versions of
        // setMyCoord and setCoords that transform the previous value to the 
        // new value. 
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

  // Stop foreground location tracking
  function stopTracking() {
    if (subscription !== null) {
      console.log('Stopping active location subscription service.')
      subscription.remove();
    }
  };

  return (
    
    <SafeAreaView style={styles.container}>
      { pscreen === "Recording" && 
      <View>
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
        {/* <Marker key='myLocation'                                                          
          coordinate={ myCoord }
          pinColor='green'
          title='My location'>
        </Marker>  */}
        <Polyline 
           coordinates={coords}
           strokeColor= "pink"
         />
     </MapView>  
  
    }
      </View>
      }
     
    { pscreen === "Recording" &&
    <View style={styles.controls}>
        <Button title="Start Tracking" onPress={startTracking} color='green'/>
        <Button title="Stop Tracking" onPress={stopTracking} color='red'/>
        <Button title='Add Spot' onPress> </Button>
    </View>
  }
  { pscreen === "Recording" &&
     <ScrollView style={styles.data}>
       <Text>Permission: {JSON.stringify(permissionText)}</Text>   
       <Text>Start Coord: {JSON.stringify(start)}</Text>   
       <Text>Current myCoord: {JSON.stringify(myCoord)}</Text> 
       <Text>coords: {JSON.stringify(coords, null, 2)}</Text> 

    </ScrollView>
    }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  pscreen:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  map: {
    flex: 2, 
    width: '100%',
    height: '100%',
  },
  controls: {
    marginTop: 10, 
    padding: 10, 
    borderRadius: 10, 
    backgroundColor: 'cyan'
  },
  data: {
    flex: 1
  },
  listWrapper: {
    height: '70%', 
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
    justifyContent: "center",
    fontSize: 30,
    margin: 20,
    color: "#1B5299",
    fontWeight: "bold"
  },
  button: {
      margin: 20,
      backgroundColor: "#1B5299"
  },
});

