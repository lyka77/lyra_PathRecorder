import React, { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";


export default function PathView({ openCoord, start, end, recording, startTime, spots, coords, stopTime }) {


  /** checkUndefined handles the case where the moreInfo section of a spot is empty
   * params: info - a string containing the spot description
   * returns: an empty string if the user chose not to write a description
   *          the info string otherwise
   */
  function checkUndefined(info) {
    if (info == undefined) {
      return "";
    }
    return info;
  }

  /** readableTime takes in a date in milliseconds and makes it into a readable date and time
   * params: prevDate - a date in milliseconds since Jan 1, 1970
   * returns: a readable date in the general form '11/14/2023, 1:31:46 PM'
   */
  function readableTime(prevDate) {
    d = new Date(prevDate);
    return d.toLocaleString();
  }

  return (
    <MapView style={styles.map}

      initialRegion={{
        latitude: openCoord.latitude,
        longitude: openCoord.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
      showsCompass={true}
      showsUserLocation={true}
      rotateEnabled={true}
    >
      {<Marker
        key="start"
        coordinate={start}
        pinColor="red"
        title="Start"
        description={readableTime(startTime)} />
      }
      {recording && <Marker
        key="currLocation"
        coordinate={openCoord}
        pinColor='#f15bb5'
        title="Me"
      />}
      {!recording && <Marker
        key="end"
        coordinate={end}
        pinColor="purple"
        title="Finish"
        description={readableTime(stopTime)}
      />}
      {spots.map(spot => (

        <Marker
          key={spot.title}
          coordinate={spot.coord}
          pinColor="blue"
          title={spot.title}
          description={checkUndefined(spot.moreInfo) + " " + readableTime(spot.time)}
        />
      ))}

      {<Polyline
        coordinates={coords}
        strokeColor="#1B5299"
        strokeWidth={3}
      />}
    </MapView>
  );
}



const styles = StyleSheet.create({

  pscreen: {
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
  title: {
    textAlign: "center",
    fontSize: 20,
    margin: 20,
    color: "#1B5299",
    fontWeight: "bold"
  },
  button: {
    margin: 10,
  },
});