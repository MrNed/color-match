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

    this.load.bitmapFont('04font', 'res/04font.png', 'res/04font.fnt');

  };

  this.create = function() {

    preloadBar.cropEnabled = false;

  };

  this.update = function() {

    if (isReady) {
      // this.state.start('Menu');
      this.state.start('Game');
    }

  };

  this.onLoadComplete = function() {

    isReady = true;

  };

};