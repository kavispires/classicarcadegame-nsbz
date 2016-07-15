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
    gems: [],
    player: ['images/char-pat.png', 'images/char-bri.png'],
    enemies: [{
        sprite: 'images/hazard-loveletter.png',
        speed: 50.5,
    }, {
        sprite: 'images/hazard-panties.png',
        speed: 101,
    }, {
        sprite: 'images/hazard-bottle.png',
        speed: 303,
    }],
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
    gemGrid: [],
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
    addGem: function(){
      // Add Gems based on Level Number
      if (game.level <= 5){
        allGems = [new Gem(0)];
      } else if (game.level > 5 && game.level <= 10){
        allGems = [new Gem(0), new Gem(1)];
      } else if (game.level > 10 && game.level <= 30){
        allGems = [new Gem(0), new Gem(1), new Gem(2)];
      } else if (game.level > 30 && game.level <= 40){
        allGems = [new Gem(0), new Gem(1), new Gem(2), new Gem(3)];
      } else {
        allGems = [new Gem(0), new Gem(1), new Gem(2), new Gem(3), new Gem(4)];
      }
    },
    removeGem: function(index,pos){
      // Remove from gemGrid and usedGrid
      var r = game.gemGrid.indexOf(pos);
      game.gemGrid.splice(r, 1);
      r = game.usedGrid.indexOf(pos);
      game.usedGrid.splice(r, 1);
      // Remove Gem from allGems
      allGems.splice(index, 1);
      // add 10 points to game.score
      game.score += 10;
    },
    rockpositions: [[12],[6,8],[0,4],[7],[5,9],[11,13],[2],[1,3],[10,14],[2,12],[7,11,13],[0,10],[5,2,9],[4,14],[5,9,12],[1,11],[0,12,10],[3,13],[0,4,11,13],[0,4,10,14],[0,2,4,12],[10,12,14,13],[10,11,13,14],[0,2,4,11,13],[0,1,3,4],[10,1,12,3,14],[0,1,3,4,5,9],[0,1,3,4,5,9,10,12,14],[0,1,2,4,5,9,10,12,13,14]],
    addRock: function() {
      // Remove all rocks
      allRocks = [];
      // Clear usedGrid
      game.usedGrid = [];
      // If Level less than 30, get array of rock positions
      var pattern;
      if (game.level <= 30){
        pattern = game.rockpositions[game.level-2];
      // Else, get random array
      } else {
        pattern = game.rockpositions[game.randomNumber(30) - 1];
      }
      // Add Rocks
      for (var a = 0; a <= pattern.length - 1; a++){
        //Get Element in itemGrid
        var gridpos = game.itemGrid[pattern[a]];
        allRocks.push(new Rock(gridpos[0],gridpos[1]));
        console.log('Rock added');
        // Add Patter elements to usedGrid
        game.usedGrid.push(pattern[a]);
      }
    }
}

// Game Stats to keep track of level and lives
var Stats = function() {
    this.life = 'images/life-on.png';
    this.lifeOff = 'images/life-off.png';
    this.level = game.level;
}

Stats.prototype.update = function() {
    // Add/Remove Enemies based on Level Number
    var ratio = game.level * 0.375;
    if (ratio > allEnemies.length){
      allEnemies.push(new Enemy());
    }
}

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
}

var Gem = function(type) {
    //
    this.type = type;
    if(type == undefined){
      this.type = 0;
    }
    // Assign Gem Position
    // Get random number from 0 to 14
    // Check if number is in usedGrid
    // If true, get a different number
    do {
      this.pos = game.randomNumber(15) - 1;
      var contains = game.usedGrid.indexOf(this.pos);
    } while (contains != -1);

    // When false, push it to usedGrid and gemGrid
    // Add to Array that keeps track of elements in the game
    game.usedGrid.push(this.pos);
    // Array that keeps track only of crystals
    game.gemGrid.push(this.pos);
    // Assign X and Y
    this.x = game.itemGrid[this.pos][0] * game.xUnit;
    this.y = game.itemGrid[this.pos][1] * game.yUnit;
    // Assign Sprite
    this.sprite = game.items[this.type].sprite;
}

Gem.prototype.update = function() {
    // Collect Detection
    if (player.y === this.y && player.x === this.x){
          allGems.forEach(function(gem){
            if(this.x === gem.x){
              game.removeGem(allGems.indexOf(gem),this.pos);
            }
          }.bind(this));
          console.log('Gem collected!');
          $('.sfx').html("<embed src='sfx/cd.mp3' hidden=true autostart=true loop=false>");
    }
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Rock = function(x,y) {
    this.x = x * game.xUnit;
    this.y = y * game.yUnit;
    // Assign Sprite
    this.sprite = 'images/char-security.png';
}

Rock.prototype.update = function() {
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
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Assign Enemy Type
    this.type = game.randomType();
    // Assign Starting Position
    this.x = game.xUnit * game.randomNumber(3) * -1; // X position Off-Screen
    this.y = game.yUnit * game.randomRange(1, 4);
    // Assign Speed
    this.speed = game.enemies[this.type].speed;
    // Assign Sprite
    this.sprite = game.enemies[this.type].sprite;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // When Enemy passes screen limit randomize its row,
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
Enemy.prototype.render = function() {
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
    this.sprite = game.player[game.randomNumber(2) - 1];
    // Play Direction
    this.direction = null;
}

Player.prototype.update = function(dt) {
    // Limit player into boundaries
    if (this.x > this.player_limit_right) {
        this.x = this.player_limit_right
    }
    if (this.y > this.player_limit_bottom) {
        this.y = this.player_limit_bottom;
    }
    if (this.x < this.player_limit_left) {
        this.x = this.player_limit_left;
    }

    // Winning Condition
    // Prevent player from going into the water if he hasn't collect the gems
    if (game.gems.length < allGems.length){
      if (this.y < this.player_limit_top) {
        this.y = this.player_limit_top;
      }
    } else {
      // If player collected all and reached water, resetPosition and level up
      if (this.y == 0) {
        this.resetPosition('levelup');
      }
    }
}

Player.prototype.resetPosition = function(val) {
    // Reset Position after 0.25s
    this.x = this.player_start_x;
    this.y = this.player_start_y;
    // Update Lives or Levels
    switch (val) {
        case 'levelup':
            game.level++;
            game.score += 50;
            console.log('Reached Top! Level up!');
            game.addRock();
            game.addGem();
            $('.sfx').html("<embed src='sfx/levelup.mp3' hidden=true autostart=true loop=false>");
            break;
        case 'damage':
            game.lives--;
            game.score -= 25;
            console.log('Damage!');
            $('.helper').text('You took damage.');
            $('.sfx').html("<embed src='sfx/damage.mp3' hidden=true autostart=true loop=false>");
    }
    if (game.lives <= 0) {
        console.log('GAME OVER');
        $('.helper').text('Game Over. High Score: '+ game.score);
        game.level = 0;
        game.lives = 3;
        game.score = 0;
        // Remove all enemies, and create one new enemy
        allEnemies = [new Enemy()];
        // Remove all gems, then create one new gem
        allGems = [new Gem()];
        // Remove all rocks
        allRocks = [];
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    // Object with direction coordinates
    var direction = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0],
    }
    // Move player
    this.x += direction[key][0] * this.player_move_x;
    this.y += direction[key][1] * this.player_move_y;
    // Update direction
    this.direction = key;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy()];
var allGems = [new Gem()];
var allRocks = [];
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
        18: 'p'
    };

    //Pause Game
    if (e.keyCode === 32 || e.keyCode === 18) {
        game.pause = !game.pause;
    }

    if (game.pause === false) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
