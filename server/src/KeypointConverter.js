function ConvertPoseData(pose_data, midiin, musicControl) {

    const width = pose_data.CaptureArea.widthPoseData;
    const height = pose_data.CaptureArea.heightPoseData;

    const fullWidth = pose_data.CaptureArea.widthColorFrame

    let lanes = [
        {
            active: false,
            person: null
        },
        {
            active: false,
            person: null
        },
        {
            active: false,
            person: null
        },
        {
            active: false,
            person: null
        },
    ]

    // TODO: filter persons by z distance (y value)
    // TODO: filter persons by z rotation (shoulder difference)

    pose_data.Persons.forEach(person => {
        if (person.PoseData.length > 0) {
            const root = person.PoseData[1];
            let { lane_number, difference } = getLane(root, width, (fullWidth - width) / 2);
            if (lane_number >= 0 && lane_number < 4) {
                if (lanes[lane_number].person === null) {
                    lanes[lane_number].person = person;
                    lanes[lane_number].difference = difference;
                    lanes[lane_number].active = true;
                } else {
                    current_difference = lanes[lane_number].difference;
                    if (difference < current_difference) {
                        lanes[lane_number].person = person;
                        lanes[lane_number].difference = difference;
                        lanes[lane_number].active = true;
                    }
                }
            }
        }
    });

    lanes = lanes.map((lane, index) => {
        return {
            active: lane.active,
            person: lane.person != null ? PersonToLocalLane(lane.person, index, { width: width / 4, height }, (fullWidth - width) / 2) : null
        }
    })

    return {
        bar: midiin.bar,
        drum: midiin.drumTrack,
        bass: midiin.bassTrack,
        hoverDrum: musicControl.selectedDrumTrack,
        hoverBass: musicControl.selectedBassTrack,
        lanes
    }

}

function PersonToLocalLane(person, lane_number, lane_size, offset) {
    for (let index = 0; index < person.PoseData.length; index++) {
        person.PoseData[index] = PositionToLocalLanePosition(person.PoseData[index], lane_number, lane_size, offset);
    }
    return person;
}

function PositionToLocalLanePosition(keypoint, lane_number, lane_size, offset = 160) {
    const lane_start_x = offset + lane_size.width * lane_number;
    //let y = (lane_size.height - keypoint.y) / lane_size.height;
    let y = ((lane_size.height - keypoint.y) - 320) / 520
    return {
        index: keypoint.index,
        x: (keypoint.x - lane_start_x) / lane_size.width,
        y: y,
        z: keypoint.z
    }
}

function getLane(bone, width, offset = 160, number_of_lanes = 4) {
    if (bone.z > 2 && bone.z < 4) {

        const lane_width = width / number_of_lanes;
        const lane_number = Math.floor((bone.x - offset) / lane_width);

        const lane_middle = (n) => {
            return offset + (n * lane_width) + (lane_width / 2);
        }
        const difference = lane_middle(lane_number) - bone.x;

        return {
            lane_number,
            difference
        }
    }
    return {
        lane_number: -1,
        difference: 0
    }
}

module.exports = ConvertPoseData;