using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BarIndicator : MonoBehaviour
{

    public float MaxBar = 16;

    private Image image;
    private float goalPercentage = 1.0f;
    private float lastBar = 10;

    private float lastTime;
    private float delta = 0.1f;

    // Start is called before the first frame update
    void Start()
    {
        lastTime = Time.time;
        image = GetComponent<Image>();
    }

    public void setBar(float bar) {
        float percentage = bar / MaxBar;
        if (lastBar != bar) {
            delta = Time.time - lastTime;
            lastTime = Time.time;
            image.fillAmount = percentage;
            Debug.Log(delta);
        }
        goalPercentage = (bar + 1) / MaxBar;
        lastBar = bar;
    }

    // Update is called once per frame
    void Update()
    {
        image.fillAmount = Mathf.Lerp(image.fillAmount, goalPercentage, delta / 8);
    }
}
