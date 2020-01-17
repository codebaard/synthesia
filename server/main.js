const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server, { wsEngine: 'ws' });
const net = require('net');
const fs = require('fs');

const ConvertPoseData = require('./src/KeypointConverter.js');

const MidiInput = require('./src/MidiInput');
var midiin = new MidiInput()

const MusicControl = require('./src/MusicControl.js');
var musicControl = new MusicControl();

const Logger = require('./src/Logger.js');
var logger = new Logger();

let ip_address = '127.0.0.1';

// start tcp server
net.createServer(function (socket) {
  socket.on('data', function (data) {
    logInfo("Received:\n" +  data);
    try {
      // split data packets at '\n'
      let splittedData = data.toString().split('\n');
      // only use last packet
      data = splittedData[splittedData.length - 2]
      const dataString = data.toString();
      // parse json string
      const jsonObject = JSON.parse(dataString);
      // convert raw data to local data for unity
      const unity_data = ConvertPoseData(jsonObject, midiin, musicControl);
      // send to unity
      io.emit('unity_pose_data', unity_data);
      // log data to csv
      logger.log(unity_data,jsonObject);
      // log data to console
      logInfo("Emitted to Unity: \n" + JSON.stringify(unity_data));
      // set midi notes based on data
      controlMusic(unity_data)
    } catch (error) {
      logError("error: " + error);
    }
  });
}).listen(3000, ip_address);

server.listen(8080);

io.on('connection', client => {
  console.log("Unity connected");
});

console.log('TCP Server at: ' + ip_address + ':' + 3000);

const DebugServer = require('./src/DebugServer.js');
const debugServer = new DebugServer(ip_address, 3000);
debugServer.start();


function controlMusic(data) {
  if (data.lanes[0].active) {
    musicControl.unmuteDrums()
    let leftHand = data.lanes[0].person.PoseData[7];
    let rightHand = data.lanes[0].person.PoseData[11];
    let drumTrack = Math.ceil(leftHand.y * 4)
    musicControl.setDrumTrack(drumTrack)
    let speed = Math.abs(leftHand.x - rightHand.x) * 127
    musicControl.setBPM(speed)
  } else {
    musicControl.setBPM(64);
    musicControl.muteDrums()
  }
  if (data.lanes[1].active) {
    musicControl.unmuteBass()
    let rightHand = data.lanes[1].person.PoseData[11];
    let bassTrack = Math.ceil(rightHand.y * 4)
    musicControl.setBassTrack(bassTrack)
    let cutoff = rightHand.x * 127;
    musicControl.setBassFilterCutoff(cutoff)
  } else {
    musicControl.muteBass()
  }
  if (data.lanes[2].active) {
    let leftHand = data.lanes[2].person.PoseData[7];
    let rightHand = data.lanes[2].person.PoseData[11];
    let rate = Math.abs(leftHand.y - rightHand.y) * 127
    musicControl.setSynthRate(rate)
    let step = leftHand.x * 127;
    musicControl.setSynthStep(step)
    let distance = rightHand.x * 127;
    musicControl.setSynthDistance(distance)

  } else {
    musicControl.setSynthRate(40)
    musicControl.setSynthStep(100)
    musicControl.setSynthDistance(70)
  }
  if (data.lanes[3].active) {
    let leftHand = data.lanes[3].person.PoseData[7];
    let rightHand = data.lanes[3].person.PoseData[11];

    let cutoff = Math.abs(leftHand.x - rightHand.x) * 127
    musicControl.setSynthFilterCutoff(cutoff)
    let curve = leftHand.y * 127
    musicControl.setSynthFilterCurve(curve)
    
  } else {
    musicControl.setSynthFilterCutoff(80)
  }

  if (!data.lanes[2].active && !data.lanes[3].active) {
    musicControl.muteSynth();
  } else {
    musicControl.unmuteSynth();
  }
}


function logInfo(message) {
  fs.appendFile("info.log", message + "\r\n", () => {});
}

function logError(message) {
  fs.appendFile("error.log", message + "\r\n", () => {});
}

logInfo("-------------------------");
logInfo("");
logInfo("-------------------------");
logInfo("**** Started Server ****");
logInfo("Started at: " + Date.now());