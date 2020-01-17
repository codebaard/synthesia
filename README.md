# Synthesia

This app lets you control a music sequencer with your hand position.
It uses Kinect as the pose estimation software.
Unity3D as the frontend for visualization.
Ableton as the music squencer.
And a node.js server for orchestering all the differnt components.

## How it works

The pose estimation software reads the data from the Kinect and sends it over TCP to the node.js server.
The server convertes and filters the data and sends the data over websockets (socket.io) to Unity3D.
It also sends MIDI commands to Ableton to control the music based on the pose data.
At the same time it generates a log file in th .csv format for evaluation porpuses.
The Python script can read the csv file and displays diagrams.

## How to run
1. Start the node.js server (Node.js is required) in the `server` folder with:

    `npm install`

    `npm start`

    Alternative: In the release section are executables for Windows and MacOS to run the server without Node.js

2. Kinect Server
    1. Start the Kinect software (available at: [https://github.com/codebaard/KinectBodyTrack](https://github.com/codebaard/KinectBodyTrack))
    2. If a Kinect is not available you can start the node.js with the argument `--no-kinect` like: `npm start -- --no-kinect`

3. Open the Unity project in the `Unity_Synthesia` folder. (Version 2019.2.6f1)

4. Open the Ableton Live project in the `AbletonProject` folder.

