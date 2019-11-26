﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShapeHandle : MonoBehaviour
{

    public RectTransform Lane;

    private Vector3 handPosition;

    private SpriteRenderer _handSpriteRenderer;
    private Vector3[] boundaries;
    private Vector3 lastPos;

    private Color currentColor = new Color(1f,1f,1f,1f);

    // Start is called before the first frame update
    void Start()
    {
        boundaries = new Vector3[4];
        Lane.GetWorldCorners(boundaries);
        _handSpriteRenderer = GetComponentInChildren<SpriteRenderer>();
        handPosition = _handSpriteRenderer.transform.position;
    }

    private bool _isPositionInLane(Vector3 position) {
        Vector3 topRight = boundaries[0];
        Vector3 bottomRight = boundaries[1];
        Vector3 bottomLeft = boundaries[2];
        Vector3 topLeft = boundaries[3];

        if (position.y <= bottomLeft.y) {
            return false;
        }

        if (position.y >= topLeft.y) {
            return false;
        }

        if (position.x <= bottomLeft.x) {
            return false;
        }

        if (position.x >= topRight.x) {
            return false;
        }

        return true;
    }

    public void SetHandPosition(Vector3 newHandPosition) {
        if (_isPositionInLane(newHandPosition)) {
            handPosition = newHandPosition;
            currentColor = new Color(1f,1f,1f,1f);
        } else {
            currentColor = new Color(0f,0f,0f,0.2f);
        }
    }

    // Update is called once per frame
    void Update()
    {
        _handSpriteRenderer.material.color = Color.Lerp(_handSpriteRenderer.material.color, currentColor, Time.deltaTime * 3f);
        _handSpriteRenderer.transform.position = Vector3.Lerp(_handSpriteRenderer.transform.position, handPosition, Time.deltaTime * 8f);
    }
}