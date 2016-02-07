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

var BasicGame = function() {

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

    game.renderer.renderSession.roundPixels = true;

  },

  create: function() {

    this.score = game.add.text(game.world.width - 25, 25, 0 + " ", {
        font: "24px",
        fill: "#ecf0f1",
    });
    this.score.font = 'exo';
    this.score.anchor.setTo(0.5);

    this.bestScore = game.add.text(25, 25, this.best + " ", {
        font: "24px",
        fill: "#ecf0f1",
    });
    this.bestScore.font = 'exo';
    this.bestScore.anchor.setTo(0.5);

    this.blocks = this.add.group();
    this.spawnBlocks();

  },

  createBlock: function(color, x, y, isPoint) {

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

    sprite.events.onInputDown.add(this.click, this);

    this.blocks.add(sprite);

    sprite = null;

  },

  createBars: function(color) {

    this.bar = game.add.graphics(10, 60);
    this.bar.beginFill(color);
    this.bar.drawRect(0, 0, 280, 30);
    this.bar.endFill();

    var time = this.points < 35 ? this.timeLeft - (this.points * 50) : 1000;

    this.timeBar = game.add.graphics(10, 95);
    this.timeBar.beginFill(0xecf0f1);
    this.timeBar.drawRect(0, 0, 280, 10);
    this.timeBar.endFill();

    timeBarMask = game.add.graphics(280, 95);
    timeBarMask.beginFill(0x2c3e50);
    timeBarMask.drawRect(0, 0, 280, 10);
    timeBarMask.endFill();

    this.timeTween = game.add.tween(timeBarMask);
    this.timeTween.to({
      x: 10
    }, time, "Linear", true);
    this.timeTween.onComplete.addOnce(function() {
      timeBarMask.kill();
      this.end();
      this.respawn();
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