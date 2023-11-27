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