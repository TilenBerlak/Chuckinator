///
// Global variables
///
var canvas = document.getElementById("glcanvas");
var gl = initializeWebGL(canvas);
var SHADER_PROGRAM;
var texturesLoaded = false;

///
// Temporary global variables
///

// Matrices
var modelViewMatrix = new Float32Array(16);
var projectionMatrix = new Float32Array(16);

// Loading models
var resourceVertexNormalBuffer;
var resourceVertexPositionBuffer;
var resourceVertexIndexBuffer;

///
//
///


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

// Drawing the cube on the screen
function drawScene(objCamera, buffers)
{
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.boxVertexBufferObject);
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aVertexPositionLocation,	// Attribute to send the buffer data to
		3,										// How many values per iteration
		gl.FLOAT,								// buffer data type
		gl.FALSE,								// don't normalize
		5 * Float32Array.BYTES_PER_ELEMENT,		// how many total elements are in iteration
		0										// Offset
	);

	// Setting a texture
	gl.vertexAttribPointer(
		SHADER_PROGRAM.aTextureCoordLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT,
	);
	gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(SHADER_PROGRAM.samplerUniform, 0);

	
	glMatrix.mat4.perspective(projectionMatrix, 45 * (Math.PI / 180), gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);	
	
	glMatrix.mat4.identity(modelViewMatrix);

	//glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-pitch), [1, 0, 0]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-objCamera.yaw), [0, 1, 0]);
	glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [-objCamera.xPosition, -objCamera.yPosition, -objCamera.zPosition]);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.boxIndexBufferObject);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, buffers.boxIndicesLength, gl.UNSIGNED_SHORT, 0);

}


function degToRad(deg)
{
	return deg * Math.PI / 180;
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