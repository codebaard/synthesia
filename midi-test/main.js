const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const net = require('net');

let ip_address = '127.0.0.1';

// get local ip address
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  ip_address = add;
  console.log('host ip: ' + add);
})

// start tcp server
net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  //socket.pipe(socket);

  // Add a 'data' event handler to this instance of socket
  socket.on('data', function (data) {
    //console.log('DATA ' + socket.remoteAddress + ': ' + data);
    try {
      const dataString = data.toString();
      const jsonObject = JSON.parse(dataString);
      const unity_data = ConvertPoseData(jsonObject);
      io.emit('unity_pose_data', unity_data);
    } catch (error) {
      console.log("exception");
      console.log("continue...");
    }
  });
}).listen(3000, "141.22.69.73");

console.log('TCP Server at: ' + ip_address + ':' + 3000);

// Webinterface in public
app.use('/', express.static('public'))
// serve socket.io clint from node_modules
app.use('/scripts/socket.io', express.static('node_modules/socket.io-client/dist/'))
app.use('/scripts/konva', express.static('node_modules/konva/'))
// start server at port 8080
server.listen(8080)

console.log("Webinterface available at http://localhost:8080/")

const MidiOutput = require('./midi.js');

var midi = new MidiOutput();

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

  //const { width, height } = pose_data.capture_area;
  const width = 960;
  const height = 720;

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

  pose_data.persons.forEach(person => {
    person.keypoints.forEach(keypointElement => {
      keypointElement.x = 1280 - keypointElement.x
    });
    let root;
    if (person.keypoints.length > 0) {
      person.keypoints.forEach(element => {
        if (element.keypoint == "root") {
          root = element;
        }
      });
      const { lane_number, difference } = getLane(root.x, width, 160);
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
      person: lane.person != null ? PersonToLocalLane(lane.person, index, { width: width / 4, height }) : null
    }
  })

  return {
    lanes
  }

}

function PersonToLocalLane(person, lane_number, lane_size) {
  for (let index = 0; index < person.keypoints.length; index++) {
    person.keypoints[index] = PositionToLocalLanePosition(person.keypoints[index], lane_number, lane_size);
  }
  return person;
}

function PositionToLocalLanePosition(keypoint, lane_number, lane_size, offset = 160) {
  const lane_start_x = offset + lane_size.width * lane_number;
  return {
    keypoint: keypoint.keypoint,
    x: (keypoint.x - lane_start_x) / lane_size.width,
    y: (lane_size.height - keypoint.y) / lane_size.height,
  }
}

function getLane(x, width, offset = 160, number_of_lanes = 4) {
  const lane_width = width / number_of_lanes;
  const lane_number = Math.floor((x - offset) / lane_width);

  const lane_middle = (n) => {
    return offset + (n * lane_width) + (lane_width / 2);
  }
  const difference = lane_middle(lane_number) - x;

  return {
    lane_number,
    difference
  }
}
