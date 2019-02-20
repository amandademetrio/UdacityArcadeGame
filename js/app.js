// Enemies our player must avoid
var Enemy = function(position) {
    this.sprite = 'images/enemy-bug.png';
    //enemies step size for right and left moving
    this.jump = 75;
    this.step = 101;
    this.x = 0;
    this.y = position * this.jump;
    //randomly generate a speed for each enemy
    this.speed = Math.floor(Math.random() * 5) + 1;
};

Enemy.prototype.update = function(dt) {
    //if the enemy has reached the end of the board, reset x position and change speed for next loop
    if (this.x >= 505) {
        this.x = 0;
        //new speed after enemy finishes cycle
        this.speed = Math.floor(Math.random() * 5) + 1;
    }
    else {
        //if there's still space to move, move enemy according to enemy's speed
        this.x += this.step * (dt * this.speed);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    //sizes of jumps and steps for the player, matching step size of enemy
    this.jump = 75;
    this.step = 101;
    this.y = this.jump * 5;
    this.x = this.step * 2;
    this.victory = false;
}

//checking for a collision or a win
Player.prototype.update = function(dt) {
    //check for collision
    this.checkForCollision();
    //check for win
    this.checkForWin();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(code) {
    //checking which keyCode the user pressed and moving if boundaries allow it to move
    switch(code) {
        case "up":
            if (this.y >= this.jump) {
                this.y -= this.jump
            }
            break;
        case "down":
            if (this.y <= this.jump * 4) {
                this.y += this.jump
            }
            break;
        case "left":
            if (this.x >= this.step) {
                this.x -= this.step
            }
            break;
        case "right":
            if (this.x <= this.step * 3) {
                this.x += this.step
            }
    }
}

//checks for collision, resets the user position if it detects one
Player.prototype.checkForCollision = function() {
    //looping through the enemies positions
     for (enemy of allEnemies) {
        //first checking for a row match, then comparing x positions
        if (this.y == enemy.y && (enemy.x + enemy.step/2 > this.x && enemy.x < this.x + this.step/2)) {
            //reseting the position, if there was a collision
            this.resetPosition("wait")
        }
    }
}

Player.prototype.checkForWin = function() {
    if (this.y == 0) {
        this.victory = true;
    }
}

Player.prototype.resetPosition = function(wait) {
    if (wait == "wait") {
        //reassigning self
        let self = this;
        //after collision or win, wait half a second and resets the user position
        window.setTimeout(function() {
        self.y = self.jump * 5;
        self.x = self.step * 2;
        },300) 
    }
    else {
        this.y = this.jump * 5;
        this.x = this.step * 2;
    }
}

//creating the player
let player = new Player();

//creating the enemies
let enemy1 = new Enemy(1);
let enemy2 = new Enemy(2);
let enemy3 = new Enemy(3);

let allEnemies = [enemy1,enemy2,enemy3]

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});