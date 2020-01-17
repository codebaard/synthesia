const midi = require('midi');

class MidiOutput {

    constructor(port = 0) {
        this.midiOut = new midi.output()
        // Open the first available output port.
        this.midiOut.openPort(port);
        console.log(`Midi: connected to ${this.midiOut.getPortName(port)}`);
    }

    static printAvavilableDevices() {
       const midiOut = new midi.output()

        // Count the available output ports.
        midiOut.getPortCount();
        console.log("Avavilable Devices:");
        for (let index = 0; index < midiOut.getPortCount(); index++) {
            console.log(index + " : " + midiOut.getPortName(index))
        }
        
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