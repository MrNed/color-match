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