using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BarIndicator : MonoBehaviour
{

    public float MaxBar = 16;

    public float TrackNumber = 1;

    public bool active = false;
    private Color currentColor = new Color(1,1,1,1);
    private Image image;
    private float goalPercentage = 1.0f;
    private float lastBar = 10;

    private float lastTime;
    private float delta = 0.1f;

    private RectTransform rect;

    // Start is called before the first frame update
    void Start()
    {
        lastTime = Time.time;
        image = GetComponent<Image>();
        rect = GetComponent<RectTransform>();
        SetTrack(TrackNumber);
    }

    public void SetTrack(float track) {
        TrackNumber = track;
        rect.anchoredPosition = new Vector2(rect.position.x, -740f + (-450f * (4 - TrackNumber)));
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
        image.color = Color.Lerp(image.color, currentColor, Time.deltaTime * 3);
        if (active) {
            currentColor = new Color(1f,1f,1f,1f);
        } else {
            currentColor = new Color(1f,1f,1f,0f);
        }
    }
}
