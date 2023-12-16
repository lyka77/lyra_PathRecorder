import React, { useState, useEffect } from "react";
import {FlatList, Image, Text, View,  
         StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Constants from 'expo-constants';
import samplePaths from "../samplePaths.js";
import { Button } from "react-native-paper";

export default function PathView({currPath}){

    function checkUndefined(info){
        if (info == undefined){
          return "";
        }
        return info;
      }
      function readableTime(prevDate){
        d = new Date(prevDate);
        return d.toLocaleString();
      }

    return(
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
        );
}
