using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public enum ShapeAnchorPostion
{
    BottomLeft,
    BottomRight,
    Center,
    TopRight,
    TopLeft,
}

[System.Serializable]
public class ShapeAnchor
{
    public GameObject Hand;
    public ShapeAnchorPostion position;
}

public class VisualShape : MonoBehaviour
{
    [SerializeField]
    public ShapeAnchor[] anchors;

    public bool changeScale = true;
    public GameObject customTransform = null;
    private ParticleSystem _particle;

    // Start is called before the first frame update
    void Start()
    {
        _particle = GetComponentInChildren<ParticleSystem>();
    }

    // Update is called once per frame
    void Update()
    {
        CalculateParticleTransform();
        CalculateParticleCount();
    }

    void CalculateParticleTransform()
    {
        GameObject leftHand = anchors[0].Hand;
        if (anchors.Length == 2)
        {
            GameObject rightHand = anchors[1].Hand;
            float xPos = leftHand.transform.position.x + (rightHand.transform.position.x - leftHand.transform.position.x) / 2f;
            float yPos = rightHand.transform.position.y + (leftHand.transform.position.y - rightHand.transform.position.y) / 2f;

            if (customTransform == null) {
                _particle.transform.position = new Vector3(xPos, yPos, 0);
            } else {
                customTransform.transform.position = new Vector3(xPos, yPos, 0);
            }

            if (changeScale) {
                float xScale = Mathf.Abs(rightHand.transform.position.x - leftHand.transform.position.x);
                float zScale = Mathf.Abs(leftHand.transform.position.y - rightHand.transform.position.y);
            
                var shape = _particle.shape;
                shape.scale = new Vector3(xScale, 1, zScale);
            }
        } else {
            _particle.transform.position = new Vector3(leftHand.transform.position.x, leftHand.transform.position.y, 0);
        }

    }

    void CalculateParticleCount()
    {
        var shape = _particle.shape;
        float size = shape.scale.x * shape.scale.z;

        var main = _particle.main;
        main.maxParticles = (int)(1000 * size);

        var startLifetime = main.startLifetime;
        startLifetime.constant = size;

        var emission = _particle.emission;
        emission.rateOverTimeMultiplier = Mathf.Max(1f, size * 0.1f) * 50;
    }

}
