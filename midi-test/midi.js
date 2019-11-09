const midi = require('midi')

class MidiOutput {

    constructor(name = "Node Midi") {
        this.midiOut = new midi.output()
        this.midiOut.openVirtualPort(name)
    }

    setVolume(value, channel = 1) {
        this.midiOut.sendMessage([176 + channel - 1, 7, value])
    }
    setModulation(value, channel = 1) {
        this.midiOut.sendMessage([176 + channel - 1, 1, value])
    }

    channelBlendeing(outChannel, inChannel) {
        for (let i = 0; i <= 10; i++) {
            setTimeout(() => {
                this.setVolume(100 - i * 10, outChannel)
                this.setVolume(i * 10, inChannel)
            }, 200 * i);
        }
    }

}

module.exports = MidiOutput;



function fadeout(channel) {
    for (let i = 0; i <= 10; i++) {
        setTimeout(() => {
            setVolume(100 - i * 10, channel)
        }, 200 * i);
    }
}

function fadein(channel) {
    for (let i = 0; i <= 10; i++) {
        setTimeout(() => {
            setVolume(i * 10, channel)
        }, 200 * i);
    }
}