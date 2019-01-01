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
					main();
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
	glMatrix.mat4.identity(modelViewMatrix);

	//glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-pitch), [1, 0, 0]);
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

	modelViewPushMatrix();

	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0, 31, 200]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [1, 0, 0]);
	
	// Vertices
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	// Normals
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarNormalsBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexNormalLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0,
	);
	
	// Textures
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
	//glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-90), [1, 0, 0]);
	glMatrix.mat4.scale(modelViewMatrix, modelViewMatrix, [140, 0.1, 150]);

	// Vertecies
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarfloorVertexBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		3 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	// Normals
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.hangarfloorNormalsBuffer);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexNormalLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0,
	);

	// Textures
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

	useLighting();

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