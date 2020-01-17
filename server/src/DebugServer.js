const net = require('net');

class DebugServer {

    constructor(ip, port) {
        this.client = new net.Socket();
        this.client.connect(port, ip, function() {
            console.log('Connected');
        });
    }

    start(interval=10) {
        this.interval = setInterval(() => {
            this.sendMessage(this.getRandomPoseData());
        }, interval);
    }

    stop() {
        clearInterval(this.interval);
    }

    getRandomPoseData() {
        const poseData = {
            CaptureArea: {
                widthPoseData: 1200,
                heightPoseData: 1080,
                widthColorFrame: 1920,
                heightColorFrame: 1080,
            },
            Persons: [
                this.getRandomPersonData()
            ]
        }
        return poseData;
    }

    getRandomPersonData() {
        const person = {
            PoseData: [
                this.getRandomKeypoint(0),
                this.getRandomKeypoint(1),
                this.getRandomKeypoint(2),
                this.getRandomKeypoint(3),
                this.getRandomKeypoint(4),
                this.getRandomKeypoint(5),
                this.getRandomKeypoint(6),
                this.getRandomKeypoint(7),
                this.getRandomKeypoint(8),
                this.getRandomKeypoint(9),
                this.getRandomKeypoint(10),
                this.getRandomKeypoint(11),
                this.getRandomKeypoint(12),
                this.getRandomKeypoint(13),
                this.getRandomKeypoint(14)
            ]
        }
        return person;
    }

    getRandomKeypoint(index) {
        let keypoint = {
            index: index,
            x: 400,
            y: 500,
            z: 3
        }
        if (index == 7) {
            keypoint.x = 400
            keypoint.y = 400
        } else if (index == 11) {
            keypoint.x = 600
            keypoint.y = 700
        }
        return keypoint;
    }

    sendMessage(object) {
        this.client.write(JSON.stringify(object) + "\n");
    }

}

module.exports = DebugServer;