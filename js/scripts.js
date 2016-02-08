var Boot = function(game) {};

Boot.prototype = {

  init: function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;

  },

  preload: function() {

    this.load.atlas('preloader', 'res/preloader.png', 'res/preloader.json');

  },

  create: function() {

    this.stage.backgroundColor = '#2c3e50';

    this.fontLoad = this.add.text(this.world.centerX, this.world.centerY, " a ", {
        font: "200px",
        fill: "#ecf0f1",
    });
    this.fontLoad.visible = false;
    this.fontLoad.font = 'exo';

    this.state.start('Preload');

  }

};
/*
  'peter_river': '#3498db',
  'belize_hole': '#2980b9',
  'turquoise': '#1abc9c',
  'green_sea': '#16a085',
  'emerald': '#2ecc71',
  'nephritis': '#27ae60',
  'sun_flower': '#f1c40f',
  'orange': '#f39c12',
  'carrot': '#e67e22',
  'pumpkin': '#d35400',
  'alizarin': '#e74c3c',
  'pomegranate': '#c0392b',
*/

var colorsArr = {
  'group_1': ['0x3498db', '0x1abc9c', '0x2ecc71'],
  'group_1_hard': ['0x3498db', '0x1abc9c', '0x2ecc71', '0x2980b9', '0x16a085', '0x27ae60'],
  'group_2': ['0xf1c40f', '0xe67e22', '0xe74c3c'],
  'group_2_hard': ['0xf1c40f', '0xe67e22', '0xe74c3c', '0xf39c12', '0xd35400', '0xc0392b']
}

var posArr = {
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

var BasicGame = function(game) {

  this.points = 0;
  this.best = 0;
  this.bar = null;
  this.timeBar = null;
  this.blocks = null;
  this.timeLeft = 2500;
  this.timeTween = null;

};

BasicGame.prototype = {

  init: function (config) {

    this.config = config;

    var bestScoreCookie = getCookie("ColorMatch_BestScore");
    if (bestScoreCookie != "") {
      this.best = bestScoreCookie;
    }

    this.game.renderer.renderSession.roundPixels = true;

  },

  create: function() {

    this.score = this.add.text(this.world.width - 25, 25, 0 + " ", {
        font: "24px",
        fill: "#ecf0f1",
    });
    this.score.font = 'exo';
    this.score.anchor.setTo(0.5);

    this.bestScore = this.add.text(25, 25, this.best + " ", {
        font: "24px",
        fill: "#ecf0f1",
    });
    this.bestScore.font = 'exo';
    this.bestScore.anchor.setTo(0.5);

    this.blocks = this.add.group();
    this.spawnBlocks();

  },

  createBlock: function(color, x, y, isPoint) {

    var block = this.add.graphics(0, 0);
    block.beginFill(color);
    block.drawRect(0, 0, 90, 90);
    block.endFill();

    var sprite = this.add.sprite(x, y, null);
    sprite.inputEnabled = true;
    sprite.addChild(block);

    block = null;

    if (isPoint) {
      sprite.isPoint = true;
    } else {
      sprite.isPoint = false;
    }

    sprite.events.onInputDown.add(this.click, this);

    this.blocks.add(sprite);

    sprite = null;

  },

  createBars: function(color) {

    this.bar = this.add.graphics(10, 60);
    this.bar.beginFill(color);
    this.bar.drawRect(0, 0, 280, 30);
    this.bar.endFill();

    var time = this.points < 35 ? this.timeLeft - (this.points * 50) : 1000;

    this.timeBar = this.add.graphics(10, 95);
    this.timeBar.beginFill(0xecf0f1);
    this.timeBar.drawRect(0, 0, 280, 10);
    this.timeBar.endFill();

    timeBarMask = this.add.graphics(280, 95);
    timeBarMask.beginFill(0x2c3e50);
    timeBarMask.drawRect(0, 0, 280, 10);
    timeBarMask.endFill();

    this.time.events.add(1, function() {
      this.timeTween = this.add.tween(timeBarMask);
      this.timeTween.to({
        x: 10
      }, time, "Linear", true);
      this.timeTween.onComplete.addOnce(function() {
        timeBarMask.kill();
        this.end();
        this.respawn();
      }, this);
    }, this);

  },

  spawnBlocks: function() {

    var freePos = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        index = Math.floor(Math.random() * 9),
        group = 'group_' + (Math.floor(Math.random() * 2) + 1),
        groupName = this.points < 20 ? group : group + '_hard',
        freeColors = colorsArr[groupName].slice(),
        freeColorsCount = this.points < 20 ? 3 : 6,
        colorIndex = Math.floor(Math.random() * freeColorsCount),
        color = freeColors[colorIndex];

    this.createBars(color);

    this.createBlock(color, posArr[freePos[index]]['x'], posArr[freePos[index]]['y'], true);

    spliceOne(freePos, index);
    spliceOne(freeColors, colorIndex);

    var blocksNum = this.points <= 7 ? this.points : 8;

    for (var i = 0; i < blocksNum; i++) {
      index = Math.floor(Math.random() * (8 - i));
      colorIndex = Math.floor(Math.random() * (freeColorsCount - 1));
      color = freeColors[colorIndex];

      this.createBlock(color, posArr[freePos[index]]['x'], posArr[freePos[index]]['y']);

      spliceOne(freePos, index);
    }

    freePos = null;
    freeColors = null;

  },

  click: function(block) {

    if (block.isPoint) {
      this.points++;
    } else {
      this.end();
    }

    this.score.text = this.points.toString();

    this.respawn();
  },

  end: function() {

    if (this.points > this.best) {
      this.best = this.points;
      this.bestScore.text = this.best.toString();

      setCookie('ColorMatch_BestScore', this.best, 7);
    }

    this.points = 0;
    this.score.text = '0';

  },

  respawn: function() {

    this.tweens.removeAll();
    this.blocks.removeAll();

    this.bar.kill();
    this.timeBar.kill();
    this.spawnBlocks();

  }

};
/*
var Menu = function() {

};

Menu.prototype = {

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
*/
var Preload = function(game) {

  this.preloadBar = null;
  this.ready = true;

};

Preload.prototype = {

  preload: function() {

    this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloader', 0);
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
      // this.state.start('Menu');
      this.state.start('Game');
    }

  },

  onLoadComplete: function() {

    this.ready = true;

  }

};
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start, false);
}

function start() {
  var game = new Phaser.Game(300, 420, Phaser.Canvas, 'game_cont');

  game.state.add('Boot', Boot);
  game.state.add('Preload', Preload);
  // game.state.add('Menu', BasicGame.Menu);
  game.state.add('Game', BasicGame);

  game.state.start('Boot');
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function spliceOne(a, i) {
  var l = a.length;

  if (l) {
    while (i<l) {
      a[i++] = a[i];
    }
    --a.length;
  }
}