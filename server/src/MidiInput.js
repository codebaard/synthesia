const midi = require('midi');
const EventEmitter = require('events');

class MidiInput {

    constructor(port = 0) {
        this.emitter = new EventEmitter();
        this.midiIn = new midi.input()

        this.bar = 0;
        this.drumTrack = 1;
        this.bassTrack = 1;
        this.started = false;

        this.midiIn.ignoreTypes(true, false, true)

        this.midiIn.on('message', (deltaTime, message) => {       
            let status = message[0]
            let note = message[1]
            let data = message[2]

            if (status == 144) {
                if (data == 100) {
                    if (this.started) {
                        this.bar++;
                        this.emitter.emit('bar', this.bar)
                    }
                }
                if (data == 80) {
                    this.started = true;
                    this.bar = 0;
                    this.emitter.emit('bar', this.bar)
                }
            }
            if (status === 145) {
                if (note == 24) {
                    this.drumTrack = 1;
                }
                if (note == 25) {
                    this.drumTrack = 2;
                }
                if (note == 26) {
                    this.drumTrack = 3;
                }
                if (note == 27) {
                    this.drumTrack = 4;
                }
            }
            if (status === 146) {
                if (note == 24) {
                    this.bassTrack = 1;
                }
                if (note == 25) {
                    this.bassTrack = 2;
                }
                if (note == 26) {
                    this.bassTrack = 3;
                }
                if (note == 27) {
                    this.bassTrack = 4;
                }
            }
          });

        // Open the first available output port.
        this.midiIn.openPort(port);
    }

    onBarChange(callback) {
        this.emitter.on('bar',(bar) => callback(bar))
    }

    close() {
        // Close the port when done.
        this.midiIn.closePort();
    }

}

module.exports = MidiInput;
