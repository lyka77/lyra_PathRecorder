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
  setCoords([start]);
  setCurrPath({"start": start})}
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

{spots.map((s) => (
          
          <Marker
            key = {s.title}
            coordinate = {s.coord}
            pinColor = "blue"
            title = {s.title}
            description = {checkUndefined(s.moreInfo) + " "+ s.time}
            />
          ))}

</MapView> 