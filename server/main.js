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


const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const csvStringifier = createCsvStringifier({
    header: [
        {id: 'timestamp', title: 'TIMESTAMP'},
        {id: 'tracked_persons_count', title: 'TRACKED_PERSONS_COUNT'},
        {id: 'player_count', title: 'PLAYER_COUNT'},
        {id: 'lane0_active', title: 'LANE_1_ACTIVE'},
        {id: 'lane0_lefthand_x', title: 'LANE_1_LEFT_HAND_X'},
        {id: 'lane0_lefthand_y', title: 'LANE_1_LEFT_HAND_Y'},
        {id: 'lane0_righthand_x', title: 'LANE_1_RIGHT_HAND_X'},
        {id: 'lane0_righthand_y', title: 'LANE_1_RIGHT_HAND_Y'},
        {id: 'lane1_active', title: 'LANE_2_ACTIVE'},
        {id: 'lane1_lefthand_x', title: 'LANE_2_LEFT_HAND_X'},
        {id: 'lane1_lefthand_y', title: 'LANE_2_LEFT_HAND_Y'},
        {id: 'lane1_righthand_x', title: 'LANE_2_RIGHT_HAND_X'},
        {id: 'lane1_righthand_y', title: 'LANE_2_RIGHT_HAND_Y'},
        {id: 'lane2_active', title: 'LANE_3_ACTIVE'},
        {id: 'lane2_lefthand_x', title: 'LANE_3_LEFT_HAND_X'},
        {id: 'lane2_lefthand_y', title: 'LANE_3_LEFT_HAND_Y'},
        {id: 'lane2_righthand_x', title: 'LANE_3_RIGHT_HAND_X'},
        {id: 'lane2_righthand_y', title: 'LANE_3_RIGHT_HAND_Y'},
        {id: 'lane3_active', title: 'LANE_4_ACTIVE'},
        {id: 'lane3_lefthand_x', title: 'LANE_4_LEFT_HAND_X'},
        {id: 'lane3_lefthand_y', title: 'LANE_4_LEFT_HAND_Y'},
        {id: 'lane3_righthand_x', title: 'LANE_4_RIGHT_HAND_X'},
        {id: 'lane3_righthand_y', title: 'LANE_4_RIGHT_HAND_Y'}
    ]
});

const writeStream = fs.createWriteStream('out.csv');

writeStream.write(csvStringifier.getHeaderString());

let ip_address = '127.0.0.1';

let temp = "";

// start tcp server
net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  //socket.pipe(socket);

  // Add a 'data' event handler to this instance of socket
  socket.on('data', function (data) {
    logInfo("Received:\n" +  data);
    try {
      let splittedData = data.toString().split('\n');
      data = splittedData[splittedData.length - 2]
      //console.log('DATA ' + socket.remoteAddress + ': ' + data);
      temp += data.toString();
      const dataString = data.toString();
      const jsonObject = JSON.parse(dataString);
      //const sentTime = new Date(jsonObject.Timestamp.Timestamp);
      //logInfo("Data sent at: " + sentTime)
      //logInfo("Time for receiving data: " + (Date.now() - sentTime) + "ms")
      const unity_data = ConvertPoseData(jsonObject, midiin, musicControl);
      io.emit('unity_pose_data', unity_data);
      saveToCSV(unity_data,jsonObject);
      logInfo("Emitted to Unity: \n" + JSON.stringify(unity_data));
      temp = "";
      controlMusic(unity_data)
    } catch (error) {
      logError("error: ");
      logError(error);
      //logError("current string:" + data.toString());
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

function saveToCSV(unity_object, raw_data) {
  let csvObject = {};
  csvObject["timestamp"] = Date.now();
  csvObject["tracked_persons_count"] = raw_data.Persons.length;
  let playerCount = 0;
  for(let i = 0; i < unity_object.lanes.length; i++) {
    let lane = unity_object.lanes[i]
    if (lane.active) {
      playerCount++;
    }
    csvObject[`lane${i}_active`] = lane.active;
    csvObject[`lane${i}_lefthand_x`] = "";
    csvObject[`lane${i}_lefthand_y`] = "";
    csvObject[`lane${i}_righthand_x`] = "";
    csvObject[`lane${i}_righthand_y`] = "";
    if (lane.person != null) {
      csvObject[`lane${i}_lefthand_x`] = lane.person.PoseData[7].x
      csvObject[`lane${i}_lefthand_y`] = lane.person.PoseData[7].y
      csvObject[`lane${i}_righthand_x`] = lane.person.PoseData[11].x
      csvObject[`lane${i}_righthand_y`] = lane.person.PoseData[11].y
    }
  }
  csvObject["player_count"] = playerCount;
  writeStream.write(csvStringifier.stringifyRecords([csvObject]));
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