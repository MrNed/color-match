var Bar = function(game, color, timeLeft) {

  if (timeLeft) {
    bar = game.add.graphics(10, 95);
    bar.beginFill(0xecf0f1);
    bar.drawRect(0, 0, 280, 10);
    bar.endFill();

    buttonMask = game.add.graphics(280, 95);
    buttonMask.beginFill(0x2c3e50);
    buttonMask.drawRect(0, 0, 280, 10);
    buttonMask.endFill();

    var timeTween = game.add.tween(buttonMask);
    timeTween.to({
      x: 10
    }, timeLeft, "Linear", true);
    timeTween.onComplete.addOnce(function() {

    }, this);
  } else {
    color = '0x' + color.substring(1);

    var bar = game.add.graphics(10, 60);
    bar.beginFill(color);
    bar.drawRect(0, 0, 280, 30);
    bar.endFill();
  }

};

Bar.prototype = Object.create(Phaser.Sprite.prototype);
Bar.prototype.constructor = Bar;
var Block = function(game, color, isPoint, x, y, group) {

  if (isPoint) {
    this.point = true;
  } else {
    this.point = false;
  }

  var block = game.add.bitmapData(90, 90);
  block.ctx.rect(0, 0, 90, 90);
  block.ctx.fillStyle = color;
  block.ctx.fill();

  Phaser.Sprite.call(this, game, x, y, block);

  this.inputEnabled = true;

  group.add(this);

};

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;
var BasicGame = {};

BasicGame.Boot = function() {

};

BasicGame.Boot.prototype = {

  init: function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;

  },

  preload: function() {

    this.load.atlas('preloader', 'res/preloader.png', 'res/preloader.json');

  },

  create: function() {

    this.stage.backgroundColor = '#2c3e50';

    this.fontLoad = game.add.text(game.world.centerX, game.world.centerY, " a ", {
        font: "200px",
        fill: "#ecf0f1",
    });
    this.fontLoad.visible = false;
    this.fontLoad.font = 'exo';

    this.state.start('Preload');

  }

};
BasicGame.Game = function(game) {

  this.points = 0;
  this.best = 0;
  this.bar = null;
  this.timeBar = null;
  this.blocks = null;
  this.timeLeft = 2500;
  this.timeTween = null;
  this.colors = {
    'peter_river': '#3498db',
    'belize_hole': '#2980b9',
    'turquoise': '#1abc9c',
    'green_sea': '#16a085',
    'emerald': '#2ecc71',
    'nephritis': '#27ae60',
    'amethyst': '#9b59b6',
    'wisteria': '#8e44ad',
    'sun_flower': '#f1c40f',
    'orange': '#f39c12',
    'carrot': '#e67e22',
    'pumpkin': '#d35400',
    'alizarin': '#e74c3c',
    'pomegranate': '#c0392b',
    'concrete': '#95a5a6',
    'asbestos': '#7f8c8d'
  };

  this.colorsTierOne = ['peter_river', 'turquoise', 'emerald', 'amethyst', 'sun_flower', 'carrot', 'alizarin', 'concrete'];
  this.colorsTierTwo = ['belize_hole', 'green_sea', 'nephritis', 'wisteria', 'orange', 'pumpkin', 'pomegranate', 'asbestos'];

  this.pos = {
    '0': {'x': 10, 'y': 130},
    '1': {'x': 105, 'y': 130},
    '2': {'x': 200, 'y': 130},
    '3': {'x': 10, 'y': 225},
    '4': {'x': 105, 'y': 225},
    '5': {'x': 200, 'y': 225},
    '6': {'x': 10, 'y': 320},
    '7': {'x': 105, 'y': 320},
    '8': {'x': 200, 'y': 320}
  };

};

