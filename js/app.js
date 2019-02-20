const tileWidth = 101,
      tileHeight = 83;

//Main big class with character
let Character = function(sprite) {
    this.sprite = sprite;
}

// Enemies our player must avoid
let Enemy = function(position) {
    Character.call(this,'images/enemy-bug.png');
    this.x = 0;
    this.y = position * tileHeight;
    //randomly generate a speed for each enemy
    this.speed = Math.floor(Math.random() * 5) + 1;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
    //if the enemy has reached the end of the board, reset x position and change speed for next loop
    if (this.x >= 505) {
        this.x = 0;
        //new speed after enemy finishes cycle
        this.speed = Math.floor(Math.random() * 5) + 1;
    }
    else {
        //if there's still space to move, move enemy according to enemy's speed
        this.x += tileWidth * (dt * this.speed);
    }
    this.checkForCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//checks for collision, resets the user position if it detects one
Enemy.prototype.checkForCollision = function() {
    //first checking for a row match, then comparing x positions
    if (player.y == this.y && (this.x + tileWidth/2 > this.x && this.x < player.x + tileWidth/2)) {
        //reseting the position, if there was a collision
        player.resetPosition("wait")
    }
}

let Player = function() {
    Character.call(this,'images/char-cat-girl.png');
    this.y = tileHeight * 5;
    this.x = tileWidth * 2;
    this.victory = false;
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

//checking for a collision or a win
Player.prototype.update = function(dt) {
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
            if (this.y >= tileHeight) {
                this.y -= tileHeight
            }
            break;
        case "down":
            if (this.y <= tileHeight * 4) {
                this.y += tileHeight
            }
            break;
        case "left":
            if (this.x >= tileWidth) {
                this.x -= tileWidth
            }
            break;
        case "right":
            if (this.x <= tileWidth * 3) {
                this.x += tileWidth
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
        self.y = tileHeight * 5;
        self.x = tileWidth * 2;
        },300) 
    }
    else {
        this.y = tileHeight * 5;
        this.x = tileWidth * 2;
    }
}

//creating the player
let player = new Player();

//creating the enemies
let enemy1 = new Enemy(1);
let enemy2 = new Enemy(2);
let enemy3 = new Enemy(3);

const allEnemies = [enemy1,enemy2,enemy3]

document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});