const MidiOutput = require('./MidiOutput');

class MusicControl {

    constructor() {
        this.midi = new MidiOutput()
    }

    setDrumTrack(track) {
        switch (track) {
            case 1:
                this.midi.sendMessage([176, 10, 127])
                break;
            case 2:
                this.midi.sendMessage([176, 11, 127])
                break;
            case 3:
                this.midi.sendMessage([176, 12, 127])
                break;
            case 4:
                this.midi.sendMessage([176, 13, 127])
                break;
            default:
                console.log("Bass Track is not available")
                break;
        }
    }

    setBassTrack(track) {
        switch (track) {
            case 1:
                this.midi.sendMessage([176, 14, 127])
                break;
            case 2:
                this.midi.sendMessage([176, 15, 127])
                break;
            case 3:
                this.midi.sendMessage([176, 16, 127])
                break;
            case 4:
                this.midi.sendMessage([176, 17, 127])
                break;
            default:
                console.log("Bass Track is not available")
                break;
        }
    }

    setBPM(speed) {
        this.midi.sendMessage([176, 18, speed])
    }

    setBassFilterCutoff(value) {
        this.midi.sendMessage([176, 19, value])
    }

    setSynthRate(value) {
        this.midi.sendMessage([176, 20, value])
    }

    setSynthKey(value) {
        this.midi.sendMessage([176, 21, value])
    }

    setSynthStep(value) {
        this.midi.sendMessage([176, 22, value])
    }

    setSynthDistance(value) {
        this.midi.sendMessage([176, 23, value])
    }

    setSynthFilterCutoff(value) {
        this.midi.sendMessage([176, 24, value])
    }
    setSynthFilterCurve(value) {
        this.midi.sendMessage([176, 25, value])
    }

    stop() {
        this.midi.sendMessage([176, 26, 127])
    }

    setVolumeDrums(value) {
        this.midi.sendMessage([176, 27, value])
    }
    setVolumeBass(value) {
        this.midi.sendMessage([176, 28, value])
    }
    setVolumeSynth(value) {
        this.midi.sendMessage([176, 29, value])
    }

    muteDrums() {
        this.setVolumeDrums(0)
    }
    unmuteDrums() {
        this.setVolumeDrums(108)
    }

    muteBass() {
        this.setVolumeBass(0)
    }
    unmuteBass() {
        this.setVolumeBass(108)
    }
    muteSynth() {
        this.setVolumeSynth(0)
    }
    unmuteSynth() {
        this.setVolumeSynth(108)
    }


}

module.exports = MusicControl;

// let control = new MusicControl()
// control.setBassTrack(1);