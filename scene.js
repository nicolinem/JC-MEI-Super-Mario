

const BUB_STAND_LEFT = 0;
const BUB_STAND_RIGHT = 1;
const BUB_WALK_LEFT = 2;
const BUB_WALK_RIGHT = 3;


// Scene. Updates and draws a single scene of the game.

function Scene()
{
	// Loading spritesheets
	var bub = new Texture("imgs/bub.png");
	var bubble = new Texture("imgs/bubble.png");

	// Prepare Bub sprite & its animations
	this.bubSprite = new Sprite(224, 224, 32, 32, 7, bub);

	this.bubSprite.addAnimation();
	this.bubSprite.addKeyframe(BUB_STAND_LEFT, [0, 0, 32, 32]);

	this.bubSprite.addAnimation();
	this.bubSprite.addKeyframe(BUB_STAND_RIGHT, [32, 0, 32, 32]);

	this.bubSprite.addAnimation();
	this.bubSprite.addKeyframe(BUB_WALK_LEFT, [0, 0, 32, 32]);
	this.bubSprite.addKeyframe(BUB_WALK_LEFT, [0, 32, 32, 32]);
	this.bubSprite.addKeyframe(BUB_WALK_LEFT, [0, 64, 32, 32]);

	this.bubSprite.addAnimation();
	this.bubSprite.addKeyframe(BUB_WALK_RIGHT, [32, 0, 32, 32]);
	this.bubSprite.addKeyframe(BUB_WALK_RIGHT, [32, 32, 32, 32]);
	this.bubSprite.addKeyframe(BUB_WALK_RIGHT, [32, 64, 32, 32]);

	this.bubSprite.setAnimation(BUB_STAND_RIGHT);
	
	// Prepare bubble sprite & its animation
	this.bubbleSprite = new Sprite(400, 160, 32, 32, 3, bubble);

	this.bubbleSprite.addAnimation();
	this.bubbleSprite.addKeyframe(0, [0, 0, 16, 16]);
	this.bubbleSprite.addKeyframe(0, [16, 0, 16, 16]);
	this.bubbleSprite.addKeyframe(0, [32, 0, 16, 16]);
	this.bubbleSprite.addKeyframe(0, [48, 0, 16, 16]);
	
	// Store current time
	this.currentTime = 0
	
	this.speed = 0;
}


var minWalkSpeed = 60;
var walkAccel = 60;
var runAccel = 120;
var releaseDecel = 360;
var maxWalkSpeed = 120;
var maxRunSpeed = 240;


Scene.prototype.moveBub = function(deltaTime)
{
	var accel = 0;
	
	if(keyboard[37] || keyboard[39])
	{
		// Pressing move buttons
		if(keyboard[37] && (this.speed > -minWalkSpeed))
			this.speed = -minWalkSpeed;
		else if(keyboard[39] && (this.speed < minWalkSpeed))
			this.speed = minWalkSpeed;
		// Prepare acceleration according to action (walk or run)
		if(keyboard[16])
		{
			if(keyboard[37])
				accel = -runAccel;
			else
				accel = runAccel;
		}
		else
		{
			if(keyboard[37])
				accel = -walkAccel;
			else
				accel = walkAccel;
		}
	}
	else
	{
		if(this.speed > 0)
			accel = -releaseDecel;
		else if(this.speed < 0)
			accel = releaseDecel;
		else
			accel = 0;
	}
	
	// Move according to current speed
	this.bubSprite.x = this.bubSprite.x + this.speed * deltaTime / 1000.0;

	// Apply acceleration to current speed
	if(keyboard[37] || keyboard[39])
	{
		this.speed = this.speed + accel * deltaTime / 1000.0;

		// Respect maximum speeds
		if(keyboard[16])
		{
			if(Math.abs(this.speed) > maxRunSpeed)
			{
				if(this.speed > 0)
					this.speed = maxRunSpeed;
				else
					this.speed = -maxRunSpeed;
			}
		}
		else
		{
			if(Math.abs(this.speed) > maxWalkSpeed)
			{
				if(this.speed > 0)
					this.speed = maxWalkSpeed;
				else
					this.speed = -maxWalkSpeed;
			}
		}
	}
	else
	{
		// Be careful to stop when current acceleration gets close to zero
		if(this.speed > 0)
		{
			this.speed = this.speed + accel * deltaTime / 1000.0;
			if(this.speed < minWalkSpeed)
				this.speed = 0;
		}
		else if(this.speed < 0)
		{
			this.speed = this.speed + accel * deltaTime / 1000.0;
			if(this.speed > -minWalkSpeed)
				this.speed = 0;
		}
	}

	console.log("Speed = " + this.speed);
	//console.log("Accel = " + accel);
}

Scene.prototype.update = function(deltaTime)
{
	// Keep track of time
	this.currentTime += deltaTime;
	
	// Move Bub sprite
	if(keyboard[37]) // KEY_LEFT
	{
		if(this.bubSprite.currentAnimation != BUB_WALK_LEFT)
			this.bubSprite.setAnimation(BUB_WALK_LEFT);
		//if(this.bubSprite.x >= 2)
			//this.bubSprite.x -= 2;
	}
	else if(keyboard[39]) // KEY_RIGHT
	{
		if(this.bubSprite.currentAnimation != BUB_WALK_RIGHT)
			this.bubSprite.setAnimation(BUB_WALK_RIGHT);
		//if(this.bubSprite.x < 606)
			//this.bubSprite.x += 2;
	}
	else
	{
		if(this.bubSprite.currentAnimation == BUB_WALK_LEFT)
			this.bubSprite.setAnimation(BUB_STAND_LEFT);
		if(this.bubSprite.currentAnimation == BUB_WALK_RIGHT)
			this.bubSprite.setAnimation(BUB_STAND_RIGHT);
	}
	this.moveBub(deltaTime);
	
	// Update sprites
	this.bubSprite.update(deltaTime);
	this.bubbleSprite.update(deltaTime);
}

Scene.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Clear background
	context.fillStyle = "rgb(224, 224, 240)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw bub sprite
	this.bubSprite.draw();
		
	// Draw enemy captured in a bubble sprite
	this.bubbleSprite.draw();
}



