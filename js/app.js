'use strict';

/**
* @description Class Game that holds all basic info about the game.
*/
var Game = function() {
    this.pause = true;
    // Units
    this.X_UNIT = 101;
    this.Y_UNIT = 83;
    this.SCREEN_LIMIT = [505, 606];
    //Player
    this.level = 1;
    this.lives = 3;
    this.score = 0;
    this.PLAYER = ['images/char-pat.png', 'images/char-bri.png','images/char-pat2.png', 'images/char-bri2.png','images/char-pat3.png', 'images/char-bri3.png'];
    // Sounds
    this.sfx = true;
    this.music = true;
    // Hazards object data
    this.HAZARDS = [{
        sprite: 'images/hazard-loveletter.png',
        speed: 50.5,
    }, {
        sprite: 'images/hazard-panties.png',
        speed: 101,
    }, {
        sprite: 'images/hazard-bottle.png',
        speed: 303,
    }];
    // CD object data
    this.ITEMS = [{
        sprite: 'images/cd-grey.png',
        points: 5,
    },
    {
        sprite: 'images/cd-green.png',
        points: 10,
    },
    {
        sprite: 'images/cd-gold.png',
        points: 20,
    },
    {
        sprite: 'images/cd-cyan.png',
        points: 25,
    },
    {
        sprite: 'images/cd-red.png',
        points: 30,
    }];
    // Array that keeps track of CD count in level
    this.collectedCds = [];
    // Array that keeps track of elements in the game preventing Guards and Cds to ocupied the same space
    this.usedGrid = [];
    // Array that keeps track only of cds only
    this.cdGrid = [];
    // Array of possible placements for items (cds and guards)
    this.ITEM_GRID = [[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3]];
    // Guards positions follows a pattern so the game is always 'completable'
    this.GUARD_POSITIONS = [[12],[6,8],[0,4],[7],[5,9],[11,13],[2],[1,3],[10,14],[2,12],[7,11,13],[0,10],[5,2,9],[4,14],[5,9,12],[1,11],[0,12,10],[3,13],[0,4,11,13],[0,4,10,14],[0,2,4,12],[10,12,14,13],[10,11,13,14],[0,2,4,11,13],[0,1,3,4],[10,1,12,3,14],[0,1,3,4,5,9],[0,1,3,4,5,9,10,12,14],[0,1,2,4,5,9,10,12,13,14]];
};

/**
* @description Randomizes Number
* @param {number} num
* @returns {number} Random Number from 1 to the number provided
*/
Game.prototype.randomNumber = function(num) {
    return Math.floor(Math.random() * num) + 1;
};

/**
* @description Randomizes Number in a range
* @param {number} start
* @param {number} end
* @returns {number} Random Number in provided range
*/
Game.prototype.randomRange = function(start, end) {
    return Math.floor(Math.random() * (end - start)) + 1;
};

/**
* @description Randomizes Hazard type on a 1/100 chance plus this.level. Making higher levels return faster enemies
* @returns {number} Random Number from 0 to 2
*/
Game.prototype.randomType = function() {
    // Assign Random Hazard Type
    var chance = Math.floor(Math.random() * 100) + 1;
    chance += this.level * 2;
    if (chance <= 50){ // 50% of slow enemy
        console.log(chance+'% of love. Fan throws sharpy love letter.');
        return 0;
    } else if (chance <= 90){ // 30% chance of faster enemy
        console.log(chance+'% of crazy. Fan throws smelly panties.');
        return 1;
    } else { // 20% of fastest enemy
        console.log(chance+'% of evil. Jealous boyfriend throws empty bottle.');
        return 2;
    }
};

/**
* @description Play/Pause main song in the index page
*/
Game.prototype.toggleMusic = function(){
    var song = document.getElementById('music');
    return this.music ? song.play() : song.pause();
};

/**
* @description Adds CDs based on level number
*/
Game.prototype.addCD = function(){
    allCDs = [new CD(0)];
    if (this.level > 5) {
        allCDs.push(new CD(1));
    }
    if ( this.level > 10) {
        allCDs.push(new CD(2));
    }
    if (this.level > 30) {
        allCDs.push(new CD(3));
    }
    if (this.level > 40) {
        allCDs.push(new CD(4));
    }
};

/**
* @description Removes cds from their arrays that keeps track of them, and from allCDs. Adds 10 points to score per cd collected.
*/
Game.prototype.removeCD = function(index, pos){
    // Remove from cdGrid and usedGrid
    var r = this.cdGrid.indexOf(pos);
    this.cdGrid.splice(r, 1);
    r = this.usedGrid.indexOf(pos);
    this.usedGrid.splice(r, 1);
    // Remove CD from allCDs
    allCDs.splice(index, 1);
    // add 10 points to this.score
    this.score += 10;
};

