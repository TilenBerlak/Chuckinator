//////////////
// Each function will draw an object. Call it more and u get more objects

function drawBox(buffers, x, y, z, angle)
{
    modelViewPushMatrix();

    glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [x, y, z]);
	glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(angle), [0, 1, 0]);
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

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.boxIndexBufferObject);
	setMatrixUniforms(modelViewMatrix, projectionMatrix);
    gl.drawElements(gl.TRIANGLES, buffers.boxIndicesLength, gl.UNSIGNED_SHORT, 0);
    
    modelViewPopMatrix();
}