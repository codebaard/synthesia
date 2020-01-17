const midi = require('midi');

class MidiOutput {

    constructor(name = "Node Midi") {
        this.midiOut = new midi.output()

        // Count the available output ports.
        this.midiOut.getPortCount();
        
        // Get the name of a specified output port.
        this.midiOut.getPortName(0);
        console.log(`Midi: connected to ${this.midiOut.getPortName(0)}`);

        // Open the first available output port.
        this.midiOut.openPort(0);
    }

    sendMessage(cmd) {
        this.midiOut.sendMessage(cmd);
    }

    close() {
        // Close the port when done.
        this.midiOut.closePort();
    }

}

module.exports = MidiOutput;