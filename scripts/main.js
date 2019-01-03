///
// Global variables
///
var canvas = document.getElementById("glcanvas");
var gl = initializeWebGL(canvas);
var SHADER_PROGRAM;
var lighting = true;

// Matrices
var modelViewMatrixStack = [];
var modelViewMatrix = new Float32Array(16);
var projectionMatrix = new Float32Array(16);

// Loading models
var modelList = {};
var textureList = {};

// Camera
var objCamera = null; //initialized in main

// Game Objects
var staticGameObjects = [];
var gameObjects = [];

// Game configuration
var gameConfiguration = {
    mouseSpeed: 100, // between 50 and 150
    gravity: 0.005, // gravity for jumping
    jumpFactor: 0.2, // jump factor (press half factor is used, long press up to this factor is used)
    runSpeed: 0.012, //character speed
};
///
//
///

/*************************/
/******** DRAWING ********/
/*************************/
///////////////////
// Loading models from JSON files and textures.
function initializeResources() {
    // initTextures2();
    const assets = [
        {name: "hangar", file: "hangar.json"},
        {name: "floor", file: "hangarfloor.json"},
        {name: "gun", file: "gun.json"},
        {name: "box", file: "box.json"},
    ];

    const textures = [
        {name: "crate", file: "box.png"},
        {name: "concrete", file: "concrete.png"},
        {name: "metal", file: "metal.png"},
        {name: "gun", file: "guntexture.png"},
    ];

    let loaded = assets.length + textures.length;

    const runMain = function () {
        if (--loaded === 0) {
            try {
                main();
            } catch (e) {
                console.error("Fatal error ", e);
                alert("Error in game!");
            }
        }
    };

    for (let i = 0; i < textures.length; i++) {
        let texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            runMain();
        };
        texture.image.src = "./assets/" + textures[i].file;
        textureList[textures[i].name] = texture;
    }

    for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        loadJSONResource(asset.name, "./assets/" + asset.file, function (modelErr, modelObj, name) {
            if (modelErr) {
                alert("Fatal error getting " + name + "model!");
            } else {
                modelList[name] = modelObj;
                runMain();
            }
        });
    }
}

// Initialize WebGL or experimental WebGL
function initializeWebGL(canvas) {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    if (!gl) {
        alert("Error! Your browser may not support WebGL.");
    }
    return gl;
}

// This function is called every frame.
function drawScene(objCamera) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.53, 0.81, 0.8, 0.98);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    glMatrix.mat4.perspective(projectionMatrix, 45 * (Math.PI / 180), gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);

    useLighting();

    glMatrix.mat4.identity(modelViewMatrix);

    objCamera.moveToCamera(glMatrix, modelViewMatrix);

    for (let i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].draw(glMatrix, modelViewMatrix);
    }
    for (let i = 0; i < this.staticGameObjects.length; i++) {
        this.staticGameObjects[i].draw(glMatrix, modelViewMatrix);
    }
}


/*************************/
/********* EVENTS ********/

/*************************/
function mouseDown(event) {
    console.log("mouse down");
    // if canvas is not locking mouse pointer we lock it otherwise we trigger mouse down action
    // noinspection JSUnresolvedVariable
    if (document.pointerLockElement === canvas) {
        alert("shoot");
    } else {
        // lock mouse pointer on canvas
        // noinspection JSUnresolvedFunction
        canvas.requestPointerLock();
    }
}

function mouseMove(event) {
    objCamera.handleMouseMove(event);
}

function pointerLockChange(event) {
    // noinspection JSUnresolvedVariable
    if (document.pointerLockElement === canvas) {
        console.log("lock pointer change to locked");
        window.__mouseMoveEvent = mouseMove.bind(this); //we need to store bound mouse event so we can remove it later
        canvas.addEventListener('mousemove', window.__mouseMoveEvent, false);
    } else {
        console.log("lock pointer change to released");
        canvas.removeEventListener('mousemove', window.__mouseMoveEvent, false);
    }
}


/*************************/
/********** MAIN *********/
/*************************/

// Main function where the functions are called.
function main() {

    if (gl) {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
    }

    initializeShaders();

    objCamera = new Camera([0, 1, -7]);
    let gun = new GunAssetObject(objCamera,[-0.1, -0.8, 3], [0.25, 0.25, 0.25], [0, -98, -90]);

    this.staticGameObjects.push(new HangarAssetObject([0, 31, 200], [1, 1, 1], [-90, 0, 0]));
    this.staticGameObjects.push(new FloorAssetObject([0, -1, 60], [140, 0.1, 150]));

    this.gameObjects.push(gun);
    this.gameObjects.push(new BoxAssetObject([0, 0.1, 15], [1, 1, 1], [0, 50, 0]));
    this.gameObjects.push(new BoxAssetObject([0, 2.1, 15], [1, 1, 1], [0, 37, 0]));
    this.gameObjects.push(new BoxAssetObject([3, 0.1, 16], [1, 1, 1], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([0, 0, 10], [1, 1, 1], [0, 0, 0]));

    document.onkeydown = function (event) {
        objCamera.handleKeyDown(event)
    };
    document.onkeyup = function (event) {
        objCamera.handleKeyUp(event)
    };
    canvas.onmousedown = mouseDown.bind(this);
    document.addEventListener('pointerlockchange', pointerLockChange.bind(this), false);


    setInterval(function () {
        if (true) {
            requestAnimationFrame(function () {
                objCamera.animate()
            });
            objCamera.handleKeys();
            drawScene(objCamera);
        }

    }, 15);
}