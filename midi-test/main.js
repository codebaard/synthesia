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
  socket.pipe(socket);

  // Add a 'data' event handler to this instance of socket
  socket.on('data', function (data) {
    console.log('DATA ' + socket.remoteAddress + ': ' + data);
    const unity_data = ConvertPoseData(data);
    io.emit('unity_pose_data', unity_data);
  });
}).listen(3000, ip_address);

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
    const unity_data = ConvertPoseData(data);
    io.emit('unity_pose_data', unity_data);
  })
});

function ConvertPoseData(pose_data) {

  const { width, height } = pose_data.capture_area;

  let lanes = [
    {
      person: null
    },
    {
      person: null
    },
    {
      person: null
    },
    {
      person: null
    },
  ]

  // TODO: filter persons by z distance (y value)
  // TODO: filter persons by z rotation (shoulder difference)

  pose_data.persons.forEach(person => {
    const { lane_number, difference } = getLane(person.root.x, width);
    if (lanes[lane_number].person === null) {
      lanes[lane_number].person = person;
      lanes[lane_number].difference = difference;
    } else {
      current_difference = lanes[lane_number].difference;
      if (difference < current_difference) {
        lanes[lane_number].person = person;
        lanes[lane_number].difference = difference;
      }
    }
  });

  lanes = lanes.map((lane, index) => {
    return {
      person: PersonToLocalLane(lane.person, index, {width: width / 4, height })
    }
  })

  return {
    lanes
  }

}

function PersonToLocalLane(person, lane_number, lane_size) {
  for (var key in person) {
    if (person.hasOwnProperty(key)) {
      person[key] = PositionToLocalLanePosition(person[key], lane_number, lane_size);
    }
  }
  return person;
}

function PositionToLocalLanePosition(position, lane_number, lane_size) {
  const offset_x = lane_size.width * lane_number;
  const offset_y = lane_size.height * lane_number;
  return {
    x: (position.x - offset_x) / lane_size.width,
    y: (position.y - offset_y) / lane_size.height,
  }
}

function getLane(x, width, number_of_lanes = 4) {
  const lane_width = width / number_of_lanes;
  const lane_number = Math.floor(x / lane_width);

  const difference = (x % lane_width - (lane_width / 2)) / (lane_width / 2);

  return {
    lane_number,
    difference
  }
}
