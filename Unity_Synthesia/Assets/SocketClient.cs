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

    public GameObject DrumRoot;
    public GameObject BassRoot;
    public GameObject MelodyRoot;
    public GameObject ToneRoot;

    public BarIndicator DrumBarIndicator;
    public BarIndicator BassBarIndicator;

    public TrackHoverManager DrumTrackManager;
    public TrackHoverManager BassTrackManager;

    // Start is called before the first frame update
    void Start()
    {
        GameObject go = GameObject.Find("SocketIO");
        socket = go.GetComponent<SocketIOComponent>();
        socket.On("unity_pose_data", (SocketIOEvent e) =>
        {
            //Debug.Log(e.data.ToString());
            float bar = e.data["bar"].n;
            float drumTrack = e.data["drum"].n;
            float bassTrack = e.data["bass"].n;
            float hoverDrum = e.data["hoverDrum"].n;
            DrumTrackManager.Hover(hoverDrum);
            float hoverBass = e.data["hoverBass"].n;
            BassTrackManager.Hover(hoverBass);
            DrumBarIndicator.setBar(bar);
            DrumBarIndicator.SetTrack(drumTrack);
            BassBarIndicator.setBar(bar);
            BassBarIndicator.SetTrack(bassTrack);
            List<JSONObject> lanes = e.data["lanes"].list;
            for(int i = 0; i < lanes.Count; i++) {
                if (uiLanes.Length > i) {
                    if (lanes[i]["active"].b) {
                        uiLanes[i].Activate();
                        JSONObject personInLane = lanes[i]["person"];
                        List<JSONObject> keypoints = personInLane["PoseData"].list;
                        float xLeft, yLeft;
                        xLeft = keypoints[7]["x"].f.Remap(0, 1, -8.7f, -4.5f);
                        yLeft = keypoints[7]["y"].f.Remap(0, 1, -4.7f, 3.7f);
                        float xRight, yRight;
                        xRight = keypoints[11]["x"].f.Remap(0, 1, -8.7f, -4.5f);
                        yRight = keypoints[11]["y"].f.Remap(0, 1, -4.7f, 3.7f);

                        float xRoot, yRoot;
                        xRoot = keypoints[1]["x"].f.Remap(0, 1, -8.7f, -4.5f);
                        yRoot = keypoints[1]["y"].f.Remap(0, 1, -4.7f, 3.7f);

                        Vector3 LeftPos = new Vector3(xLeft, yLeft, 0);
                        Vector3 RightPos = new Vector3(xRight, yRight, 0);
                        Vector3 RootPos = new Vector3(xRoot, -4.7f, 0);

                        if (i == 0) {
                            DrumBarIndicator.active = true;
                            leftHandle.SetHandPosition(LeftPos);
                            rightHandle.SetHandPosition(RightPos);
                            DrumRoot.transform.localPosition = RootPos;
                        } else if (i == 1) {
                            BassBarIndicator.active = true;
                            bassHandle.SetHandPosition(RightPos);
                            BassRoot.transform.localPosition = RootPos;
                        } else if (i == 2) {
                            leftTriHandle.SetHandPosition(LeftPos);
                            rightTriHandle.SetHandPosition(RightPos);
                            MelodyRoot.transform.localPosition = RootPos;
                        } else if (i == 3) {
                            leftStarHandle.SetHandPosition(LeftPos);
                            rightStarHandle.SetHandPosition(RightPos);
                            ToneRoot.transform.localPosition = RootPos;
                        }
                        
                    } else {
                        uiLanes[i].Deactivate();
                        if (i == 0) {
                            DrumBarIndicator.active = false;
                        } else if (i == 1) {
                            BassBarIndicator.active = false;
                        }
                    }
                }
            }
        });
    }
}