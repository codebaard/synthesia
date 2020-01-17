var width = 1920 + 200;
var height = 1080 + 200;

var stage = new Konva.Stage({
    container: 'container',
    width,
    height
});

var backgroundLayer = new Konva.Layer();

var layer = new Konva.Layer({
    width: 1920,
    height: 1080,
});

function CreateLanes() {
    var group = new Konva.Group({
        x: 100,
        y: 100,
    });
    var colors = ["#FF0000", "#00B364", "#005BFF", "#DB0097"];
    for (var i = 0; i < 4; i++) {
        var background = new Konva.Rect({
            width: 1920 / 4.0,
            height: 1080,
            x: i * 1920 / 4.0,
            y: 0,
            fill: colors[i],
            stroke: 'black',
            strokeWidth: 4
        });
        group.add(background);
    }
    return group;
}


function CreateHandle(number, position) {
    var group = new Konva.Group({
        x: position.x,
        y: position.y,
        draggable: true
    });
    var left = new Konva.Group({
        x: 0,
        y: 0,
        draggable: true,
        id: "person" + number + "-left"
    });
    var textL = new Konva.Text({
        fontSize: 46,
        fontFamily: 'Calibri',
        text: number + "L",
        fill: 'black',
        padding: 30
    });
    var circleL = new Konva.Circle({
        width: textL.width(),
        height: textL.height(),
        offsetX: -1 * textL.width() / 2.0,
        offsetY: -1 * textL.height() / 2.0,
        fill: '#ffffff',
        stroke: 'black',
        strokeWidth: 4
    });
    var right = new Konva.Group({
        x: 200,
        y: 200,
        draggable: true,
        id: "person" + number + "-right"
    });
    var textR = new Konva.Text({
        fontSize: 46,
        fontFamily: 'Calibri',
        text: number + "R",
        fill: 'black',
        padding: 30
    });
    var circleR = new Konva.Circle({
        width: textR.width(),
        height: textR.height(),
        offsetX: -1 * textR.width() / 2.0,
        offsetY: -1 * textR.height() / 2.0,
        fill: '#ffffff',
        stroke: 'black',
        strokeWidth: 4
    });

    left.on('dragmove', function () {
        console.log(getCoordinates());
    });
    right.on('dragmove', function () {
        console.log(getCoordinates());
    });

    left.add(circleL).add(textL);
    right.add(circleR).add(textR);
    group.add(left).add(right);
    return group;
}

var background = new Konva.Rect({
    width: stage.width(),
    height: stage.height(),
    x: 0,
    y: 0,
    stroke: 'black',
    strokeWidth: 4
});

var application = new Konva.Rect({
    width: 1920,
    height: 1080,
    x: 100,
    y: 100,
    stroke: 'black',
    strokeWidth: 4
});

layer.add(application);
layer.add(CreateLanes());
for (var i = 0; i < 4; i++) {
    layer.add(CreateHandle(i + 1, { x: i * 1920 / 4.0 + 100, y: 500 }));
}
// add the layer to the stage
backgroundLayer.add(background);
stage.add(backgroundLayer);
stage.add(layer);

function getCoordinates() {
    return {
        captureSize: {
            width: 1920,
            height: 1080,
        },
        persons: [
            {
                left: {
                    x: stage.find('#person1-left')[0].absolutePosition().x - 100,
                    y: stage.find('#person1-left')[0].absolutePosition().y - 100,
                },
                right: {
                    x: stage.find('#person1-right')[0].absolutePosition().x - 100,
                    y: stage.find('#person1-right')[0].absolutePosition().y - 100,
                },
            },
            {
                left: {
                    x: stage.find('#person2-left')[0].absolutePosition().x - 100,
                    y: stage.find('#person2-left')[0].absolutePosition().y - 100,
                },
                right: {
                    x: stage.find('#person2-right')[0].absolutePosition().x - 100,
                    y: stage.find('#person2-right')[0].absolutePosition().y - 100,
                },
            },
            {
                left: {
                    x: stage.find('#person3-left')[0].absolutePosition().x - 100,
                    y: stage.find('#person3-left')[0].absolutePosition().y - 100,
                },
                right: {
                    x: stage.find('#person3-right')[0].absolutePosition().x - 100,
                    y: stage.find('#person3-right')[0].absolutePosition().y - 100,
                },
            },
            {
                left: {
                    x: stage.find('#person4-left')[0].absolutePosition().x - 100,
                    y: stage.find('#person4-left')[0].absolutePosition().y - 100,
                },
                right: {
                    x: stage.find('#person4-right')[0].absolutePosition().x - 100,
                    y: stage.find('#person4-right')[0].absolutePosition().y - 100,
                },
            },
        ]
    }
}

function fitStageIntoParentContainer() {
    var container = document.querySelector('#stage-parent');

    // now we need to fit stage into parent
    var containerWidth = container.offsetWidth;
    // to do this we need to scale the stage
    var scale = containerWidth / width;

    stage.width(width * scale);
    stage.height(height * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
}

fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);