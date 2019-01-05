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
var bulletObjects = [];

// Game configuration
var gameConfiguration = {
    mouseSpeed: 100, // between 50 and 150
    gravity: 0.005, // gravity for jumping
    jumpFactor: 0.2, // jump factor (press half factor is used, long press up to this factor is used)
    runSpeed: 0.012, //character speed
    bulletSpeed: 0.09,
    worldBox: {
        minX: -150,
        minY: -2,
        minZ: -100,
        maxX: 140,
        maxY: 50,
        maxZ: 220,
    }
};

// Game variables
var mousePressTime = 0;
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
        {name: "alien", file: "alien.json"},
        {name: "watertank", file: "watertank.json"},
        {name: "warpgate", file: "warpgate.json"},
        {name: "bullet", file: "bullet.json"},
    ];

    const textures = [
        {name: "crate", file: "box.png"},
        {name: "concrete", file: "concrete.png"},
        {name: "metal", file: "metal.png"},
        {name: "gun", file: "guntexture.png"},
        {name: "alien", file: "alientexture.png"},
        {name: "warpgate", file: "warpgatetexture.png"},
        {name: "bullet", file: "guntexture.png"},
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
    for (let i = 0; i < this.bulletObjects.length; i++) {
        this.bulletObjects[i].draw(glMatrix, modelViewMatrix);
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
        mousePressTime = new Date().getTime();
    } else {
        // lock mouse pointer on canvas
        // noinspection JSUnresolvedFunction
        canvas.requestPointerLock();
    }
}
function mouseUp(event) {
    // noinspection JSUnresolvedVariable
    if (document.pointerLockElement === canvas) {
        mousePressTime = 0;
        const cameraPosition = objCamera.position;

        let x = cameraPosition[0];
        let y = cameraPosition[1];
        let z = cameraPosition[2];
        let factor = 0.5;

        x -= Math.sin(degToRad(objCamera.yaw - 90)) * factor;
        z -= Math.cos(degToRad(objCamera.yaw - 90)) * factor;
        y -= factor;

        let damage = Math.max(parseFloat(document.documentElement.style.getPropertyValue('--bullet-size')), 0.1);

        bulletObjects.push(new BulletAssetObject([x, y, z], objCamera.yaw-10, objCamera.pitch, damage));
        document.documentElement.style.setProperty('--bullet-size', '0');
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

function onAssetDeath(event) {
    console.error("ASSET DEATH");
    let asset = event.detail;
    let i, length = gameObjects.length;
    for(i = length - 1; i >= 0; i--) {
        if(gameObjects[i] === asset) {
            gameObjects.splice(i, 1);
            break;
        }
    }
}

function onBulletCollision(source, target) {
    console.warn("shot collided");
    if(source instanceof BulletAssetObject && target instanceof LiveAssetObject) {
        let i, length = bulletObjects.length;
        for(i = length - 1; i >= 0; i--) {
            if(bulletObjects[i] === source) {
                bulletObjects.splice(i, 1);
                break;
            }
        }
        target.hit(source.getDamage());
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

    objCamera = new Camera([110, 1, 28]);
    let gun = new GunAssetObject(objCamera, [-0.1, -0.8, 3], [0.25, 0.25, 0.25], [0, -98, -90]);

    this.staticGameObjects.push(new HangarAssetObject([0, 31, 200], [1, 1, 1], [-90, 0, 0]));
    this.staticGameObjects.push(new FloorAssetObject([0, -1, 60], [140, 0.1, 150]));

    this.staticGameObjects.push(gun);

    // Medium boxes
    this.gameObjects.push(new BoxAssetObject([102, 0.6, 25], [1.5, 1.5, 1.5], [0, 0, 0]));

    // Small boxes
    this.gameObjects.push(new BoxAssetObject([110, 2.1, 4], [1, 1, 1], [0, 37, 0]));
    this.gameObjects.push(new BoxAssetObject([110, 0.1, 4], [1, 1, 1], [0, 0, 0]));

    // Big boxes
    this.gameObjects.push(new BoxAssetObject([96, 3.1, 27], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([50, 3.1, -13], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([29, 3.1, 17], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([-107, 3.1, -16], [4, 4, 4], [0, 0, 0]));
    this.gameObjects.push(new BoxAssetObject([115, 3.1, -12], [4, 4, 4], [0, 0, 0]));

    // Aliens
    this.gameObjects.push(new AlienAssetObject([15, 5, 26], [1, 1, 1], [-90, 0, 90]));

    // Other
    this.gameObjects.push(new WatertankAssetObject([-116, -1, -19], [1, 1, 1], [-90, 0, 90]));
    this.gameObjects.push(new WarpgateAssetObject([-26, 23, 185], [20, 20, 20], [0, 140, 0]));


    document.onkeydown = function (event) {
        objCamera.handleKeyDown(event)
    };
    document.onkeyup = function (event) {
        objCamera.handleKeyUp(event)
    };
    canvas.onmousedown = mouseDown.bind(this);
    canvas.onmouseup = mouseUp.bind(this);
    canvas.addEventListener('death-event', onAssetDeath.bind(this), false);
    document.addEventListener('pointerlockchange', pointerLockChange.bind(this), false);


    setInterval(function () {
        if (true) {
            requestAnimationFrame(function () {
                let x = objCamera.position[0];
                let y = objCamera.position[1];
                let z = objCamera.position[2];

                objCamera.animate();

                let i, j;

                let length = bulletObjects.length;
                for (i = length - 1; i >= 0; i--) {
                    bulletObjects[i].animate();
                    if(bulletObjects[i].checkWorldCollision()) {
                        bulletObjects.splice(i, 1);
                    }
                }

                for (i = 0; i < gameObjects.length; i++) {
                    if (objCamera.checkCollision(gameObjects[i])) {
                        objCamera.position[0] = x;
                        objCamera.position[1] = y;
                        objCamera.position[2] = z;
                        console.log("collision detected " + i);
                    }
                    for (j = 0; j < bulletObjects.length; j++) {
                        if (bulletObjects[j].checkCollision(gameObjects[i])) {
                            onBulletCollision(bulletObjects[j], gameObjects[i]);
                        }
                    }
                }

                if(mousePressTime !== 0) {
                    const duration = new Date().getTime() - mousePressTime;
                    let damage = Math.min(Math.max(duration - 500, 0), 3000); //between 1000 and 5000
                    damage = damage / 3000;

                    document.documentElement.style.setProperty('--bullet-size', damage + '');
                }
            });


            objCamera.handleKeys();
            drawScene(objCamera);
        }

    }, 15);
}