/**
* @description Adds Guards to the game based on level number.
*/
Game.prototype.addGuard = function() {
    // Remove all guards
    allGuards = [];
    // Clear usedGrid
    this.usedGrid = [];
    var pattern;
    // If Level 1, don't add guards, stop function
    if (this.level === 1) {
        return;
    }
    // If Level less than 30, get array of guard positions
    if (this.level <= 30 && this.level > 1){
        pattern = this.GUARD_POSITIONS[this.level-2];
    // Else, get random array
    } else {
        pattern = this.GUARD_POSITIONS[this.randomNumber(30) - 1];
    }
    // Add Guards
    if (pattern){ // This if line prevents error when game is reset
        for (var a = 0; a <= pattern.length - 1; a++){
        //Get Element in ITEM_GRID
        var gridpos = this.ITEM_GRID[pattern[a]];
        allGuards.push(new Guard(gridpos[0],gridpos[1]));
        console.log('Guard added');
        // Add Patter elements to usedGrid
        this.usedGrid.push(pattern[a]);
        }
    }
};

/**
* @description Closes modal window and unpauses game.
*/
Game.prototype.startModal = function(){
    //Hide Modal
    $('.modal').modal('hide');
    //Star Game
    this.pause = false;
};

/**
* @description Randomizes Number in a range
*/
Game.prototype.switchCharacter = function(){
    player.sprite = this.PLAYER[this.randomNumber(6) - 1];
};

/**
* @description When Player completes level, updates level count, score, and sfx;
*/
Game.prototype.levelUp = function(){
    this.level++;
    this.score += 50;
    $('.helper').text('You reached the Stage! Level up!');
    this.addGuard();
    this.addCD();
    // If sfx is on, play sound
    if(this.sfx === true) {
        var m = document.getElementById('sfx-levelup');
        m.play();
        m.loop = false;
    }
    // If level 10, 20, 30... give one life
    if(this.level % 10 === 0 && this.lives < 3){
        this.lives++;
        $('.helper').text("You reached the Stage! Here's an extra heart.");
    }
    setTimeout(function(){
        $('.helper').text('Go!');
    }, 1500);
};

/**
* @description When Player takes damage, updates lives count, score, and sfx;
*/
Game.prototype.damage = function(){
    this.lives--;
    this.score -= 25;
    console.log('Damage!');
    $('.helper').text('You took damage.');
    // If sfx is on, play sound
    if(this.sfx === true) {
        var n = document.getElementById('sfx-damage');
        n.play();
        n.loop = false;
    }
};

/**
* @description When Game Over resets level, lives, score and clear arrays and game items
*/
Game.prototype.gameOver = function(){
    console.log('GAME OVER');
    $('.helper').text('Game Over. High Score: '+ this.score);
    // Open modal
    $('#modal-gameover').modal('show');
    // Write High Score
    $('#highscore').text(game.score);
    // Reset Everything
    this.level = 0;
    this.lives = 3;
    this.score = 0;
    this.collectedCds = [];
    this.usedGrid = [];
    this.cdGrid= [];
    // Remove all hazards, and create one new enemy
    allHazards = [new Hazard()];
    // Remove all cds, then create one new cd
    allCDs = [new CD()];
    // Remove all guards
    allGuards = [];
    // Assign a different skin/sprite
    player.sprite = this.PLAYER[game.randomNumber(6) - 1];
};

/**
* @description Class Stats to keep on-screen track of level and lives
*/
var Stats = function() {
    this.life = 'images/life-on.png';
    this.lifeOff = 'images/life-off.png';
    this.level = game.level;
};

/**
* @description Add Hazards to the game (through allHazards) based on level number in a 37.5% ratio, meaning that it's likely a new enemy will show up every 2 or 3 levels.
*/
Stats.prototype.update = function() {
    var ratio = game.level * 0.375;
    if (ratio > allHazards.length){
        allHazards.push(new Hazard());
    }
};

