///
// Global variables
///
var canvas = document.getElementById("glcanvas");
var gl = initializeWebGL(canvas);
var SHADER_PROGRAM;


// Initialize WebGL or experimental WebGL
function initializeWebGL(canvas)
{
    webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if(!webgl)
    {
        alert("Error! Your browser may not support WebGL.");
    }
    return webgl;
}


// Main function where the functions are called.
function main()
{
    if(gl)
    {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.EQUAL);
    }

    initializeShaders();

}