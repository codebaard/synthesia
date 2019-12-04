using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Lane : MonoBehaviour
{
    public GameObject Effects;
    public GameObject BlackOverlay;

    // Start is called before the first frame update
    void Start()
    {
        BlackOverlay.SetActive(false);
        Effects.SetActive(true);
    }

    public void Deactivate() {
        BlackOverlay.SetActive(true);
        Effects.SetActive(false);
    }

    public void Activate() {
        BlackOverlay.SetActive(false);
        Effects.SetActive(true);
    }
}
