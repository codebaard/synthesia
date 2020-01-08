using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SocketIO;
using System;

public class SocketClient : MonoBehaviour
{

    SocketIOComponent socket;
    public Lane[] uiLanes;
    public ShapeHandle leftHandle;
    public ShapeHandle rightHandle;
    public ShapeHandle bassHandle;
    public ShapeHandle leftTriHandle;
    public ShapeHandle rightTriHandle;
    public ShapeHandle leftStarHandle;
    public ShapeHandle rightStarHandle;

    // Start is called before the first frame update
    void Start()
    {
        GameObject go = GameObject.Find("SocketIO");
        socket = go.GetComponent<SocketIOComponent>();
        socket.On("unity_pose_data", (SocketIOEvent e) =>
        {
            Debug.Log(e.data.ToString());
            List<JSONObject> lanes = e.data["lanes"].list;
            for(int i = 0; i < lanes.Count; i++) {
                if (uiLanes.Length > i) {
                    if (lanes[i]["active"].b) {
                        uiLanes[i].Activate();
                        JSONObject personInLane = lanes[i]["person"];
                        List<JSONObject> keypoints = personInLane["PoseData"].list;
                        float xLeft, yLeft;
                        xLeft = keypoints[7]["x"].f.Remap(0, 1, -8.7f, -4.5f);
                        yLeft = keypoints[7]["y"].f.Remap(0, 1, -4.7f, 4.7f);
                        float xRight, yRight;
                        xRight = keypoints[11]["x"].f.Remap(0, 1, -8.7f, -4.5f);
                        yRight = keypoints[11]["y"].f.Remap(0, 1, -4.7f, 4.7f);

                        Vector3 LeftPos = new Vector3(xLeft, yLeft, 0);
                        Vector3 RightPos = new Vector3(xRight, yRight, 0);

                        if (i == 0) {
                            leftHandle.SetHandPosition(LeftPos);
                            rightHandle.SetHandPosition(RightPos);
                        } else if (i == 1) {
                            bassHandle.SetHandPosition(RightPos);
                        } else if (i == 2) {
                            leftTriHandle.SetHandPosition(LeftPos);
                            rightTriHandle.SetHandPosition(RightPos);
                        } else if (i == 3) {
                            leftStarHandle.SetHandPosition(LeftPos);
                            rightStarHandle.SetHandPosition(RightPos);
                        }
                        
                    } else {
                        uiLanes[i].Deactivate();
                    }
                }
            }
        });
    }
}