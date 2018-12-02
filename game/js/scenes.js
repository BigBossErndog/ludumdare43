var test;

var mainScene = {
	preload: function() {
		game.load.spritesheet('reticle', 'assets/reticle.png', 15, 15);
		loadWeapons();
		loadEnemies();
		loadLevels();
		loadPlayer();
	},
	
	create: function() {
		createControls();
		
		map = makeLevel("mapTest1", "spritemap2");
		
		createDefaults();
	},
	
	update: function() {
		updateDefaults();
	}
}
