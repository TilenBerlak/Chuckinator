/////
// Camera class to handle movement around the scene.

class camera
{
    constructor()
    {
        this.pitch = 0;
        this.pitchRate = 0;
        this.yaw = 180;
        this.yawRate = 180;
        this.xPosition = 0;
        this.yPosition = 1;
        this.zPosition = -7;
        this.xPositionGun = 0;
        this.speed = 0;
        this.maxSpeed = 0.012;
        this.lastTime = 0;
        this.currentlyPressedKeys = {};
    }

    animate()
    {
        var timeNow = new Date().getTime();
        if(this.lastTime !== 0)
        {
            var elapsed = timeNow - this.lastTime;

            if(this.speed !== 0)
            {
                this.xPosition -= Math.sin(degToRad(this.yaw)) * this.speed * elapsed;
                this.zPosition -= Math.cos(degToRad(this.yaw)) * this.speed * elapsed;

            }

            this.yaw += this.yawRate * elapsed;          
            this.pitch += this.pitchRate * elapsed;
        }
        this.lastTime = timeNow;

    }

    handleKeys()
    {
        if(this.currentlyPressedKeys[65])
        {
            this.yawRate = 0.1;
        }
        else if(this.currentlyPressedKeys[68])
        {
            this.yawRate = -0.1;
        }
        else
        {
            this.yawRate = 0;
        }

        if(this.currentlyPressedKeys[87])
        {
            this.speed = this.maxSpeed;
        }
        else if(this.currentlyPressedKeys[83])
        {
            this.speed = -this.maxSpeed;
        }
        else
        {
            this.speed = 0;
        }
    }

    handleKeyDown(event)
    {
	    this.currentlyPressedKeys[event.keyCode] = true;
    }

    handleKeyUp(event)
    {
        this.currentlyPressedKeys[event.keyCode] = false;
    }

}