BasicGame.Game.prototype = {

  init: function (config) {

    this.config = config;

    game.renderer.renderSession.roundPixels = true;

  },

  create: function() {

    var self = this;

    self.score = game.add.text(game.world.width - 25, 25, 0 + " ", {
        font: "24px",
        fill: "#ecf0f1",
    });
    self.score.font = 'exo';
    self.score.anchor.setTo(0.5);

    self.bestScore = game.add.text(25, 25, 0 + " ", {
        font: "24px",
        fill: "#ecf0f1",
    });
    self.bestScore.font = 'exo';
    self.bestScore.anchor.setTo(0.5);

    this.blocks = this.add.group();
    this.spawnBlocks();

  },

  spawnBlocks: function() {

    var freePos = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        index = Math.floor(Math.random() * freePos.length),
        freeColors = this.points < 20 ? this.colorsTierOne.slice() : this.colorsTierOne.concat(this.colorsTierTwo),
        freeColorsCount = freeColors.length,
        colorIndex = Math.floor(Math.random() * freeColorsCount),
        color = this.colors[freeColors[colorIndex]];

    this.bar = new Bar(game, color);

    var time = this.points < 35 ? this.timeLeft - (this.points * 50) : 750;

    var timeBar = game.add.graphics(10, 95);
    timeBar.beginFill(0xecf0f1);
    timeBar.drawRect(0, 0, 280, 10);
    timeBar.endFill();

    timeBarMask = game.add.graphics(280, 95);
    timeBarMask.beginFill(0x2c3e50);
    timeBarMask.drawRect(0, 0, 280, 10);
    timeBarMask.endFill();

    this.timeTween = game.add.tween(timeBarMask);
    this.timeTween.to({
      x: 10
    }, time, "Linear", true);
    this.timeTween.onComplete.addOnce(function() {
      this.points = 0;
      this.respawn();
    }, this);

    var block = new Block(game, color, true, this.pos[freePos[index]]['x'], this.pos[freePos[index]]['y'], this.blocks, self.click, self);
    block.events.onInputDown.add(this.click, this);

    freePos.splice(index, 1);
    freeColors.splice(colorIndex, 1);

    var blocksNum = this.points <= 16 ? this.points / 2 : 8;

    for (var i = 0; i < blocksNum; i++) {
      index = Math.floor(Math.random() * freePos.length);
      colorIndex = Math.floor(Math.random() * (freeColors.length));
      color = this.colors[freeColors[colorIndex]];

      block = new Block(game, color, false, this.pos[freePos[index]]['x'], this.pos[freePos[index]]['y'], this.blocks);
      block.events.onInputDown.add(this.click, this);
      freePos.splice(index, 1);
    }

  },

  click: function(block) {

    if (block.point) {
      this.points++;
    } else {
      this.points = 0;
    }

    if (this.points > this.best) {
      this.best = this.points;
      this.bestScore.text = this.best.toString();
    }

    this.score.text = this.points.toString();

    this.respawn();
  },

  respawn: function() {

    this.tweens.removeAll();

    this.blocks.forEach(function(item, index) {
      item.kill();
    });

    this.bar.kill();

    this.spawnBlocks();

  }

};
BasicGame.Menu = function() {

};

BasicGame.Menu.prototype = {

  init: function(config) {
    if (!config) {
      config = {

      };
    }

    this.config = config;
  },

  create: function() {

    this.startClick();

  },

  update: function() {

  },

  startClick: function() {

    this.state.start('Game', true, false, this.config);

  },

};
BasicGame.Preload = function() {

  this.preloadBar = null;
  this.ready = true;

};

BasicGame.Preload.prototype = {

  preload: function() {

    this.preloadBar = this.add.sprite(game.width * 0.5, game.height * 0.5, 'preloader', 0);
    this.preloadBar.anchor.set(0.5, 0.5);

    var preloaderFrames = [],
        i = 0;

    for (i; i < 33; i++) {
      preloaderFrames[i] = i;
    }

    this.preloadBar.animations.add('loading', preloaderFrames, 60, true);
    this.preloadBar.play('loading');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

  },

  create: function() {

    this.preloadBar.cropEnabled = false;

  },

  update: function() {

    if (this.ready) {
      this.state.start('Menu');
    }

  },

  onLoadComplete: function() {

    this.ready = true;

  }

};
var game = new Phaser.Game(300, 420, Phaser.Canvas, 'game_cont');

game.state.add('Boot', BasicGame.Boot);
game.state.add('Preload', BasicGame.Preload);
game.state.add('Menu', BasicGame.Menu);
game.state.add('Game', BasicGame.Game);

game.state.start('Boot');