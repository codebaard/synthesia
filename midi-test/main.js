const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const net = require('net');

net.createServer(function(socket) {
	socket.write('Echo server\r\n');
    socket.pipe(socket);

    // Add a 'data' event handler to this instance of socket
    socket.on('data', function(data) {
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
    });
}).listen(3000, '141.22.88.158');

// Webinterface in public
app.use('/', express.static('public'))
// serve socket.io clint from node_modules
app.use('/scripts', express.static('node_modules/socket.io-client/dist/'))
// start server at port 8080
server.listen(8080)

console.log("Webinterface available at http://localhost:8080/")

const MidiOutput = require('./midi.js');

var midi = new MidiOutput();

io.on('connection', client => {
  console.log("connected");
  client.on('volume', ({value, channel}) => {
    midi.setVolume(value, channel)
   });
  client.on('modulation', ({value, channel}) => {
    midi.setModulation(value, channel)
   });
});
