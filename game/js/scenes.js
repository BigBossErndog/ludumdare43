var test;

var mainScene = {
	preload: function() {
		game.load.tilemap("Level1", "assets/tilemaps/Level1.json", null, Phaser.Tilemap.TILED_JSON);
		loadDefaults();
	},
	
	create: function() {
		createControls();
		parallaxSprite = game.add.sprite(0, 0, "parallax");
		parallaxSprite.fixedToCamera = true;
		parallaxSprite.anchor.x = 0.5;
		parallaxSprite.anchor.y = 0.5;
	
		map = makeLevel("Level1", "Sprite Map 2", "spritemap2");
		
		createDefaults();
		
		var spawnPoints = [ [30,40], [60,70], [100, 50], [550, 370], [190, 500] ];
		for (var i = 0; i < 5; i++) {
			let newEnemy = makeDefaultEnemy(spawnPoints[i][0], spawnPoints[i][1]);
			newEnemy.gun = autorifle(newEnemy);
			aigroup.add(newEnemy);
		}
		
		for (var i = 0; i < 10; i++) {
			let newPickable = shotgunPickable(Math.random() * map.widthInPixels, Math.random() * map.heightInPixels);
		}
	},
	
	update: function() {
		updateDefaults();
	}
}
