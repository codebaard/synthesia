using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SocketIO;
using System;

public class SocketClientBar : MonoBehaviour
{

    SocketIOComponent socket;

    // Start is called before the first frame update
    void Start()
    {
        GameObject go = GameObject.Find("SocketIO");
        socket = go.GetComponent<SocketIOComponent>();
        socket.On("bar", (SocketIOEvent e) =>
        {
            float bar = e.data["bar"].n;
            Debug.Log(bar);
        });
    }
}