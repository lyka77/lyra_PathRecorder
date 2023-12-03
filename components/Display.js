import React, { useState, useEffect } from "react";
import {FlatList, Image, Text, View,  
         StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Constants from 'expo-constants';
import samplePaths from "../samplePaths.js";
import { Button } from "react-native-paper";


export default function Display({currPath, back}) {

  function readableTime(prevDate){
    d = new Date(prevDate);
    return d.toLocaleString();
  }

  function checkUndefined(info){
    if (info == undefined){
      return "";
    }
    return info;
  }

    return(
      <View style= {styles.pscreen}>
        <Text style={styles.title}>{currPath.name}</Text>
       
        <MapView style={styles.map} 
        
        initialRegion={{
        latitude: currPath.coords[0].latitude,
        longitude: currPath.coords[0].longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
        }}
        showsCompass={true} 
        //showsUserLocation={true} 
        rotateEnabled={true}
      >
       { <Marker
          key = "start"
          coordinate = {currPath.coords[0]}
          pinColor = "red"
          title = "Start"
          description={readableTime(currPath.startTime)}/>
          }
        {<Marker 
          key = "end"
          coordinate = {currPath.coords[currPath.coords.length-1]}
          pinColor = "purple"
          title = "Stop"
          description={readableTime(currPath.stopTime)}
          />}
        {currPath.spots.map(spot => (
          
        <Marker
          key = {spot.title}
          coordinate = {spot.coord}
          pinColor = "blue"
          title = {spot.title}
          description = {checkUndefined(spot.moreInfo) + " "+ readableTime(spot.time)}
          />
        ))}
        
        {<Polyline 
           coordinates={currPath.coords}
           strokeColor= "#1B5299"
           strokeWidth={3}
         />}
          </MapView>
          <Button style = {styles.button} 
          textColor = "#1B5299"
          buttonColor =  "#9FC2CC"
          icon="arrow-left" 
          mode="elevated" 
          onPress={()=>back(null, "Summary") }> Go Back </Button>
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
});