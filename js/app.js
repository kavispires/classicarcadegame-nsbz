var game = {
    pause: false,
    // Units
    xUnit: 101,
    yUnit: 83,
    screenLimit: [505, 606],
    //Player
    level: 1,
    lives: 3,
    score: 0,
    player: ['images/char-pat.png', 'images/char-bri.png','images/char-pat2.png', 'images/char-bri2.png','images/char-pat3.png', 'images/char-bri3.png'],
    selectedCharacter: 0,
    // Sounds
    sfx: true,
    music: true,
    // play/pause song
    mute: function(){
        var m = document.getElementById("music");
        if (game.music === false) {
          m.pause();
        } else {
          m.play();
        }
    },
    // Other
    hazards: [{
        sprite: 'images/hazard-loveletter.png',
        speed: 50.5,
    }, {
        sprite: 'images/hazard-panties.png',
        speed: 101,
    }, {
        sprite: 'images/hazard-bottle.png',
        speed: 303,
    }],
    cds: [],
    items: [{
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
    }],
    // Array that keeps track of elements in the game
    usedGrid: [],
    // Array that keeps track only of crystals
    cdGrid: [],
    itemGrid: [[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3]],
    randomNumber: function(num) {
        return Math.floor(Math.random() * num) + 1;
    },
    randomRange: function(start, end) {
        return Math.floor(Math.random() * (end - start)) + 1;
    },
    randomType: function() {
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
    },
    addCD: function(){
      // Add CDs based on Level Number
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
    },
    removeCD: function(index,pos){
      // Remove from cdGrid and usedGrid
      var r = game.cdGrid.indexOf(pos);
      game.cdGrid.splice(r, 1);
      r = game.usedGrid.indexOf(pos);
      game.usedGrid.splice(r, 1);
      // Remove CD from allCDs
      allCDs.splice(index, 1);
      // add 10 points to game.score
      game.score += 10;
    },
    guardpositions: [[12],[6,8],[0,4],[7],[5,9],[11,13],[2],[1,3],[10,14],[2,12],[7,11,13],[0,10],[5,2,9],[4,14],[5,9,12],[1,11],[0,12,10],[3,13],[0,4,11,13],[0,4,10,14],[0,2,4,12],[10,12,14,13],[10,11,13,14],[0,2,4,11,13],[0,1,3,4],[10,1,12,3,14],[0,1,3,4,5,9],[0,1,3,4,5,9,10,12,14],[0,1,2,4,5,9,10,12,13,14]],
    addGuard: function() {
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
      if (pattern != undefined){ // This if line prevents error when game is reset
        for (var a = 0; a <= pattern.length - 1; a++){
            //Get Element in itemGrid
            var gridpos = game.itemGrid[pattern[a]];
            allGuards.push(new Guard(gridpos[0],gridpos[1]));
            console.log('Guard added');
            // Add Patter elements to usedGrid
            game.usedGrid.push(pattern[a]);
        }
      }
    },
    startModal: function(){
    //Hide Modal
    $('.modal').modal('hide');
    //Star Game
    game.pause = false;
    },
    switchCharacter: function(){
        player.sprite = game.player[game.randomNumber(6) - 1];
    }
};

// Game Stats to keep track of level and lives
var Stats = function() {
    this.life = 'images/life-on.png';
    this.lifeOff = 'images/life-off.png';
    this.level = game.level;
};

Stats.prototype.update = function() {
    // Add/Remove Hazards based on Level Number
    var ratio = game.level * 0.375;
    if (ratio > allHazards.length){
      allHazards.push(new Hazard());
    }
};

Stats.prototype.render = function() {
    ctx.font = "20px Verdana";
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.textAlign = "center";

    // Update Level
    ctx.fillText("LEVEL " + game.level, 252.5, 35);
    ctx.strokeText("LEVEL " + game.level, 252.5, 35);

    // Update Level
    ctx.fillText(game.score + " pts", 454.5, 35);
    ctx.strokeText(game.score + " pts", 454.4, 35);

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

var CD = function(type) {
    //
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
            var m = document.getElementById("sfx-cd");
            m.play();
            m.loop = false;
        }
    }
};

CD.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Guard = function(x,y) {
    this.x = x * game.xUnit;
    this.y = y * game.yUnit;
    // Assign Sprite
    this.sprite = 'images/char-security.png';
};

Guard.prototype.update = function() {
    // Block detection
    if (player.y === this.y && player.x === this.x){
      if(player.direction == "up"){
        player.y += 83;
      } else if(player.direction == "right"){
        player.x -= 101;
      } else if(player.direction == "down"){
        player.y -= 83;
      } else if(player.direction == "left"){
        player.x += 101;
      }
    }
};

Guard.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Hazards our player must avoid
var Hazard = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
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

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
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

// Draw the enemy on the screen, required method for game
Hazard.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
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
    if (game.cds.length < allCDs.length){
      if (this.y < this.player_limit_top) {
        this.y = this.player_limit_top;
      }
    } else {
      // If player collected all and reached water, resetPosition and level up
      if (this.y === 0) {
        this.resetPosition('levelup');
      }
    }
};

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
                var m = document.getElementById("sfx-levelup");
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
                var n = document.getElementById("sfx-damage");
                n.play();
                n.loop = false;
            }
    }
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
        game.cds = [];
        game.usedGrid = [];
        game.cdGrid= [];
        // Remove all hazards, and create one new enemy
        allHazards = [new Hazard()];
        // Remove all cds, then create one new cd
        allCDs = [new CD()];
        // Remove all guards
        allGuards = [];
        // Assign a different skin
        this.sprite = game.player[game.randomNumber(6) - 1];
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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
var allHazards = [new Hazard()];
var allCDs = [new CD()];
var allGuards = [];

//pause game and call modal
game.pause = true;
$('#modal-start').modal('show');

var player = new Player();
var stats = new Stats();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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

// When Music icon is pressed
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

$('#unpause').on('clock', function(){
    game.pause = false;
});

$('#other-character').on('click', function(){
    game.switchCharacter();
});