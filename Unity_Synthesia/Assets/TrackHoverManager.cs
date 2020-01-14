using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TrackHoverManager : MonoBehaviour
{

    public TrackHover[] tracks;

    public void Start() {
        Hover(1);
    }

    public void Hover(float number) {
        if (tracks.Length > number - 1) {
            for (int i = 0; i < tracks.Length; i++) {
                if (i == number - 1) {
                    tracks[i].Hover();
                } else {
                    tracks[i].Unhover();
                }
            }
        }
    }
}
