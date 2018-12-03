var nextLevel;

var testScene = {
	preload: function() {
		game.load.tilemap("mapTest1", "assets/tilemaps/mapTest1.json", null, Phaser.Tilemap.TILED_JSON);
		loadDefaults();
	},

	create: function() {
		this.justStarted = true;
		// this.justStarted.start = Date.now();

		createControls();
		parallaxSprite = game.add.sprite(0, 0, "parallax");
		parallaxSprite.fixedToCamera = true;
		parallaxSprite.anchor.x = 0.5;
		parallaxSprite.anchor.y = 0.5;

		map = makeLevel("mapTest1", "Sprite Map 2", "spritemap2");

		createDefaults();

		var spawnPoints = [ [30,40], [60,70], [100, 50], [550, 370], [190, 500] ];
		for (var i = 0; i < 5; i++) {
			let newEnemy = makeDefaultEnemy(spawnPoints[i][0], spawnPoints[i][1]);
			newEnemy.gun = autorifle(newEnemy);
			aigroup.add(newEnemy);
		}

		var spawnPoints = [ [67,45], [123,80], [346, 90], [456, 370], [190, 500] ];
		for (var i = 0; i < 5; i++) {
			let human = makeHuman(spawnPoints[i][0], spawnPoints[i][1]);
			aigroup.add(human);
		}

		for (var i = 0; i < 5; i++) {
			let newPickable = shotgunPickable(Math.random() * map.widthInPixels, Math.random() * map.heightInPixels);
		}
		for (var i = 0; i < 5; i++) {
			let newPickable = pistolPickable(Math.random() * map.widthInPixels, Math.random() * map.heightInPixels);
		}
		for (var i = 0; i < 5; i++) {
			let newPickable = swordPickable(Math.random() * map.widthInPixels, Math.random() * map.heightInPixels);
		}
		for (var i = 0; i < 5; i++) {
			let newPickable = smgPickable(Math.random() * map.widthInPixels, Math.random() * map.heightInPixels);
		}
		for (var i = 0; i < 5; i++) {
			let newPickable = autoriflePickable(Math.random() * map.widthInPixels, Math.random() * map.heightInPixels);
		}
	},

	update: function() {
		if (this.justStarted) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.fixedToCamera = true;
				blackScreen.alpha = 1;
				// triggerDialogue(intro);
			}
			else {
				if (blackScreen.alpha > 0/* && (Date.now() >= this.justStarted.start + 10000)*/) {
					blackScreen.alpha -= 0.02;
				}
				else {
					blackScreen.destroy();
					blackScreen = null;
					this.justStarted = false;
				}
			}
		}
		updateDefaults();

		let aiCount = 0;
		aigroup.forEachExists(function() {
			aiCount += 1;
		});
		if (aiCount == 0 && !player.dead) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 0;
				blackScreen.fixedToCamera = true;
			}
			else {
				if (blackScreen.alpha < 1) {
					blackScreen.alpha += 0.01;
				}
				else {
					blackScreen = null;
					game.stage.backgroundColor = "#000000";
					nextLevel = "Level1";
					game.state.start("UpgradeScene", true, false);
				}
			}
		}
	}
}

var Level0 = {
	preload: function() {
		game.load.tilemap("Level0", "assets/tilemaps/Level0.json", null, Phaser.Tilemap.TILED_JSON);
		loadDefaults();
	},

	create: function() {
		this.justStarted = true;

		createControls();
		parallaxSprite = game.add.sprite(0, 0, "parallax");
		parallaxSprite.fixedToCamera = true;
		parallaxSprite.anchor.x = 0.5;
		parallaxSprite.anchor.y = 0.5;
		
		map = makeLevel("Level0", "Sprite Map 2", "spritemap2");

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
		if (this.justStarted) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.fixedToCamera = true;
				blackScreen.alpha = 1;
			}
			else {
				if (blackScreen.alpha > 0) {
					blackScreen.alpha -= 0.02;
				}
				else {
					blackScreen.destroy();
					blackScreen = null;
					this.justStarted = false;
				}
			}
		}

		updateDefaults();

		let aiCount = 0;
		aigroup.forEachExists(function() {
			aiCount += 1;
		});
		if (aiCount == 0 && !player.dead) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 0;
				blackScreen.fixedToCamera = true;
			}
			else {
				if (blackScreen.alpha < 1) {
					blackScreen.alpha += 0.01;
				}
				else {
					blackScreen = null;
					game.stage.backgroundColor = "#000000";
					nextLevel = "Level1";
					game.state.start("UpgradeScene", true, false);
				}
			}
		}
	}
}

var Level1 = {
	preload: function() {
		game.load.tilemap("Level1", "assets/tilemaps/Level1.json", null, Phaser.Tilemap.TILED_JSON);
		loadDefaults();
	},

	create: function() {
		this.justStarted = true;

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
		if (this.justStarted) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.fixedToCamera = true;
				blackScreen.alpha = 1;
			}
			else {
				if (blackScreen.alpha > 0) {
					blackScreen.alpha -= 0.02;
				}
				else {
					blackScreen.destroy();
					blackScreen = null;
					this.justStarted = false;
				}
			}
		}

		updateDefaults();

		let aiCount = 0;
		aigroup.forEachExists(function() {
			aiCount += 1;
		});
		if (aiCount == 0 && !player.dead) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 0;
				blackScreen.fixedToCamera = true;
			}
			else {
				if (blackScreen.alpha < 1) {
					blackScreen.alpha += 0.01;
				}
				else {
					blackScreen = null;
					game.stage.backgroundColor = "#000000";
					nextLevel = "Level2";
					game.state.start("UpgradeScene", true, false);
				}
			}
		}
	}
}

var Level2 = {
	preload: function() {
		game.load.tilemap("Level2", "assets/tilemaps/Level2.json", null, Phaser.Tilemap.TILED_JSON);
		loadDefaults();
	},

	create: function() {
		this.justStarted = true;

		createControls();
		parallaxSprite = game.add.sprite(0, 0, "parallax");
		parallaxSprite.fixedToCamera = true;
		parallaxSprite.anchor.x = 0.5;
		parallaxSprite.anchor.y = 0.5;
		
		map = makeLevel("Level2", "Sprite Map 2", "spritemap2");

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
		if (this.justStarted) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.fixedToCamera = true;
				blackScreen.alpha = 1;
			}
			else {
				if (blackScreen.alpha > 0) {
					blackScreen.alpha -= 0.02;
				}
				else {
					blackScreen.destroy();
					blackScreen = null;
					this.justStarted = false;
				}
			}
		}

		updateDefaults();

		let aiCount = 0;
		aigroup.forEachExists(function() {
			aiCount += 1;
		});
		if (aiCount == 0 && !player.dead) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 0;
				blackScreen.fixedToCamera = true;
			}
			else {
				if (blackScreen.alpha < 1) {
					blackScreen.alpha += 0.01;
				}
				else {
					blackScreen = null;
					game.stage.backgroundColor = "#000000";
					nextLevel = "testScene";
					game.state.start("UpgradeScene", true, false);
				}
			}
		}
	}
}
