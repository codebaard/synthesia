using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SocketIO;
using System;

public class SocketClient : MonoBehaviour
{

    SocketIOComponent socket;
    public ShapeHandle leftHandle;
    public ShapeHandle rightHandle;

    // Start is called before the first frame update
    void Start()
    {
        GameObject go = GameObject.Find("SocketIO");
        socket = go.GetComponent<SocketIOComponent>();
        socket.On("unity_pose_data", (SocketIOEvent e) =>
        {
            List<JSONObject> lanes = e.data["lanes"].list;
            JSONObject personInLane1 = lanes[0]["person"];
            Debug.Log(personInLane1);
            float x, y;
            x = personInLane1["left_hand"]["x"].f.Remap(0, 1, -8.7f, -4.5f);
            y = personInLane1["left_hand"]["y"].f.Remap(0, 1, -4.7f, 4.7f);
            leftHandle.SetHandPosition(new Vector3(x, y, 0));

            x = personInLane1["right_hand"]["x"].f.Remap(0, 1, -8.7f, -4.5f);
            y = personInLane1["right_hand"]["y"].f.Remap(0, 1, -4.7f, 4.7f);
            rightHandle.SetHandPosition(new Vector3(x, y, 0));
        });
    }
}