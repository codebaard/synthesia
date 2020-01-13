const MidiOutput = require('./MidiOutput');

class MusicControl {

    constructor() {
        this.midi = new MidiOutput()
    }

    setBassTrack(track) {

        switch (track) {
            case 1:
                this.midi.sendMessage([176, 20, 127])
                break;
            case 1:
                this.midi.sendMessage([176, 20, 127])
                break;
            default:
                break;
        }

    }


}


