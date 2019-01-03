///
// Global variables
///
var canvas = document.getElementById("glcanvas");
var gl = initializeWebGL(canvas);
var SHADER_PROGRAM;
var texturesLoaded = false;

// Matrices
var modelViewMatrixStack = [];
var modelViewMatrix = new Float32Array(16);
var projectionMatrix = new Float32Array(16);

// Loading models
var modelList = {};

// Camera
var objCamera = null; //initialized in main

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
// Loading models from JSON files.

function initializeResources()
{
	var assets = ["hangar", "hangarfloor", "handgun"];

	for(var i=0, loadedAssets = assets.length; i<assets.length; i++) {
		var asset = assets[i];
		loadJSONResource(asset, "./assets/" + asset + ".json", function (modelErr, modelObj, name) {
			if(modelErr) {
				alert("Fatal error getting " + name + "model!");
			} else {
				modelList[name] = modelObj;
				if(--loadedAssets === 0) {
					//when all assets have been loaded start the game
					try {
						main();
					} catch (e) {
						console.error("Fatal error ", e);
						alert("Error in game!");
					}
				}
			}
		});
	}
}

// Initialize WebGL or experimental WebGL
function initializeWebGL(canvas)
{
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
    if(!gl)
    {
        alert("Error! Your browser may not support WebGL.");
    }
    return gl;
}

// This function is called every frame.
function drawScene(objCamera, buffers)
{

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clearColor(0.53, 0.81, 0.8, 0.98);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	glMatrix.mat4.perspective(projectionMatrix, 45 * (Math.PI / 180), gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	glMatrix.mat4.identity(modelViewMatrix);

	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-objCamera.pitch), [1, 0, 0]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-objCamera.yaw), [0, 1, 0]);
	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [-objCamera.xPosition, -objCamera.yPosition, -objCamera.zPosition]);

	//////////////////////////
	// Box crates
	///

	drawBox(buffers, 0, 0.1, 0, 50);

	drawBox(buffers, 0, 2.1, 0, 37);

	drawBox(buffers, 3, 0.1, -2, 0);


	//////////////////////////
	// Handgun
	///
	// drawGun(buffers, 1, 0.1, 0, 50);

	/////////////////////////
	// Hangar model

	modelViewPushMatrix();

	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0, 31, 200]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [1, 0, 0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarTexCoordsVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aTextureCoordLocation,	// Attribute to send the buffer data to
		2,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		2 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);
	gl.bindTexture(gl.TEXTURE_2D, concreteTexture);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.hangarIndexBuffer);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
	gl.drawElements(gl.TRIANGLES, buffers.hangarIndeciesLength, gl.UNSIGNED_SHORT, 0);

	modelViewPopMatrix();
	////////////////////////////////////////

	/////////////////
	// Hangar floor model

	modelViewPushMatrix();

	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1, 60]);
	glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, [140, 0.1, 150]);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarfloorVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarfloorTexCoordsVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aTextureCoordLocation,	// Attribute to send the buffer data to
		2,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		2 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);
	gl.bindTexture(gl.TEXTURE_2D, metalTexture);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.hangarfloorIndexBuffer);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
	gl.drawElements(gl.TRIANGLES, buffers.hangarfloorIndeciesLength, gl.UNSIGNED_SHORT, 0);

	modelViewPopMatrix();
	////////////////////////////////////////

}


/*************************/
/********* EVENTS ********/
/*************************/
function mouseDown(event) {
	console.log("mouse down");
	// if canvas is not locking mouse pointer we lock it otherwise we trigger mouse down action
	// noinspection JSUnresolvedVariable
	if(document.pointerLockElement === canvas) {
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
	if(document.pointerLockElement === canvas) {
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
function main()
{

    if(gl)
    {
		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW);
		gl.cullFace(gl.BACK);
	}

	initializeShaders();

	var buffers = initilizeBuffers();

	initTextures();

	// var objCamera = new camera();
	objCamera = new camera();

	document.onkeydown = function (event) { objCamera.handleKeyDown(event) };
	document.onkeyup = function (event) { objCamera.handleKeyUp(event) };
	canvas.onmousedown = mouseDown.bind(this);
	document.addEventListener('pointerlockchange', pointerLockChange.bind(this), false);


	setInterval(function()
	{
		if(true)
		{
			requestAnimationFrame(function(){objCamera.animate()});
			objCamera.handleKeys();
			drawScene(objCamera, buffers);
		}

	}, 15);
}