/**
* @description Writes Stats on screen.
*/
Stats.prototype.render = function() {
    ctx.font = '20px Verdana';
    ctx.fillStyle ='#000';
    ctx.strokeStyle = '#000';
    ctx.textAlign = 'center';

    // Update Level
    ctx.fillText('LEVEL ' + game.level, 252.5, 35);
    ctx.strokeText('LEVEL ' + game.level, 252.5, 35);

    // Update Level
    ctx.fillText(game.score + ' pts', 454.5, 35);
    ctx.strokeText(game.score + ' pts', 454.4, 35);

    // Draw Fuel (Lives) Icons
    ctx.drawImage(Resources.get(this.lifeOff), 10, 0);
    ctx.drawImage(Resources.get(this.lifeOff), 55, 0);
    ctx.drawImage(Resources.get(this.lifeOff), 100, 0);

    // Update Fuel (Lives)
    if (game.lives >= 1) {
        ctx.drawImage(Resources.get(this.life), 10, 0);
    }
    if (game.lives >= 2) {
        ctx.drawImage(Resources.get(this.life), 55, 0);
    }
    if (game.lives >= 3) {
        ctx.drawImage(Resources.get(this.life), 100, 0);
    }
};

/**
* @description Super Class Game Object
*/
var GameObjects = function() {};

/**
* @description Renders sprite on canvas.
*/
GameObjects.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

/**
* @description Class CD for the collectable items on screen (cds)
*/
var CD = function(type) {
    GameObjects.call(this);
    // Assign Type
    this.type = type || 0;
    // Assign CD Position
    // Get random number from 0 to 14
    // Check if number is in usedGrid
    // If true, get a different number
    var contains;
    do {
        this.pos = game.randomNumber(15) - 1;
        contains = game.usedGrid.indexOf(this.pos);
    } while (contains != -1);

    // When false, push it to usedGrid and cdGrid
    // Add to Array that keeps track of elements in the game
    game.usedGrid.push(this.pos);
    // Array that keeps track only of crystals
    game.cdGrid.push(this.pos);
    // Assign X and Y
    this.x = game.ITEM_GRID[this.pos][0] * game.X_UNIT;
    this.y = game.ITEM_GRID[this.pos][1] * game.Y_UNIT;
    // Assign Sprite
    this.sprite = game.ITEMS[this.type].sprite;
};

CD.prototype = Object.create(GameObjects.prototype);
CD.prototype.constructor = CD;

/**
* @description Detects CD collecting by the player and removes it when done.
*/
CD.prototype.update = function() {
    // Collect Detection
    if (player.y === this.y && player.x === this.x){
        allCDs.forEach(function(cd){
            if(this.x === cd.x){
                game.removeCD(allCDs.indexOf(cd),this.pos);
            }
        }.bind(this));
        console.log('CD collected!');
    // If sfx is on, play sound
        if(game.sfx === true) {
            var m = document.getElementById('sfx-cd');
            m.play();
            m.loop = false;
        }
    }
};

/**
* @description Class for Guards (elements that blocks the player in the game grid)
* @param {number} x - his x position in the grid
* @param {number} y - his y position in the grid
*/
var Guard = function(x,y) {
    GameObjects.call(this);
    // Assign Position
    this.x = x * game.X_UNIT;
    this.y = y * game.Y_UNIT;
    // Assign Sprite
    this.sprite = 'images/char-security.png';
};

Guard.prototype = Object.create(GameObjects.prototype);
Guard.prototype.constructor = Guard;

/**
* @description Prevents player from crossing over a Guard
*/
Guard.prototype.update = function() {
    // Block detection
    var directionMapping = {
        up: [0, 1],
        down: [0, -1],
        right: [-1, 0],
        left: [1, 0]
    };
    if (player.y === this.y && player.x === this.x){
        var posDelta = directionMapping[player.direction];
        player.x += posDelta[0] * 101;
        player.y += posDelta[1] * 83;
    }
};

/**
* @description Class for Hazards on screen (love letters, panties and bottles)
*/
var Hazard = function() {
    GameObjects.call(this);
    // Assign Hazard Type
    this.type = game.randomType();
    // Assign Starting Position
    this.x = game.X_UNIT * game.randomNumber(3) * -1; // X position Off-Screen
    this.y = game.Y_UNIT * game.randomRange(1, 4);
    // Assign Speed
    this.speed = game.HAZARDS[this.type].speed;
    // Assign Sprite
    this.sprite = game.HAZARDS[this.type].sprite;
};

Hazard.prototype = Object.create(GameObjects.prototype);
Hazard.prototype.constructor = Hazard;

/**
* @description Updates Hazard position, detects collision with player, and reassign a new row for the enemy to respawn, as well as, when the hazard will show up on screen (by assigning a -x off screen value to it)
* @param {number} dt
*/
Hazard.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    // When Hazard passes screen limit randomize its row,
    // plus randomize its respawn time
    if (this.x > game.SCREEN_LIMIT[0]) {
        // Reassign a random Row
        this.y = game.Y_UNIT * game.randomRange(1, 4);
        // Reassign X position depending on type (so faster animals would take longer to reappear)
        var i = [3, 5, 7][this.type];
        this.x = game.X_UNIT * game.randomNumber(i) * -2;
    }

    // Collision Detection
    var playerX = player.x + 50.5;
    var playerY = player.y + 85.5;
    if (playerY >= (this.y + 50) && playerY <= (this.y + 130) && playerX >= this.x + 11 && playerX <= (this.x + 90)) {
        player.resetPosition('damage');
    }
};

