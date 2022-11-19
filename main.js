function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5,
    bounds: false
};

rasters = [
    {name: 'African_Plate', x: 832.2245255940041 ,y:506.8601498963483},
    {name: 'Antarctic_Plate', x: 676.5797321001438 ,y:825.1715037474087}, 
    {name: 'Arabian_Plate', x: 942.8926805932069 ,y:421.64567054696226},
    {name: 'Australia_Chunk', x: 56.576086956521756 ,y:603.4782608695652},
    {name: 'Australian_Plate', x: 1209.6029341412852 ,y:621.9550310955191},
    {name: 'Caribbean_Plate', x: 500.220060596396 ,y:462.5928878966671},
    {name: 'Cocos_Plate', x: 0 ,y: 0},
    {name: 'Eurasian_Plate', x: 988.2666241428801 ,y:304.33742624780734},
    {name: 'Indian_Plate', x: 1048.0274278424495 ,y:443.77930154680274},
    {name: 'Japan_piece', x: 58.79475703324808 ,y:285.09910485933494},
    {name: 'Juan_de_Fuca_Plate', x: 0 ,y: 0},
    {name: 'Nazca_Plate', x: 0 ,y: 0},
    {name: 'North_American_Plate', x: 372.951682347313 ,y:244.57662254823794},
    {name: 'Ocean_piece_left_side', x: 0 ,y: 0},
    {name: 'Ocean_piece_right_side', x: 0 ,y: 0},
    {name: 'Ocean_piece_right_side2', x: 0 ,y: 0},
    {name: 'Pacific_Plate', x: 0 ,y: 0},
    {name: 'Philippine_Plate', x: 0 ,y: 0},
    {name: 'Russia_Sakhalin_corner', x: 1282.643916440759 ,y:241.25657789826175},
    {name: 'Scotia_Plate', x: 0 ,y: 0},
    {name: 'South_American_Plate', x: 584.3278583957901 ,y:592.0746292457344}
]

// Load in the background image.
if (getQueryVariable('hidemap')) {
    console.log("Background map will be hidden.");
    loadRaster('transp-background', 'center')
} else {
    console.log("Background map will be shown.");
    loadRaster('background', 'center')
}

var bgWidth = project.activeLayer.children[0].width;
var bgHeight = project.activeLayer.children[0].height;

var factorWidth = view.viewSize.width / bgWidth;
var factorHeight = view.viewSize.height / bgHeight;
if (factorWidth < factorHeight) {
    view.zoom = factorWidth - .1;
    console.log("Width is constrained: " + view.viewSize.width)
} else {
    view.zoom = factorHeight - .1;
    console.log("Height is constrained: " + view.viewSize.height)
}

var heightDiff = (view.viewSize.height - bgHeight) / 2
var topInnerBound = (heightDiff)
var bottomInnerBound = view.viewSize.height + (heightDiff * -1)

var widthDiff = (view.viewSize.width - bgWidth) / 2
var leftInnerBound = (widthDiff)
var rightInnerBound = view.viewSize.width + (widthDiff * -1)

// var topLeftCorner = new Point(leftInnerBound, topInnerBound)
// var topRightCorner = new Point(rightInnerBound, topInnerBound)
// var bottomRightCorner = new Point(rightInnerBound, bottomInnerBound)
// var bottomLeftCorner = new Point(leftInnerBound, bottomInnerBound)

// var leftPath = new Path();
// leftPath.strokeColor = 'red';
// leftPath.add(topLeftCorner, bottomLeftCorner);

// var rightPath = new Path();
// rightPath.strokeColor = 'blue';
// rightPath.add(topRightCorner, bottomRightCorner);


// var topPath = new Path();
// topPath.strokeColor = 'red';
// topPath.add(topLeftCorner, topRightCorner);

// var bottomPath = new Path();
// bottomPath.strokeColor = 'blue';
// bottomPath.add(bottomLeftCorner, bottomRightCorner);

var randTop = new Point(randomIntFromInterval(rightInnerBound, leftInnerBound), topInnerBound);
var randBottom = new Point(randomIntFromInterval(rightInnerBound, leftInnerBound), bottomInnerBound);
var randLeft = new Point(leftInnerBound, randomIntFromInterval(topInnerBound, bottomInnerBound));
var randRight = new Point(rightInnerBound, randomIntFromInterval(topInnerBound, bottomInnerBound));

// var topCircle = new Path.Circle(randTop, 10);
// topCircle.fillColor = 'red';
// var bottomCircle = new Path.Circle(randBottom, 10);
// bottomCircle.fillColor = 'blue';
// var leftCircle = new Path.Circle(randLeft, 10);
// leftCircle.fillColor = 'red';
// var rightCircle = new Path.Circle(randRight, 10);
// rightCircle.fillColor = 'blue';



// Create a new layer for all the pieces; this layer will be active.
var mainLayer = new Layer();
// Load in the pieces.
for (var i = 0, len = rasters.length; i < len; i++) {
    // loadRaster(rasters[i], 'random');
    // loadRaster(rasters[i].name, 'center');
    loadRaster(rasters[i].name, {x: rasters[i].x, y: rasters[i].y});
}



function loadRaster(imageID, position) {
    // Create a raster item using the image tag with id='mona'
    var image = new Raster(imageID);
    switch (position) {
        case 'center':
            image.position = view.center;
            break;
        case 'random':
            // image.position = new Point(view.viewSize.width, view.viewSize.height) * Point.random();
            image.position = new Point(randomIntFromInterval(leftInnerBound, rightInnerBound), randomIntFromInterval(topInnerBound, bottomInnerBound));
            break;
        case 'randomAroundMap':
            var randomPointList = [
                new Point(randomIntFromInterval(rightInnerBound, leftInnerBound), topInnerBound),
                new Point(randomIntFromInterval(rightInnerBound, leftInnerBound), bottomInnerBound),
                new Point(leftInnerBound, randomIntFromInterval(topInnerBound, bottomInnerBound)),
                new Point(rightInnerBound, randomIntFromInterval(topInnerBound, bottomInnerBound))
            ]

            // image.position = new Point(view.viewSize.width, top) * Point.random();
            image.position = randomPointList[randomIntFromInterval(0, 3)]
            break;
        default:
            image.position.x = position.x;
            image.position.y = position.y;
    }
    return image;
}

function hitTestOpaquePixel(point, options) {
    var itemHitResult = false;
    for (var i = project.activeLayer.children.length - 1; i >= 0; i--) {
        itemHitResult = project.activeLayer.children[i].hitTest(point, options);
        if (!itemHitResult)
            continue;
        if (itemHitResult.type == 'pixel' && itemHitResult.color.alpha == 1) {
            return itemHitResult;
        } else {
            itemHitResult = false;
            continue;
        }
    }
    return itemHitResult;
}

var piece;
var movePiece = false;
function onMouseDown(event) {
    segment = piece = null;
    var hitResult = hitTestOpaquePixel(event.point, hitOptions)
    if (!hitResult)
        return;
    piece = hitResult.item;
    movePiece = true;
    if (movePiece)
        project.activeLayer.addChild(hitResult.item);
}

// function onMouseMove(event) {
//     project.activeLayer.selected = false;
//     if (event.item)
//         event.item.selected = true;
// }

function onMouseDrag(event) {
    if (piece) {
        piece.position += event.delta;
        // console.log(piece);
        console.log("x: "+piece.position.x+" ,y:" + piece.position.y);
    }
}