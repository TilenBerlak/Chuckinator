
//
// Vertex shader
//
var vertexShaderSource = `

void main()
{
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}

`;

//
// Fragment shader
//
var fragmentShaderSource = `

void main()
{
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}

`;


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

function initializeShaders()
{
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    var shaderProgram = gl.createProgram();
    
}


// Main function where the functions are called.
function main()
{
    const canvas = document.getElementById("glcanvas");
    const gl = initializeWebGL(canvas);
    if(gl)
    {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.EQUAL);
    }




}