using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SocketIO;
using System;

public class SocketClient : MonoBehaviour
{

    SocketIOComponent socket;
    public GameObject Box;

    // Start is called before the first frame update
    void Start()
    {
        GameObject go = GameObject.Find("SocketIO");
        socket = go.GetComponent<SocketIOComponent>();
        socket.On("unity", (SocketIOEvent e) => {
            float value;
            if (float.TryParse(e.data["x"].str, out value)) {
                SetBoxPosition(value.Remap(0,127, -4f, 2.5f));
            }
        });
    }

    private void SetBoxPosition(float yValue) {
        Vector3 newPosition = Box.transform.position;
        newPosition.y = yValue;
        Box.transform.position = newPosition;
    }

}