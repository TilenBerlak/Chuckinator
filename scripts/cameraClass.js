/////
// Camera class to handle movement around the scene.

class Camera {
    constructor(position = [0, 0, 0]) {
        this.pitch = 0;
        this.pitchRate = 0;
        this.yaw = 60;
        this.yawRate = 0;
        this.joggingAngle = 0;
        this.xPosition = position[0];
        this.yPosition = position[1];
        this.zPosition = position[2];
        this.speed = 0;
        this.direction = 0;
        this.lastTime = 0;
        this.yVelocity = 0;
        this.onGround = true;
        this.currentlyPressedKeys = {};
        // this.gunAsset = gunAsset;
    }

    animate() {
        var timeNow = new Date().getTime();
        if (this.lastTime !== 0) {
            var elapsed = timeNow - this.lastTime;

            if (!this.onGround) {
                this.yVelocity += gameConfiguration.gravity;
                this.yPosition -= this.yVelocity;
                if (this.yPosition < 1) {
                    this.yPosition = 1;
                    this.yVelocity = 0;
                    this.onGround = true;
                }
            }
            if (this.speed !== 0) {
                this.xPosition -= Math.sin(degToRad(this.yaw + this.direction)) * this.speed * elapsed;
                this.zPosition -= Math.cos(degToRad(this.yaw + this.direction)) * this.speed * elapsed;
                if (this.onGround) {
                    this.joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
                    this.yPosition = 1 + Math.sin(degToRad(this.joggingAngle)) / 20 + 0.4
                }
            }

            this.yaw += this.yawRate * elapsed;
            this.pitch += this.pitchRate * elapsed;
            console.log("x: " + this.xPosition + " y: " + this.yPosition + " z: " + this.zPosition);
            //console.log("Y: " + this.yaw + " P: " + this.pitch);
            //reset yaw and pitch rate so it stops when mouse is not moving
            this.yawRate = 0;
            this.pitchRate = 0;

            // this.gunAsset.position = [this.xPosition - 0.1, this.yPosition - 0.8, this.zPosition + 3];
            // this.gunAsset.rotate = [0, this.yaw - 90, this.pitch - 90];

            // let gun = new GunAssetObject([-0.9, 0.2, -4], [0.25, 0.25, 0.25], [0, -98, -90]);
            // objCamera = new Camera([0, 1, -7], gun);
        }
        this.lastTime = timeNow;

    }

    moveToCamera(glMatrix, modelViewMatrix) {
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-this.pitch), [1, 0, 0]);
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, degToRad(-this.yaw), [0, 1, 0]);
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [-this.xPosition, -this.yPosition, -this.zPosition]);
    }

    handleMouseMove(event) {
        this.yawRate = -(event.movementX / gameConfiguration.mouseSpeed);
        this.pitchRate = -(event.movementY / gameConfiguration.mouseSpeed);
    }

    handleKeys() {
        this.speed = 0;
        this.direction = 0;

        if(this.currentlyPressedKeys[79]) {
            gameObjects[0].offset++;
            this.currentlyPressedKeys[79] = false;
        }
        if(this.currentlyPressedKeys[80]) {
            gameObjects[0].offset--;
            this.currentlyPressedKeys[80] = false;
        }

        //dummy way to set direction, could be improved
        if (this.currentlyPressedKeys[87]) {
            // forward
            this.speed = gameConfiguration.runSpeed;

            if (this.currentlyPressedKeys[65] && !this.currentlyPressedKeys[68]) {
                // forward left
                this.direction = 45;
            } else if (this.currentlyPressedKeys[68] && !this.currentlyPressedKeys[65]) {
                // forward right
                this.direction = -45;
            }
        } else if (this.currentlyPressedKeys[83]) {
            // backward
            this.speed = -gameConfiguration.runSpeed;
            if (this.currentlyPressedKeys[65] && !this.currentlyPressedKeys[68]) {
                // backward left
                this.direction = -45;
            }

            if (this.currentlyPressedKeys[68] && !this.currentlyPressedKeys[65]) {
                // backward right
                this.direction = 45;
            }
        } else if (this.currentlyPressedKeys[65] && !this.currentlyPressedKeys[68]) {
            // left
            this.direction = 90;
            this.speed = gameConfiguration.runSpeed;
        } else if (this.currentlyPressedKeys[68] && !this.currentlyPressedKeys[65]) {
            // right
            this.direction = -90;
            this.speed = gameConfiguration.runSpeed;
        }

        if (this.currentlyPressedKeys[37] && !this.currentlyPressedKeys[39]) {
            //left
            this.yawRate = 0.1;
        } else if (this.currentlyPressedKeys[39] && !this.currentlyPressedKeys[37]) {
            //right
            this.yawRate = -0.1;
        }

        if (this.currentlyPressedKeys[38] && !this.currentlyPressedKeys[40]) {
            //up
            this.pitchRate = 0.1;
        } else if (this.currentlyPressedKeys[40] && !this.currentlyPressedKeys[38]) {
            //down
            this.pitchRate = -0.1;
        }

        if (this.currentlyPressedKeys[32]) {
            //jump
            if (this.onGround) {
                this.yVelocity = -gameConfiguration.jumpFactor;
                this.onGround = false;
            }
        } else if (!this.onGround) {
            //end jump
            if (this.yVelocity < -(gameConfiguration.jumpFactor / 2)) {
                this.yVelocity = -(gameConfiguration.jumpFactor / 2);
            }
        }
    }

    handleKeyDown(event) {
        //console.log(event.keyCode);
        this.currentlyPressedKeys[event.keyCode] = true;
    }

    handleKeyUp(event) {
        this.currentlyPressedKeys[event.keyCode] = false;
    }

}