/*
 * Adapted by Lyn from https://chafikgharbi.com/expo-location-tracking/
 * 
 * Illustrates foreground location tracking. 
 * 
 * Updated 2023/11/02 to remove TaskManager, which is *not* needed for 
 * foreground location tracking.
 */

import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import samplePaths from "./samplePaths.js";
import Summary from "./components/Summary.js";
import Display from "./components/Display.js";
import Recording from "./components/Recording.js";
import * as PathStore from './PathStore.js';




export default function App() {
  
  const [pscreen, setPscreen] = useState("Summary");
  const [currPath, setCurrPath] = useState(null);
  const [paths, setPaths] = useState(samplePaths);

  useEffect(() => {
    async function addPersistentPaths() {
    const persistentPaths = await PathStore.init();
    console.log(`In useEffect, have ${persistentPaths.length} saved paths`);
    combineWithSamplePaths(persistentPaths);
      // You need to define combineWithSamplePaths,
      // which adds the persistently stored paths to the
      // samplePaths in the state variable that holds all paths.
    }
    addPersistentPaths();
  }, []);

  /** combineWithSamplePaths takes in a list of path objects that have been stored
   *  persistently on your device and concatenates it with the paths from sample paths. 
   *  param: persPaths: a list of persistently stored paths
   *  returns: the concatenated new list
   */
  function combineWithSamplePaths(persPaths){
    setPaths((prevPaths) => {
      return [...prevPaths, ...persPaths]
    })
  }

  /** changeScreen takes in a path object and a screen and navigates between pscreens
   * params: p - a path object, can be null if not used in the Summary component
   *         screen - the pScreen to navigate to
   */
  function changeScreen(p, screen){
    setCurrPath(p);
    setPscreen(screen);
  }




  return (
        
    <SafeAreaView style={styles.container}>
        {pscreen=== "Summary" && <Summary myPaths = {paths} display = {changeScreen}/>}
        {pscreen=== "Display" && <Display currPath={currPath} back = {changeScreen}/>}
        {pscreen=== "Recording" && <Recording back = {changeScreen} pathNames = {paths.map((path) => path.name)}/>}
    </SafeAreaView>
  );


 
}

const styles = StyleSheet.create({
  pscreen:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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


