const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');

class Logger {

    constructor(filename = 'out.csv') {
        this.csvStringifier = createCsvStringifier({
            header: [
                {id: 'timestamp', title: 'TIMESTAMP'},
                {id: 'tracked_persons_count', title: 'TRACKED_PERSONS_COUNT'},
                {id: 'player_count', title: 'PLAYER_COUNT'},
                {id: 'lane0_active', title: 'LANE_1_ACTIVE'},
                {id: 'lane0_lefthand_x', title: 'LANE_1_LEFT_HAND_X'},
                {id: 'lane0_lefthand_y', title: 'LANE_1_LEFT_HAND_Y'},
                {id: 'lane0_righthand_x', title: 'LANE_1_RIGHT_HAND_X'},
                {id: 'lane0_righthand_y', title: 'LANE_1_RIGHT_HAND_Y'},
                {id: 'lane1_active', title: 'LANE_2_ACTIVE'},
                {id: 'lane1_lefthand_x', title: 'LANE_2_LEFT_HAND_X'},
                {id: 'lane1_lefthand_y', title: 'LANE_2_LEFT_HAND_Y'},
                {id: 'lane1_righthand_x', title: 'LANE_2_RIGHT_HAND_X'},
                {id: 'lane1_righthand_y', title: 'LANE_2_RIGHT_HAND_Y'},
                {id: 'lane2_active', title: 'LANE_3_ACTIVE'},
                {id: 'lane2_lefthand_x', title: 'LANE_3_LEFT_HAND_X'},
                {id: 'lane2_lefthand_y', title: 'LANE_3_LEFT_HAND_Y'},
                {id: 'lane2_righthand_x', title: 'LANE_3_RIGHT_HAND_X'},
                {id: 'lane2_righthand_y', title: 'LANE_3_RIGHT_HAND_Y'},
                {id: 'lane3_active', title: 'LANE_4_ACTIVE'},
                {id: 'lane3_lefthand_x', title: 'LANE_4_LEFT_HAND_X'},
                {id: 'lane3_lefthand_y', title: 'LANE_4_LEFT_HAND_Y'},
                {id: 'lane3_righthand_x', title: 'LANE_4_RIGHT_HAND_X'},
                {id: 'lane3_righthand_y', title: 'LANE_4_RIGHT_HAND_Y'}
            ]
        });

        this.writeStream = fs.createWriteStream(filename);
        this.writeStream.write(this.csvStringifier.getHeaderString());
    }

    log(unity_object, raw_data) {
        let csvObject = {};
        csvObject["timestamp"] = Date.now();
        csvObject["tracked_persons_count"] = raw_data.Persons.length;
        let playerCount = 0;
        for(let i = 0; i < unity_object.lanes.length; i++) {
          let lane = unity_object.lanes[i]
          if (lane.active) {
            playerCount++;
          }
          csvObject[`lane${i}_active`] = lane.active;
          csvObject[`lane${i}_lefthand_x`] = "";
          csvObject[`lane${i}_lefthand_y`] = "";
          csvObject[`lane${i}_righthand_x`] = "";
          csvObject[`lane${i}_righthand_y`] = "";
          if (lane.person != null) {
            csvObject[`lane${i}_lefthand_x`] = lane.person.PoseData[7].x
            csvObject[`lane${i}_lefthand_y`] = lane.person.PoseData[7].y
            csvObject[`lane${i}_righthand_x`] = lane.person.PoseData[11].x
            csvObject[`lane${i}_righthand_y`] = lane.person.PoseData[11].y
          }
        }
        csvObject["player_count"] = playerCount;
        this.writeStream.write(this.csvStringifier.stringifyRecords([csvObject]));
      }

}

module.exports = Logger;