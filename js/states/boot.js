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