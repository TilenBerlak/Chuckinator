function useLighting()
{
    gl.uniform1i(SHADER_PROGRAM.uUseLightingLocation, lighting);

    if(lighting)
    {
        gl.uniform3f(
            SHADER_PROGRAM.uAmbientColorLocation,
            0.8,  // R
            0.8,  // G
            0.8,  // B
        );

        var lightingDirection = [ 0.25, -0.05, 1];   // Direction
        var adjustedLD = glMatrix.vec3.create();
        
        glMatrix.vec3.normalize(adjustedLD, lightingDirection);
        
        glMatrix.vec3.scale(adjustedLD, adjustedLD, -1); 
        gl.uniform3fv(
            SHADER_PROGRAM.uLightingDirectionLocation, adjustedLD
            );

        gl.uniform3f(
            SHADER_PROGRAM.uDirectionalColorLocation,
            0.8,
            0.8,
            0.8,
        );

    }

}