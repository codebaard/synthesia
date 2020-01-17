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
                this.getRandomPersonData(),
                this.getRandomPersonData()
            ]
        }
        return poseData;
    }

    getRandomPersonData() {
        let keypoints = [];
        for (let index = 0; index < 25; index++) {
            keypoints.push(this.getRandomKeypoint(index));
        }
        const person = {
            PoseData: keypoints
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