/**
* @description Class for Player
*/
var Player = function() {
    GameObjects.call(this);
    // Type
    this.type = 0;
    // Player Starting Position
    this.player_start_x = game.X_UNIT * 2;
    this.player_start_y = game.Y_UNIT * 5;
    // Player Movement Increments
    this.player_move_x = game.X_UNIT;
    this.player_move_y = game.Y_UNIT;
    // Player Screen Limit
    this.player_limit_top = game.Y_UNIT * 1;
    this.player_limit_right = game.X_UNIT * 4;
    this.player_limit_bottom = game.Y_UNIT * 5;
    this.player_limit_left = 0;
    // Player Position
    this.x = this.player_start_x;
    this.y = this.player_start_y;
    // Player Sprite
    this.sprite = game.PLAYER[game.randomNumber(6) - 1];
    // Play Direction
    this.direction = null;
};

Player.prototype = Object.create(GameObjects.prototype);
Player.prototype.constructor = Player;

/**
* @description Limits player on off-screen movements, and check winning conditions.
*/
Player.prototype.update = function(dt) {
    // Limit player into boundaries
    if (this.x > this.player_limit_right) {
        this.x = this.player_limit_right;
    }
    if (this.y > this.player_limit_bottom) {
        this.y = this.player_limit_bottom;
    }
    if (this.x < this.player_limit_left) {
        this.x = this.player_limit_left;
    }

    // Winning Condition
    // Prevent player from going into the water if he hasn't collect the cds
    if (game.collectedCds.length < allCDs.length){
        if (this.y < this.player_limit_top) {
            this.y = this.player_limit_top;
        }
    } else {
        // Update Helper Bar
        $('.helper').text('All CDs collected! Go to the stage!');
        // If player collected all and reached water, resetPosition and level up
        if (this.y === 0) {
            this.resetPosition('levelup');
        }
    }
};

/**
* @description Resets player position depending if he took damaged or passed the level. Also, it checks for Game Over conditions.
* @param {string} levelup or damage
*/
Player.prototype.resetPosition = function(val) {
    // Reset Position after 0.25s
    this.x = this.player_start_x;
    this.y = this.player_start_y;
    // Update Lives or Levels
    if (val == 'levelup') {
        game.levelUp();
    } else if (val == 'damage') {
        game.damage();
    }
    // When player runs out of lives
    if (game.lives <= 0) {
        game.gameOver();
    }
};

/**
* @description Moves player in canvas
* @param {string} key - key pressed by user
*/
Player.prototype.handleInput = function(key) {
    // Object with direction coordinates
    var direction = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0],
    };
    // Move player
    this.x += direction[key][0] * this.player_move_x;
    this.y += direction[key][1] * this.player_move_y;
    // Update direction
    this.direction = key;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allHazards
// Place the player object in a variable called player
var game = new Game();
var allHazards = [new Hazard()];
var allCDs = [new CD()];
var allGuards = [];
var player = new Player();
var stats = new Stats();

/**
* @description Listens for key presses and sends the keys to your Player.handleInput() method.
* @param {number} e - key pressed by user
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    // Toggle Music
    if (e.keyCode === 77) {
        game.music = !game.music;
        game.toggleMusic();
    }

    // Pause Game
    if (e.keyCode === 32 || e.keyCode === 18) {
        game.pause = !game.pause;
        $('#modal-pause').modal('toggle');
    }

    // Calls handleInput only if game is not paused
    if (!game.pause) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

// Start Modal
$('#modal-start').modal('show');

// When Music icon is pressed, toggles music
$('.music-icon').on('click', function(){
    // Toggle Music and Sfx
    game.music = !game.music;
    game.sfx = !game.sfx;
    game.toggleMusic();
    //Change icon
    $(this).toggleClass('glyphicon-volume-up');
    $(this).toggleClass('glyphicon-volume-off');
});

//Close modal and start game
$('#start-game').on('click',  function(){
    game.startModal();
});

$('#restart-game').on('click',function(){
    game.startModal();
});

//Close modal and start game
$('.modal').on('click', function(){
    game.startModal();
});

// When Switch Character button is pressed
$('#unpause').on('click', function(){
    game.pause = false;
});

// When Switch Character button is pressed
$('#other-character').on('click',function(){
    game.switchCharacter();
});
