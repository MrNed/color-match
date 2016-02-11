var Boot = function() {

  this.init = function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;

  };

  this.preload = function() {

    this.load.atlas('preloader', 'res/preloader.png', 'res/preloader.json');

  };

  this.create = function() {

    this.stage.backgroundColor = '#2c3e50';

    this.state.start('Preload');

  };

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

var blocks = null,
    points = 0,
    best = 0,
    scoreTxt = '',
    bestTxt = '',
    bar = null,
    timeBar = null,
    timeLeft = 2500,
    timeTween = null;

var BasicGame = function(game) {

  this.init = function (config) {

    this.config = config;

    var bestScoreCookie = getCookie("ColorMatch_BestScore");
    if (bestScoreCookie != "") {
      best = bestScoreCookie;
    }

    game.renderer.renderSession.roundPixels = true;

  };

  this.create = function() {

    scoreTxt = this.add.bitmapText(this.world.width - 10, 25, '04font', '0', 28);
    scoreTxt.anchor.setTo(1, 0.5);

    bestTxt = this.add.bitmapText(this.world.width - 60, 25, '04font', best, 28);
    bestTxt.anchor.setTo(1, 0.5);

    var manuBtn = this.add.button(10, 22, 'sprites', function() {
      this.state.start('Menu', true, false, this.config);
    }, this, 'menu_active.png', 'menu.png', 'menu_active.png');
    manuBtn.anchor.set(0, 0.5);
    manuBtn.input.useHandCursor = true;

    blocks = this.add.group();

    spawnBlocks(game);

  };

};

var createBlock = function(game, color, x, y, isPoint) {

  var block = game.add.graphics(0, 0);
  block.beginFill(color);
  block.drawRect(0, 0, 90, 90);
  block.endFill();

  var sprite = game.add.sprite(x, y, null);
  sprite.inputEnabled = true;
  sprite.addChild(block);

  block = null;

  if (isPoint) {
    sprite.isPoint = true;
  } else {
    sprite.isPoint = false;
  }

  sprite.events.onInputDown.add(function(tmpBlock) { clickOnBlock(tmpBlock, game); });

  blocks.add(sprite);

  sprite = null;

};

var createBars = function(game, color) {

  bar = game.add.graphics(10, 60);
  bar.beginFill(color);
  bar.drawRect(0, 0, 280, 30);
  bar.endFill();

  var time = points < 35 ? timeLeft - (points * 50) : 1000;

  timeBar = game.add.graphics(10, 95);
  timeBar.beginFill(0xecf0f1);
  timeBar.drawRect(0, 0, 280, 10);
  timeBar.endFill();

  timeBarMask = game.add.graphics(280, 95);
  timeBarMask.beginFill(0x2c3e50);
  timeBarMask.drawRect(0, 0, 280, 10);
  timeBarMask.endFill();

  game.time.events.add(1, function() {
    timeTween = game.add.tween(timeBarMask);
    timeTween.to({
      x: 10
    }, time, "Linear", true);
    timeTween.onComplete.addOnce(function() {
      timeBarMask.kill();
      end();
      respawn(game);
    }, this);
  }, this);

};

var spawnBlocks = function(game) {

  var freePos = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      index = Math.floor(Math.random() * 9),
      group = 'group_' + (Math.floor(Math.random() * 2) + 1),
      groupName = points < 20 ? group : group + '_hard',
      freeColors = colorsArr[groupName].slice(),
      freeColorsCount = points < 20 ? 3 : 6,
      colorIndex = Math.floor(Math.random() * freeColorsCount),
      color = freeColors[colorIndex];

  createBars(game, color);

  createBlock(game, color, posArr[freePos[index]]['x'], posArr[freePos[index]]['y'], true);

  spliceOne(freePos, index);
  spliceOne(freeColors, colorIndex);

  var blocksNum = points <= 7 ? points : 8;

  var i = 0;
  for (i = 0; i < blocksNum; i++) {
    index = Math.floor(Math.random() * (8 - i));
    colorIndex = Math.floor(Math.random() * (freeColorsCount - 1));
    color = freeColors[colorIndex];

    createBlock(game, color, posArr[freePos[index]]['x'], posArr[freePos[index]]['y']);

    spliceOne(freePos, index);
  }

  freePos = null;
  freeColors = null;

};

var clickOnBlock = function(block, game) {

  if (block.isPoint) {
    points++;
  } else {
    end();
  }

  scoreTxt.text = points.toString();

  respawn(game);

};

var respawn = function(game) {

    game.tweens.removeAll();
    blocks.removeAll();

    bar.kill();
    timeBar.kill();
    spawnBlocks(game);

};

var end = function() {

  if (points > best) {
    best = points;
    bestTxt.text = best.toString();

    setCookie('ColorMatch_BestScore', best, 7);
  }

  points = 0;
  scoreTxt.text = '0';

};
var titleColors = ['white', 'emerald', 'sun_flower', 'blue', 'alizarin']
    titleIndex = 0;

var Menu = function(game) {

  this.init = function(config) {

    if (!config) {
      config = {

      };
    }

    this.config = config;

    game.renderer.renderSession.roundPixels = true;

  };

  this.create = function() {

    var title = this.add.sprite(this.world.centerX, 100, 'sprites', 'title_white.png');
    title.anchor.set(0.5);

    this.time.events.add(1, function() {
      this.time.events.loop(5000, function() {
          titleIndex++;

          if (titleIndex == 5) {
            titleIndex = 0;
          }

          title.frameName = 'title_' + titleColors[titleIndex] + '.png';
      }, this);
    }, this);

    var playBtn = this.add.button(this.world.centerX, this.world.centerY, 'sprites', function() {
       this.state.start('Game', true, false, this.config);
    }, this, 'play_active.png', 'play.png', 'play_active.png');
    playBtn.anchor.set(0.5);
    playBtn.input.useHandCursor = true;

  };

};
var preloadBar = null;
var isReady = false;

var Preload = function() {

  this.preload = function() {

    preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloader', 0);
    preloadBar.anchor.set(0.5, 0.5);

    var preloaderFrames = [],
        i = 0;

    for (i; i < 33; i++) {
      preloaderFrames[i] = i;
    }

    preloadBar.animations.add('loading', preloaderFrames, 60, true);
    preloadBar.play('loading');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.load.atlas('sprites', 'res/sprites.png', 'res/sprites.json');
    this.load.bitmapFont('04font', 'res/04font.png', 'res/04font.fnt');

  };

  this.create = function() {

    preloadBar.cropEnabled = false;

  };

  this.update = function() {

    if (isReady) {
      this.state.start('Menu');
    }

  };

  this.onLoadComplete = function() {

    isReady = true;

  };

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
  game.state.add('Menu', Menu);
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