/////
// Vertex, index, textures data for 3d models.


function initilizeBuffers()
{
	var boxVertices = 
	[ // X, Y, Z           U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1,
];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];
		
	var vertexNormals = 
	[
	// Front face
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,

	// Back face
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,

	// Top face
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,

	// Bottom face
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,

	// Right face
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,

	// Left face
	-1.0,  0.0,  0.0,
	-1.0,  0.0,  0.0,
	-1.0,  0.0,  0.0,
	-1.0,  0.0,  0.0
];
	///
	// Box buffers
	///

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


	
	///
	//
	///

	///
	// Hangar buffers
	///

	var hangarVertices = modelList["hangar"].meshes[0].vertices;
	var hangarIndecies = [].concat.apply([], modelList["hangar"].meshes[0].faces);
	var hangarTexCoords = modelList["hangar"].meshes[0].texturecoords[0];
	var hangarNormals = modelList["hangar"].meshes[0].normals;

	var hangarVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hangarVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hangarVertices), gl.STATIC_DRAW);

	var hangarNormalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hangarNormalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hangarNormals), gl.STATIC_DRAW);

	var hangarTexCoordsVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hangarTexCoordsVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hangarTexCoords), gl.STATIC_DRAW);

	var hangarIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hangarIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(hangarIndecies), gl.STATIC_DRAW);

	///
	//
	///

	///
	// Hangar floor buffers
	///

	var hangarfloorVertices = modelList["hangarfloor"].meshes[0].vertices;
	var hangarfloorIndecies = [].concat.apply([], modelList["hangarfloor"].meshes[0].faces);
	var hangarfloorTexCoords = modelList["hangarfloor"].meshes[0].texturecoords[0];
	var hangarfloorNormals = modelList["hangarfloor"].meshes[0].normals;

	var hangarfloorVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hangarfloorVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hangarfloorVertices), gl.STATIC_DRAW);

	var hangarfloorNormalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hangarfloorNormalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hangarfloorNormals), gl.STATIC_DRAW);

	var hangarfloorTexCoordsVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, hangarfloorTexCoordsVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hangarfloorTexCoords), gl.STATIC_DRAW);

	var hangarfloorIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, hangarfloorIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(hangarfloorIndecies), gl.STATIC_DRAW);

	////////////////////////
	// Gun buffers

	var gunVertices = modelList["gun"].meshes[0].vertices;
	var gunIndecies = [].concat.apply([], modelList["gun"].meshes[0].faces);
	var gunTexCoords = modelList["gun"].meshes[0].texturecoords[0];
	var gunNormals = modelList["gun"].meshes[0].normals;

	var gunVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gunVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gunVertices), gl.STATIC_DRAW);

	var gunNormalsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gunNormalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gunNormals), gl.STATIC_DRAW);

	var gunTexCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gunTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gunTexCoords), gl.STATIC_DRAW);

	var gunIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gunIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunIndecies), gl.STATIC_DRAW);
	

	return {
        boxVertexBufferObject:  boxVertexBufferObject,
		boxIndexBufferObject:   boxIndexBufferObject,
		boxIndicesLength:		boxIndices.length,
		boxVertexNormalBuffer:  boxVertexNormalBuffer,

		hangarVertexBuffer:			hangarVertexBuffer,
		hangarTexCoordsVertexBuffer: hangarTexCoordsVertexBuffer,
		hangarIndexBuffer:			hangarIndexBuffer,
		hangarIndeciesLength:		hangarIndecies.length,
		hangarNormalsBuffer:		hangarNormalsBuffer,

		hangarfloorVertexBuffer:		  hangarfloorVertexBuffer,
		hangarfloorTexCoordsVertexBuffer: hangarfloorTexCoordsVertexBuffer,
		hangarfloorIndexBuffer:			  hangarfloorIndexBuffer,
		hangarfloorIndeciesLength:		  hangarfloorIndecies.length,
		hangarfloorNormalsBuffer:		  hangarfloorNormalsBuffer,

		gunVertexBuffer:				gunVertexBuffer,
		gunNormalsBuffer:				gunNormalsBuffer,
		gunTexCoordsBuffer:				gunTexCoordsBuffer,
		gunIndexBuffer:					gunIndexBuffer,
		gunIndeciesLength:				gunIndecies.length,
	}

}
