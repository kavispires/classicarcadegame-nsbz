/**
* @description Class Game that holds all basic info about the game.
*/
var Game = function() {
    this.pause = false;
    // Units
    this.xUnit = 101;
    this.yUnit = 83;
    this.screenLimit = [505, 606];
    //Player
    this.level = 1;
    this.lives = 3;
    this.score = 0;
    this.player = ['images/char-pat.png', 'images/char-bri.png','images/char-pat2.png', 'images/char-bri2.png','images/char-pat3.png', 'images/char-bri3.png'];
    this. selectedCharacter = 0;
    // Sounds
    this.sfx = true;
    this.music = true;
    // Hazards object data
    this.hazards = [{
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
    this.items = [{
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
    this.itemGrid = [[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3]];
    // Guards positions follows a pattern so the game is always 'completable'
    this.guardpositions = [[12],[6,8],[0,4],[7],[5,9],[11,13],[2],[1,3],[10,14],[2,12],[7,11,13],[0,10],[5,2,9],[4,14],[5,9,12],[1,11],[0,12,10],[3,13],[0,4,11,13],[0,4,10,14],[0,2,4,12],[10,12,14,13],[10,11,13,14],[0,2,4,11,13],[0,1,3,4],[10,1,12,3,14],[0,1,3,4,5,9],[0,1,3,4,5,9,10,12,14],[0,1,2,4,5,9,10,12,13,14]];
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
* @description Randomizes Hazard type on a 1/100 chance plus game.level. Making higher levels return faster enemies
* @returns {number} Random Number from 0 to 2
*/
Game.prototype.randomType = function() {
    // Assign Random Hazard Type
    var chance = Math.floor(Math.random() * 100) + 1;
    chance += game.level * 2;
    if(chance > 0 && chance <= 50){ // 50% of slow enemy
        console.log(chance+'% of love. Fan throws sharpy love letter.');
        return 0;
    } else if (chance >= 51 && chance <= 90){ // 30% chance of faster enemy
        console.log(chance+'% of evil. Fan throws smelly panties.');
        return 1;
    } else { // 20% of fastest enemy
        console.log(chance+'% of evil. Jealous boyfriend throws empty bottle.');
        return 2;
    }
};

/**
* @description Play/Pause main song in the index page
*/
Game.prototype.mute = function(){
    var song = document.getElementById('music');
    return game.music ? song.play() : song.pause();
};

/**
* @description Adds CDs based on level number
*/
Game.prototype.addCD = function(){
    if (game.level <= 5){
        allCDs = [new CD(0)];
    } else if (game.level > 5 && game.level <= 10){
        allCDs = [new CD(0), new CD(1)];
    } else if (game.level > 10 && game.level <= 30){
        allCDs = [new CD(0), new CD(1), new CD(2)];
    } else if (game.level > 30 && game.level <= 40){
        allCDs = [new CD(0), new CD(1), new CD(2), new CD(3)];
    } else {
        allCDs = [new CD(0), new CD(1), new CD(2), new CD(3), new CD(4)];
    }
};

/**
* @description Removes cds from their arrays that keeps track of them, and from allCDs. Adds 10 points to score per cd collected.
*/
Game.prototype.removeCD = function(index,pos){
    // Remove from cdGrid and usedGrid
    var r = game.cdGrid.indexOf(pos);
    game.cdGrid.splice(r, 1);
    r = game.usedGrid.indexOf(pos);
    game.usedGrid.splice(r, 1);
    // Remove CD from allCDs
    allCDs.splice(index, 1);
    // add 10 points to game.score
    game.score += 10;
};

/**
* @description Adds Guards to the game based on level number.
*/
Game.prototype.addGuard = function() {
    // Remove all guards
    allGuards = [];
    // Clear usedGrid
    game.usedGrid = [];
    // If Level less than 30, get array of guard positions
    var pattern;
    if (game.level === 1) {
    // Do nothing
    } else if (game.level <= 30 && game.level > 1){
        pattern = game.guardpositions[game.level-2];
    // Else, get random array
    } else {
        pattern = game.guardpositions[game.randomNumber(30) - 1];
    }
    // Add Guards
    if (pattern !== undefined){ // This if line prevents error when game is reset
        for (var a = 0; a <= pattern.length - 1; a++){
        //Get Element in itemGrid
        var gridpos = game.itemGrid[pattern[a]];
        allGuards.push(new Guard(gridpos[0],gridpos[1]));
        console.log('Guard added');
        // Add Patter elements to usedGrid
        game.usedGrid.push(pattern[a]);
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
    game.pause = false;
};

/**
* @description Randomizes Number in a range
*/
Game.prototype.switchCharacter = function(){
    player.sprite = game.player[game.randomNumber(6) - 1];
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
* @description Class CD for the collectable items on screen (cds)
*/
var CD = function(type) {
    this.type = type;
    if(type === undefined){
        this.type = 0;
    }
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
    this.x = game.itemGrid[this.pos][0] * game.xUnit;
    this.y = game.itemGrid[this.pos][1] * game.yUnit;
    // Assign Sprite
    this.sprite = game.items[this.type].sprite;
};

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
* @description Renders CDs on screen.
*/
CD.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Class for Guards (elements that blocks the player in the game grid)
* @param {number} x - his x position in the grid
* @param {number} y - his y position in the grid
*/
var Guard = function(x,y) {
    this.x = x * game.xUnit;
    this.y = y * game.yUnit;
    // Assign Sprite
    this.sprite = 'images/char-security.png';
};

/**
* @description Prevents player from crossing over a Guard
*/
Guard.prototype.update = function() {
    // Block detection
    if (player.y === this.y && player.x === this.x){
        if(player.direction == 'up'){
            player.y += 83;
        } else if(player.direction == 'right'){
            player.x -= 101;
        } else if(player.direction == 'down'){
            player.y -= 83;
        } else if(player.direction == 'left'){
            player.x += 101;
        }
    }
};

/**
* @description Renders Guards on screen.
*/
Guard.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Class for Hazards on screen (love letters, panties and bottles)
*/
var Hazard = function() {
    // Assign Hazard Type
    this.type = game.randomType();
    // Assign Starting Position
    this.x = game.xUnit * game.randomNumber(3) * -1; // X position Off-Screen
    this.y = game.yUnit * game.randomRange(1, 4);
    // Assign Speed
    this.speed = game.hazards[this.type].speed;
    // Assign Sprite
    this.sprite = game.hazards[this.type].sprite;
};

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
    if (this.x > game.screenLimit[0]) {
        // Reassign a random Row
        this.y = game.yUnit * game.randomRange(1, 4);
        // Reassign X position depending on type (so faster animals would take longer to reappear)
        var i;
        switch(this.type){
            case 0:
                i = 3;
                break;
            case 1:
                i = 5;
                break;
            case 2:
                i = 7;
        }
    this.x = game.xUnit * game.randomNumber(i) * -2;
    }

    // Collision Detection
    var playerX = player.x + 50.5;
    var playerY = player.y + 85.5;
    if (playerY >= (this.y + 50) && playerY <= (this.y + 130) && playerX >= this.x + 11 && playerX <= (this.x + 90)) {
        player.resetPosition('damage');
    }
};

/**
* @description Renders Hazard on screen
*/
Hazard.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Class for Player
*/
var Player = function() {
    // Type
    this.type = 0;
    // Player Starting Position
    this.player_start_x = game.xUnit * 2;
    this.player_start_y = game.yUnit * 5;
    // Player Movement Increments
    this.player_move_x = game.xUnit;
    this.player_move_y = game.yUnit;
    // Player Screen Limit
    this.player_limit_top = game.yUnit * 1;
    this.player_limit_right = game.xUnit * 4;
    this.player_limit_bottom = game.yUnit * 5;
    this.player_limit_left = 0;
    // Player Position
    this.x = this.player_start_x;
    this.y = this.player_start_y;
    // Player Sprite
    this.sprite = game.player[game.randomNumber(6) - 1];
    // Play Direction
    this.direction = null;
};

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
    switch (val) {
        case 'levelup':
            game.level++;
            game.score += 50;
            $('.helper').text('You reached the Stage! Level up!');
            game.addGuard();
            game.addCD();
            // If sfx is on, play sound
            if(game.sfx === true) {
                var m = document.getElementById('sfx-levelup');
                m.play();
                m.loop = false;
            }
            // If level 10, 20, 30... give one life
            if(game.level % 10 === 0 && game.lives < 3){
                game.lives++;
                $('.helper').text("You reached the Stage! Here's an extra heart.");
            }
            setTimeout(function(){
                $('.helper').text('Go!');
            }, 1500);
            break;
        case 'damage':
            game.lives--;
            game.score -= 25;
            console.log('Damage!');
            $('.helper').text('You took damage.');
            // If sfx is on, play sound
            if(game.sfx === true) {
                var n = document.getElementById('sfx-damage');
                n.play();
                n.loop = false;
            }
    }
    // When player runs out of lives
    if (game.lives <= 0) {
        console.log('GAME OVER');
        $('.helper').text('Game Over. High Score: '+ game.score);
        // Open modal
        $('#modal-gameover').modal('show');
        // Write High Score
        $('#highscore').text(game.score);
        // Reset Everything
        game.level = 0;
        game.lives = 3;
        game.score = 0;
        game.collectedCds = [];
        game.usedGrid = [];
        game.cdGrid= [];
        // Remove all hazards, and create one new enemy
        allHazards = [new Hazard()];
        // Remove all cds, then create one new cd
        allCDs = [new CD()];
        // Remove all guards
        allGuards = [];
        // Assign a different skin/sprite
        this.sprite = game.player[game.randomNumber(6) - 1];
    }
};

/**
* @description Renders Player on screen.
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        18: 'p',
        77: 'm',
        70: 'f'
    };

    // Toggle Music
    if (e.keyCode === 77) {
        game.music = !game.music;
        game.mute();
    }

    //Pause Game
    if (e.keyCode === 32 || e.keyCode === 18) {
        game.pause = !game.pause;
        $('#modal-pause').modal('toggle');
    }

    if (game.pause === false) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

// Pauses the Game and Start Modal
game.pause = true;
$('#modal-start').modal('show');

// When Music icon is pressed, toggles music
$('.music-icon').on('click', function(){
    // Toggle Music and Sfx
    game.music = !game.music;
    game.sfx = !game.sfx;
    game.mute();
    //Change icon
    $(this).toggleClass('glyphicon-volume-up');
    $(this).toggleClass('glyphicon-volume-off');
});

//Close modal and start game
$('#start-game').on('click', function(){
    game.startModal();
});

$('#restart-game').on('click', function(){
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
$('#other-character').on('click', function(){
    game.switchCharacter();
});