var nextLevel;
const PXSIZE = 32;

var openingScene = {
	finished: false,

	preload: function() {
		game.load.image("blackScreen", "assets/blackScreen.png");
		// game.camera.setSize(800, 600);
		loadDefaults();
	},

	create: function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		// blackScreen = game.add.image(0, 0, "blackScreen");
		// blackScreen.fixedToCamera = true;
		// blackScreen.alpha = 1;
		triggerQuest(this, intro);
		game.stage.backgroundColor = '#000';
		this.counter = 0;
	},

	update: function() {
		if (this.finished) {
			this.counter += 1;
			if (this.counter > 2 * 60) {
				game.state.start("Level0");
			}
		}
	}
}

var testScene = {
	preload: function() {
		game.load.tilemap("mapTest1", "assets/tilemaps/mapTest1.json", null, Phaser.Tilemap.TILED_JSON);
		loadDefaults();
	},

	create: function() {
		this.justStarted = true;

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
		aigroup.forEachExists(function(ai) {
			if (ai.type == "Enemy") aiCount += 1;
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

		var trigger = Phaser.Rectangle(5*PXSIZE, 7*PXSIZE, 32, 32);
		triggers.push(trigger);

		createControls();
		parallaxSprite = game.add.sprite(0, 0, "parallax");
		parallaxSprite.fixedToCamera = true;
		parallaxSprite.anchor.x = 0.5;
		parallaxSprite.anchor.y = 0.5;

		map = makeLevel("Level0", "Sprite Map 2", "spritemap2");

		createDefaults(5*PXSIZE,7*PXSIZE);

		var spawnPoints = [ [4*PXSIZE,19*PXSIZE, 90] ];
		for (var i = 0; i < 1; i++) {
			let newEnemy = makeUnprovokedEnemy(spawnPoints[i][0], spawnPoints[i][1], spawnPoints[i][2]);
			newEnemy.gun = defaultMelee(newEnemy);
			aigroup.add(newEnemy);
		}

		let questGiver = makeHuman(10*PXSIZE,10*PXSIZE, 180);
		aigroup.add(questGiver);
		trigger.talker = questGiver;

		var diologue = ["Some edgy shit."];

		trigger.text = diologue;

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
		aigroup.forEachExists(function(ai) {
			if (ai.type == "Enemy") aiCount += 1;
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

		createDefaults(8*PXSIZE,2*PXSIZE);

		var spawnPoints = [ [7*PXSIZE,48*PXSIZE, 0] ];
		for (var i = 0; i < 1; i++) {
			let newEnemy = makeUnprovokedEnemy(spawnPoints[i][0], spawnPoints[i][1]);
			newEnemy.gun = defaultMelee(newEnemy);
			aigroup.add(newEnemy);
		}

		var spawnPoints = [ [3*PXSIZE, 6*PXSIZE, 0], [11*PXSIZE,6*PXSIZE,0], [19*PXSIZE, 4*PXSIZE, -45], [14*PXSIZE, 12*PXSIZE, 180], [6*PXSIZE,12*PXSIZE,180],
		[28*PXSIZE,10*PXSIZE,-90], [18*PXSIZE, 7*PXSIZE, 0], [ 24*PXSIZE, 17*PXSIZE, 90],  [25*PXSIZE, 4*PXSIZE, 90], [21*PXSIZE,9*PXSIZE],
		[9*PXSIZE,24*PXSIZE,90], [11.5*PXSIZE,47.5*PXSIZE,180], [8.5*PXSIZE,44.5*PXSIZE], [6.5*PXSIZE,44.5*PXSIZE], [22*PXSIZE,37*PXSIZE,-90] ];
		for (var i = 0; i < 15; i++) {
			let human = makeHuman(spawnPoints[i][0], spawnPoints[i][1]);
			aigroup.add(human);
		}
		for (var i = 0; i < 1; i++) {
			let newPickable = pistolPickable(9*PXSIZE, 4*PXSIZE);
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
		aigroup.forEachExists(function(ai) {
			if (ai.type == "Enemy") aiCount += 1;
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

		createDefaults(14.5*PXSIZE,17.5*PXSIZE);

		for (var i = 0; i < 1; i++) {
			let newPickable = swordPickable(14.5*PXSIZE, 50.5*PXSIZE);
		}

		var spawnPoints = [ [29*PXSIZE,25*PXSIZE,90], [32*PXSIZE,26*PXSIZE,180] ];
		for (var i = 0; i < 2; i++) {
			let newEnemy = makeUnprovokedEnemy(spawnPoints[i][0], spawnPoints[i][1]);
			newEnemy.gun = pistol(newEnemy);
			aigroup.add(newEnemy);
		}

		var spawnPoints = [[38*PXSIZE,61*PXSIZE, -90], [42*PXSIZE,61*PXSIZE, -90], [59*PXSIZE,49*PXSIZE, 90], [50*PXSIZE,50*PXSIZE, 0], [52*PXSIZE,36*PXSIZE,180],
		[56*PXSIZE,27*PXSIZE, 180] ];
		for (var i = 0; i < 6; i++) {
			let newEnemy = makeDefaultEnemy(spawnPoints[i][0], spawnPoints[i][1]);
			newEnemy.gun = autorifle(newEnemy);
			aigroup.add(newEnemy);
		}

		var spawnPoints = [ [11*PXSIZE, 52*PXSIZE, 90], [5*PXSIZE, 51*PXSIZE, 0], [12*PXSIZE,59*PXSIZE,-90], [4*PXSIZE,50*PXSIZE, 90], [27*PXSIZE,43*PXSIZE,10],
		[35*PXSIZE,40*PXSIZE,0], [30*PXSIZE,46*PXSIZE,90],[35*PXSIZE,46*PXSIZE,180],  [27*PXSIZE,27*PXSIZE,0], [24*PXSIZE,28*PXSIZE,0] ];
		for (var i = 0; i < 10; i++) {
			let human = makeHuman(spawnPoints[i][0], spawnPoints[i][1]);
			aigroup.add(human);
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
		aigroup.forEachExists(function(ai) {
			if (ai.type == "Enemy") aiCount += 1;
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
