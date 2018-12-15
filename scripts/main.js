///
// Global variables
///
const canvas = document.getElementById("glcanvas");
const gl = initializeWebGL(canvas);
const SHADER_PROGRAM;


// Initialize WebGL or experimental WebGL
function initializeWebGL(canvas)
{
    var gl = null;
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if(!gl)
    {
        alert("Error! Your browser may not support WebGL.");
    }
    return gl;
}


// Main function where the functions are called.
function main()
{
    
    const gl = initializeWebGL(canvas);
    if(gl)
    {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.EQUAL);
    }

    initializeShaders();

}