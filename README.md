# Synthesia

<div style="text-align:center">
<img src="misc/banner.gif" alt="synthesia gameplay">
</div>

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
    1. Start the Kinect software (look for the submodule "KinectBodyTrack" fore more information)
    2. If a Kinect is not available you can start the node.js with the argument `--no-kinect` like: `npm start -- --no-kinect`

3. Open the Unity project in the `Unity_Synthesia` folder. (Version 2019.2.6f1)

4. Open the Ableton Live project in the `AbletonProject` folder.

## MIDI

Depending on your physical setup you have to ways to make MIDI work:

1. Two physical machines, connected by a TCP connection:

- Windows: use rtpMIDI (https://www.tobias-erichsen.de/software/rtpmidi.html) to establish a MIDI connection with the server               application. Set the MIDI-setttings in Ableton Live 10 accordingly. (INPUT: `Remote` + `Track`, OUTPUT: `Track`)

- MAC: Same procedure as with Windows. The only difference is, that MAC already has a built-in MIDI over TCP service, which works the     same way.

2. One physical machine, using localhost:

- Windows: use LoopBe Internal MIDI to connect MIDI services: https://nerds.de/en/download.html. All other Settings are the same as in     1.

- MAC: Macs MIDI routing should work out of the box with the internal tools.


## How to display diagrams

Run `python log_evaluation.py <filepath to out.csv>`

For dummy log run:

`python python/log_evaluation.py python/dummy.csv` in root directory.