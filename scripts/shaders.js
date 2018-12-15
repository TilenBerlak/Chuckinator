
//
// Vertex shader
//
var vertexShaderSource = 
`

void main()
{
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}

`;

//
// Fragment shader
//
var fragmentShaderSource = 
`

void main()
{
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}

`;

function initializeShaders()
{
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSrouce);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) 
    {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) 
    {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
    }

    SHADER_PROGRAM = gl.createProgram();
    gl.attachShader(SHADER_PROGRAM, vertexShader);
    gl.attachShader(SHADER_PROGRAM, fragmentShader);

    gl.linkProgram(SHADER_PROGRAM);
    if (!gl.getProgramParameter(SHADER_PROGRAM, gl.LINK_STATUS)) 
    {
        console.error('ERROR linking SHADER_PROGRAM!', gl.getProgramInfoLog(SHADER_PROGRAM));
    }

    ///
    // Don't include this in the final release
    ///---------------------------------------------------------------

    gl.validateProgram(SHADER_PROGRAM);
    if (!gl.getProgramParameter(SHADER_PROGRAM, gl.VALIDATE_STATUS)) 
    {
		console.error('ERROR validating SHADER_PROGRAM!', gl.getProgramInfoLog(SHADER_PROGRAM));
		return;
    }

    ///--------------------------------------------------------------
    //
    ///

    gl.useProgram(SHADER_PROGRAM);

}