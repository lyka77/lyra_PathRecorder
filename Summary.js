import React, { useState, useEffect } from "react";
import {FlatList, Image, Text, View,  
         StyleSheet, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';
import samplePaths from "./samplePaths.js";
import { Button } from "react-native-paper";



export default function Summary() {


 const ListItem = ({title, start, dist}) => (
   <TouchableOpacity
        onPress={() => toDisplay()}
      >
  <View style={styles.listItem}>
    <Text style={styles.listItemTitle}>{title}
    <Text style={styles.listItemText}>{"\nStart Time:"} {start.toLocaleString()}</Text>
    <Text style={styles.listItemText}>{"\nTotal Distance:"} {dist} {"kilometers"}</Text>
    </Text>
    
  </View>
  </TouchableOpacity>
);

  return (
      <View style={styles.screen}>
      
      < Text style={styles.title}>Previous Paths</Text>
        <View style={styles.listWrapper}>
          <FlatList style={styles.list}
            data={samplePaths} 
            renderItem={({item}) => <ListItem title={item.name} start={new Date(item.startTime)} dist = {item.pathDistance} />} 
            keyExtractor={item => item} 
          />
        </View>
        <Button style = {styles.button} mode="contained" >New Path</Button>
      </View>
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
