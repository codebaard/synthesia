using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TrackHover : MonoBehaviour
{

    public Material NormalMaterial;
    public Material HoverMaterial;

    // Start is called before the first frame update
    void Start()
    {
        Unhover();
    }

    public void Hover() {
        GetComponent<Image>().material = HoverMaterial;
    }
    public void Unhover() {
        GetComponent<Image>().material = NormalMaterial;
    }

}
