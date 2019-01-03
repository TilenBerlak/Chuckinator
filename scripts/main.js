///
// Global variables
///
var canvas = document.getElementById("glcanvas");
var gl = initializeWebGL(canvas);
var SHADER_PROGRAM;
var texturesLoaded = false;
var lighting = true;


// Matrices
var modelViewMatrixStack = [];
var modelViewMatrix = new Float32Array(16);
var projectionMatrix = new Float32Array(16);

// Loading models
var modelList = {};

///
//
///

///////////////////
// Loading models from JSON files.

function initializeResources()
{
	loadJSONResource("./assets/hangar.json", function(modelErr, modelObj)
	{
		console.log(modelObj);
		if(modelErr)
		{
			alert("Fatal error getting hangar model.");
		}
		else
		{
			modelList["hangar"] = modelObj;
			loadJSONResource("./assets/hangarfloor.json", function(modelErr, modelObj)
			{
				console.log(modelObj);
				if(modelErr)
				{
					alert("Fatal error getting hangarfloor model.");
				}
				else
				{
					modelList["hangarfloor"] = modelObj;
					loadJSONResource("./assets/gun.json", function(modelErr, modelObj)
					{
						console.log(modelObj);
						if(modelErr)
						{
							alert("Fatal error getting gun model.");
						}
						else
						{

							modelList["gun"] = modelObj;
							main();
						}
					});
					
					
				}
			});
		}

	});
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
	
	useLighting();
	
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

	
	/////////////////////////
	// Hangar model

	drawHangar(buffers);

	/////////////////
	// Hangar floor model

	drawHangarFloor(buffers);

	////////////////////////////////////////

	drawGun(buffers, objCamera);
	
}

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

	var objCamera = new camera();

	document.onkeydown = function (event) { objCamera.handleKeyDown(event) };
	document.onkeyup = function (event) { objCamera.handleKeyUp(event) };

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