//////
// Loading and handling textures

function initTextures() 
{
    //////
    // Add more textures here

    cubeTexture = gl.createTexture();
    cubeTexture.image = new Image();
    cubeTexture.image.onload = function() 
    {
        handleTextureLoaded(cubeTexture, false);
    }
    cubeTexture.image.src = "./assets/crate.gif";


    concreteTexture = gl.createTexture();
    concreteTexture.image = new Image();
    concreteTexture.image.onload = function() 
    {
        handleTextureLoaded(concreteTexture, false);
    }   
    concreteTexture.image.src = "./assets/concrete.png";

    metalTexture = gl.createTexture();
    metalTexture.image = new Image();
    metalTexture.image.onload = function() 
    {
        handleTextureLoaded(metalTexture, false);
    }   
    metalTexture.image.src = "./assets/metal.png";


    gunTexture = gl.createTexture();
    gunTexture.image = new Image();
    gunTexture.image.onload = function() 
    {
        handleTextureLoaded(gunTexture, true);
    }   
    gunTexture.image.src = "./assets/guntexture.png";
}

function handleTextureLoaded(texture, checkTextures)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
  
    gl.bindTexture(gl.TEXTURE_2D, null);

    if(checkTextures)
        texturesLoaded = true;
}








