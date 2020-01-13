const midi = require('midi');
const EventEmitter = require('events');

class MidiInput {

    constructor(name = "Node Midi") {
        this.emitter = new EventEmitter();
        this.midiIn = new midi.input()

        this.bar = 0;
        this.started = false;

        // Count the available output ports.
        this.midiIn.getPortCount();
        
        // Get the name of a specified output port.
        this.midiIn.getPortName(0);

        this.midiIn.ignoreTypes(true, false, true)

        this.midiIn.on('message', (deltaTime, message) => {       
            let data = message[2]

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
          });

        // Open the first available output port.
        this.midiIn.openPort(0);
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
