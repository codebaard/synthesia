const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Webinterface in public
app.use('/', express.static('public'))
// serve socket.io clint from node_modules
app.use('/scripts', express.static('node_modules/socket.io-client/dist/'))
// start server at port 3000
server.listen(3000)

console.log("Webinterface available at http://localhost:3000/")

const MidiOutput = require('./midi.js');

var midi = new MidiOutput();

io.on('connection', client => {
  client.on('volume', ({value, channel}) => {
    midi.setVolume(value, channel)
   });
  client.on('modulation', ({value, channel}) => {
    midi.setModulation(value, channel)
   });
});
