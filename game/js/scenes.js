var test;

var mainScene = {
	preload: function() {
		game.load.spritesheet('reticle', 'assets/reticle.png', 15, 15);
		game.load.image("parallax", "assets/Parallax.png");
		loadWeapons();
		loadEnemies();
		loadLevels();
		loadPlayer();
	},
	
	create: function() {
		createControls();
		parallaxSprite = game.add.sprite(0, 0, "parallax");
		parallaxSprite.fixedToCamera = true;
	
		map = makeLevel("maptest1", "Sprite Map 2", "spritemap2");
		
		createDefaults();
	},
	
	update: function() {
		updateDefaults();
	}
}
