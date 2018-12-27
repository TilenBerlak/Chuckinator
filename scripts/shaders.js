
///
// Vertex shader
///
var vertexShaderSource = 
`
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main()
{
    vTextureCoord = aTextureCoord;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}

`;

///
// Fragment shader
///
var fragmentShaderSource = 
`
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main()
{
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
}

`;

function initializeShaders()
{
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

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

    SHADER_PROGRAM.aVertexPositionLocation = gl.getAttribLocation(SHADER_PROGRAM, "aVertexPosition");
    SHADER_PROGRAM.aTextureCoordLocation = gl.getAttribLocation(SHADER_PROGRAM, "aTextureCoord");

    gl.enableVertexAttribArray(SHADER_PROGRAM.aVertexPositionLocation);
    gl.enableVertexAttribArray(SHADER_PROGRAM.aTextureCoordLocation);

    SHADER_PROGRAM.uModelViewMatrixLocation = gl.getUniformLocation(SHADER_PROGRAM, "uModelViewMatrix");
    SHADER_PROGRAM.uProjectionMatrixLocation = gl.getUniformLocation(SHADER_PROGRAM, "uProjectionMatrix");

    SHADER_PROGRAM.samplerUniform = gl.getUniformLocation(SHADER_PROGRAM, "uSampler");
}

function setMatrixUniforms(modelViewMatrix, projectionMatrix)
{
    gl.uniformMatrix4fv(SHADER_PROGRAM.uModelViewMatrixLocation, gl.FALSE, modelViewMatrix);
	gl.uniformMatrix4fv(SHADER_PROGRAM.uProjectionMatrixLocation, gl.FALSE, projectionMatrix);
}