## React Native Path Recorder App
Lyra Kalajian

## App
 - State Hooks:
   - pscreen
        - **Type:** String
        - **Default Value:** 'Summary'
        - **Usage:** Controls which PseudoScreen is shown (Summary, Display, or Recording)
   - currPath
        - **Type:** Object
        - **Default Value:** null
        - **Usage:** The current path, passed down to Display and Summary components to be used to display paths
    - paths
        - **Type:** List of path objects
        - **Default Value:** samplePaths
        - **Usage:** a list of all the path objects. Initially set to the contents of the samplePaths file, then later gets combined with all of the persistently stored paths

## Display
- Properties passed to Display:
    - Currpath: a path object that contains all the information about the path that was chosen in the summary screen. This tells the screen which path to display. 
    - Back: a function that navigates between pscreens. It is helpful for abstraction purposes, it takes in two parameters, one a path and the other a screen (for use in summary) but in display the first parameter is null and it is just used to get back to Summary.
## Pathview
- Properties passed to PathView:
    - openCoord: an object containing a latitude and longitude, the coord that tells the map where to orient when it is first generated.
    - start: an object containing a latitude and longitude, the start of the path (marked by a pin)
    - end: an object containing a latitude and longitude, the end of the path (marked by a pin)
    - recording: a boolean that says whether or not the map is recording a current path. This is important both because this screen is used in the Recording and Display screens, and alos because some aspects (like the end coordinate on the recording screen) will not exist until the path is done recording.
    - startTime: The date and time when the recording was started, required for the start marker
    - spots: a list of spot objects describing the spots in the map, required to render the spot markers
    - coords: a list of all the coords that were recorded for that path, required to show the path using a polyline.
    - stopTime: The date and time when the recording was ended, required for the Finish marker
## Recording
 - Properties passed to Recording: 
    - back: a function that navigates between pscreens. It is helpful for abstraction purposes, it takes in two parameters, one a path and the other a screen (for use in summary) but in recording the first parameter is null and it is just used to get back to Summary.
    - extendPaths: a function that adds a path object to the existing list of paths. This handles the fact that upon navigating back to the summary pscreen after recording a new path, the newly persistently stored path will not be be shown until the page is reloaded. This makes sure it is shown in the meantime.
    - pathNames: A list of names of existing paths, used to make sure any new path is not named the same as an exisiting path
    
 - State Hooks:
  - Permission Text
    - **Type:** String
    - **Default Value:** 'Location permission not requested yet'
    - **Usage:** Used to display information about the status of the location permissions
  - myCoord
    - **Type:** Coordinate object
    - **Default Value:** null
    - **Usage:** Used to track user position as they are moving, updated every time user moves
  - stop
    - **Type:** Coordinate object
    - **Default Value:** null
    - **Usage:** Stores the location that the user stopped the recording. Required to both display and save info about the recording
  - coords
    - **Type:** List of coord objects
    - **Default Value:** []
    - **Usage:** All the positions that the user went through as they were moving, used to display the users path with a polyline.
  - spots
    - **Type:** List of spot objects
    - **Default Value:** []
    - **Usage:** Any and all spots the user makes along the path while recording. Used to display spots as pins on the map
  - isModalVisible
    - **Type:** Boolean
    - **Default Value:** false
    - **Usage:** Controls whether or not the modal is shown. The modal is used for saving spots, saving a path, and setting the path name.
  - recording
    - **Type:** Boolean
    - **Default Value:** false
    - **Usage:** Whether or not the path is currently being recorded. Controls whether some buttons are disabled.
  - titleInput
    - **Type:** String
    - **Default Value:** ''
    - **Usage:** The text inputted as a title for a spot in the modal generated by the 'add spot' button
  - moreInfoInput
    - **Type:** String
    - **Default Value:** ''
    - **Usage:** The text inputted as the description for a spot in the modal generated by the 'add spot' button
  - saveMode
    - **Type:** Boolean
    - **Default Value:** false
    - **Usage:** Whether or not the modal should be in 'save mode', which shows 'save path' and 'delete path' options. Controls what things show up in the modal because it is used for several different things.
  - saving
    - **Type:** Boolean
    - **Default Value:** false
    - **Usage:** Whether or not the user has chosen to save the path. Controls the modal showing a text input to name the path and disabling other stuff.
  - startTime
    - **Type:** Date object
    - **Default Value:** null
    - **Usage:** The time the user started recording the path. Used in the desc. of the Start marker.
  - stopTime
    - **Type:** Date object
    - **Default Value:** null
    - **Usage:** The time the user stopped recording the path. Used in the desc. of the Finish marker.
  - pathDistance
    - **Type:** Float
    - **Default Value:** null
    - **Usage:** The total distance of the path from start to finish. Used to display the total distance in the flatlist of paths in the summary page
  - pathTitleInput
    - **Type:** String
    - **Default Value:** ''
    - **Usage:** The text inputted as the title for the path. Used to check against existing path titles to insure uniqueness and also displayed in the summary and display screens
  - invalidTitle
    - **Type:** Boolean
    - **Default Value:** false
    - **Usage:** Whether or not the title is unique. If it is not, the path will not be saved upon hitting savePath and will instead show an error message until the name is unique.
## Summary
 - Properties passed to Recording:
    - myPaths: a list of path objects that the flatlist should display 
    - display: a function that navigates between pscreens. It is helpful for abstraction purposes, it takes in two parameters, one a path and the other a screen and is used in Summary change to the display screen and also tell display what path to show.


## Lessons
    I learned a lot about React Native, specifically about the mapview and flatlist components and how to use pseudo screens. I also got more comfortable with using state hooks and with passing info between components, and breaking the code down into smaller components in general. I studied a lot of the documentation for react-native-paper. I know more about how location services work as well.
