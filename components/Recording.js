import { useState } from 'react';
import { Dimensions, Modal, TextInput, Text, View, StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import * as Location from 'expo-location';
import PathView from './PathView';
import { pathDistanceInMeters } from '../distance.js';
import * as PathStore from '../PathStore.js';

let subscription = null; // location tracking service
const { width } = Dimensions.get("window");

export default function Recording({ back, extendPaths, pathNames }) {
  const [permissionText, setPermissionText]
    = useState('Location permission not requested yet');
  const [myCoord, setMyCoord] = useState(null);
  const [stop, setStop] = useState(null);
  const [coords, setCoords] = useState([]);
  const [spots, setSpots] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [recording, setRecording] = useState(false);
  // Manages text within the dialog popup
  const [titleInput, setTitleInput] = useState('');
  const [moreInfoInput, setMoreInfoInput] = useState('');
  const [saveMode, setSaveMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [pathDistance, setPathDistance] = useState(null);
  const [pathTitleInput, setPathTitleInput] = useState('');
  const [invalidTitle, setInvalidTitle] = useState(false);

  //Modal text input  for saving spots opens up
  function enterDialog() {
    setTitleInput('');
    setMoreInfoInput('');
    setModalVisible(true);

  }

  /** saveSpot creates a spot object based on the title and description entered 
   * into the modal and the time when saved. Adds that object to the existing 
   * list of spots. Also closes the modal.
   */
  function saveSpot() {
    setModalVisible(false);
    const newSpot = {
      "title": titleInput,
      "moreInfo": moreInfoInput,
      "time": Date.now(),
      "coord": myCoord
    };

    setSpots((prevSpots) => {
      return [...prevSpots, newSpot];
    });

    //console.log(spots);
  }

  /** savePath is called when the user is saving a path. It checks if the user chosen path title 
   * is unique. If not, it shows an error message telling the user to pick a new name. 
   * If it is, it closes the modal, and stores a new path object into persistent storage using PathStore.
   */
  function savePath() {
    if (pathNames.includes(pathTitleInput)) {
      setInvalidTitle(true);

    } else {
      setInvalidTitle(false);
      setModalVisible(false);
      const path = {"name": pathTitleInput,
      "startTime": new Date(startTime), 
      "stopTime": new Date(stopTime), 
      "pathDistance": pathDistance/1000, // kilometers
      "spots": spots,
      "coords": coords}
      extendPaths(path); 
      //console.log(currPath);
      PathStore.storePath(path);
    }
  }
  /** deletePath is called when the delete path button is pressed in the modal. It sets all 
   * changed state variables back to their intitial values, closes the modal, and sets the screen back 
   * to what it looked like on first opening it (i.e. no map displayed yet).
   */
  function deletePath() {
    setModalVisible(false);
    setSpots([]);
    setCoords([]);
    setStartTime(null);
    setStopTime(null);
    setStop(null);
    setMyCoord(null);
    setRecording(false);
    setSaving(false);
    setSaveMode(false);
    setPathDistance(null);
  }

  /** startTracking is called by pressing the 'start recording' button. It gets location data
   * from the user that displays the map. It tracks the movement of the user and keeps track of
   * the old positions.
   */
  async function startTracking() {
    setStartTime(Date.now())
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

        distanceInterval: 8 // In meters. Try other distance intervals!
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

   /** stopTracking is called by pressing the 'stop recording' button. It shuts down the location 
    * subscription service, stopping tracing the users position. It opens up the modal that
    * gives the user the option to save or delete the path. It saves the total path distance by 
    * calling the pathDistanceInMeters function described in distance.js. It also sets the stop
    * object to be the last coord that the user was at and sets the time at which the button was pressed.
   */
  function stopTracking() {
    if (subscription !== null) {
      console.log('Stopping active location subscription service.')
      subscription.remove();
      setPathDistance(pathDistanceInMeters(coords));
      setStopTime(Date.now);
      setRecording(false);
      setSaveMode(true);
      setModalVisible(true);
      setStop(coords[coords.length - 1]);
    }
  };


  return (
    <View style={styles.pscreen}>
      {(myCoord === null) ?
        <Text>Waiting for location to display map ...</Text> :
        <PathView
          start={coords[0]}
          openCoord={myCoord}
          end={stop}
          startTime={startTime}
          spots={spots}
          coords={coords}
          stopTime={stopTime}
          recording={recording}

        />
      }

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={styles.button}>
          <Button
            disabled={recording || saving}
            textColor="#1B5299"
            buttonColor="#9FC2CC"
            onPress={startTracking}
            mode="elevated" >Start Recording</Button>
        </View>
        <View style={styles.button}>

          <Button textColor="#1B5299"
            disabled={!recording}
            buttonColor="#9FC2CC"
            onPress={stopTracking}
            mode="elevated" >Stop Recording</Button>
        </View>

      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={styles.button}>
          <Button textColor="#9FC2CC"
            disabled={!recording}
            buttonColor="#1B5299"
            onPress={enterDialog}
            mode="elevated">Add Stop</Button>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={styles.button}>
          <Button
            textColor="#1B5299"
            buttonColor="#9FC2CC"
            icon="arrow-left"
            mode="elevated"
            disabled={recording}
            onPress={() => back(null, "Summary")}> Go Back </Button>
        </View>
      </View>
    




  {/** Multipurpose Modal*/ }
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

        {/** */}
        <Button
          mode="contained"
          buttonColor='9FC2CC'
          textColor = "#1B5299"
          onPress={saveSpot}
        >
          Add
        </Button>
      </View>}
      {/** View for  choosing saving or deleting path  */}
      {saveMode && <View style={styles.modalView}>
        <Text>Save Path?</Text>

        {/** */}
        {!saving && <Button
          buttonColor='9FC2CC'
          textColor = "#1B5299"
          mode="contained"
          onPress={() => setSaving(true)}
        >
          Save
        </Button>}
        {!saving && <Button
          buttonColor='9FC2CC'
          textColor = "#1B5299"
          mode="contained"
          onPress={deletePath}
        >
          Delete
        </Button>}

      </View>}

      {/** View for saving path/setting title */}
      {saving && <View style={styles.modalView}>
        <TextInput placeholder="Path Name"
          value={pathTitleInput} style={styles.textInput}
          onChangeText={(value) => setPathTitleInput(value)} />
        <Button
          buttonColor='9FC2CC'
          textColor = "#1B5299"
          mode="contained"
          onPress={savePath}>
          Save Path
        </Button>
        {invalidTitle && <Text style={{ color: 'red', marginTop: 5 }}>That name is taken, please enter another</Text>}

      </View>}

    </View>
  </Modal>




    </View >
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
    backgroundColor: "#F1ECCE",
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