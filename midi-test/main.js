const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const net = require('net');
const fs = require('fs');

let ip_address = '127.0.0.1';

// get local ip address
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  ip_address = add;
  console.log('host ip: ' + add);
})

let temp = "";

// start tcp server
net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  //socket.pipe(socket);

  // Add a 'data' event handler to this instance of socket
  socket.on('data', function (data) {
    logInfo("Received:\n" +  data);
    //console.log('DATA ' + socket.remoteAddress + ': ' + data);
    temp += data.toString();
    try {
      const dataString = data.toString();
      const jsonObject = JSON.parse(dataString);
      //const sentTime = new Date(jsonObject.Timestamp.Timestamp);
      //logInfo("Data sent at: " + sentTime)
      //logInfo("Time for receiving data: " + (Date.now() - sentTime) + "ms")
      const unity_data = ConvertPoseData(jsonObject);
      io.emit('unity_pose_data', unity_data);
      logInfo("Emitted to Unity: \n" + JSON.stringify(unity_data));
      temp = "";
      controlMusic(unity_data)
    } catch (error) {
      logError("current validation:" + temp);
      logError("error: ");
      logError(error);
      logError("current string:" + data.toString());
    }
  });
}).listen(3000, "141.22.75.201");

console.log('TCP Server at: ' + ip_address + ':' + 3000);

// Webinterface in public
app.use('/', express.static('public'))
// serve socket.io clint from node_modules
app.use('/scripts/socket.io', express.static('node_modules/socket.io-client/dist/'))
app.use('/scripts/konva', express.static('node_modules/konva/'))
// start server at port 8080
server.listen(8080)

console.log("Webinterface available at http://localhost:8080/")

const MusicControl = require('./MusicControl.js');

var musicControl = new MusicControl();

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

io.on('connection', client => {
  console.log("connected");
  client.on('volume', ({ value, channel }) => {
    io.emit('unity', { x: value, y: channel })
    midi.setVolume(value, channel)
  });
  client.on('modulation', ({ value, channel }) => {
    midi.setModulation(value, channel)
  });
  client.on('pose_data', (data) => {
    //console.log(data);
    // const unity_data = ConvertPoseData(data);
    // io.emit('unity_pose_data', unity_data);
  })
});

function ConvertPoseData(pose_data) {

  const width = pose_data.CaptureArea.widthPoseData;
  const height = pose_data.CaptureArea.heightPoseData;

  const fullWidth = pose_data.CaptureArea.widthColorFrame

  let lanes = [
    {
      active: false,
      person: null
    },
    {
      active: false,
      person: null
    },
    {
      active: false,
      person: null
    },
    {
      active: false,
      person: null
    },
  ]

  // TODO: filter persons by z distance (y value)
  // TODO: filter persons by z rotation (shoulder difference)

  pose_data.Persons.forEach(person => {
    if (person.PoseData.length > 0) {
      const root = person.PoseData[1];
      let { lane_number, difference } = getLane(root, width, (fullWidth - width) / 2);
      if (lane_number >= 0 && lane_number < 4) {
        if (lanes[lane_number].person === null) {
          lanes[lane_number].person = person;
          lanes[lane_number].difference = difference;
          lanes[lane_number].active = true;
        } else {
          current_difference = lanes[lane_number].difference;
          if (difference < current_difference) {
            lanes[lane_number].person = person;
            lanes[lane_number].difference = difference;
            lanes[lane_number].active = true;
          }
        }
      }
    }
  });

  lanes = lanes.map((lane, index) => {
    return {
      active: lane.active,
      person: lane.person != null ? PersonToLocalLane(lane.person, index, { width: width / 4, height }, (fullWidth - width) / 2) : null
    }
  })

  return {
    lanes
  }

}

function PersonToLocalLane(person, lane_number, lane_size, offset) {
  for (let index = 0; index < person.PoseData.length; index++) {
    person.PoseData[index] = PositionToLocalLanePosition(person.PoseData[index], lane_number, lane_size, offset);
  }
  return person;
}

function PositionToLocalLanePosition(keypoint, lane_number, lane_size, offset = 160) {
  const lane_start_x = offset + lane_size.width * lane_number;
  //let y = (lane_size.height - keypoint.y) / lane_size.height;
  let y = ((lane_size.height - keypoint.y) - 320) / 520
  return {
    index: keypoint.index,
    x: (keypoint.x - lane_start_x) / lane_size.width,
    y: y,
    z: keypoint.z
  }
}

function getLane(bone, width, offset = 160, number_of_lanes = 4) {
  if (bone.z > 2 && bone.z < 4) {

    const lane_width = width / number_of_lanes;
    const lane_number = Math.floor((bone.x - offset) / lane_width);
    
    const lane_middle = (n) => {
      return offset + (n * lane_width) + (lane_width / 2);
    }
    const difference = lane_middle(lane_number) - bone.x;
    
    return {
      lane_number,
      difference
    }
  }
  return {
    lane_number: -1,
    difference: 0
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