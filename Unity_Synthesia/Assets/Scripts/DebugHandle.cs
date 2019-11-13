using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DebugHandle : MonoBehaviour
{

    private ShapeHandle _shapeHandle;

    // Start is called before the first frame update
    void Start()
    {
        _shapeHandle = GetComponentInParent<ShapeHandle>();
    }

    // Update is called once per frame
    void Update()
    {
        _shapeHandle.SetHandPosition(transform.position);
    }

    void OnDrawGizmos() {
        Gizmos.DrawWireSphere(transform.position, 1f);
    }
}
