var game;

WebFontConfig = {

	active: function() { game.time.events.add(Phaser.Timer.SECOND, function () {
		longStyle = { font: "6px Press Start 2P", stroke: '#000000', strokeThickness: 0, fill: "#fff", tabs: 10/* wordWrap: true, wordWrapWidth: 50 */};
		shortStyle = { font: "6px Press Start 2P", stroke: '#000000', strokeThickness: 0, fill: "#fff", tabs: 10 };
	}, this); },

    google: {
      families: ['Press Start 2P']
    }

};

var triggers = [];

window.onload = function() {
	game = new Phaser.Game(400, 300, Phaser.AUTO, ''/*'phaser-canvas'*/, null, false, false);

	game.state.add("openingScene", openingScene);
	game.state.add("boot", BootScene);
	game.state.add("loading", LoadScene);
	game.state.add("splashes", Splashes);
	game.state.add("mainMenu", MainMenu);

	game.state.add("UpgradeScene", UpgradeScene);

	game.state.add("test", testScene);
	game.state.add("Level0", Level0);
	game.state.add("Level1", Level1);
	game.state.add("Level2", Level2);

	// game.state.start("openingScene");
	game.state.start("boot");

    // game.state.add("mainScene", mainScene);
}

function createControls() {
	cursors = game.input.keyboard.createCursorKeys();
    wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.Q ]);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.R ]);

	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.E ]);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.CONTROL ]);

	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.DELETE ]);
}

function loadDefaults() {
	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	game.load.spritesheet('reticle', 'assets/reticle.png', 15, 15);
	game.load.image("parallax", "assets/Parallax.png");
	game.load.spritesheet("pickables", "assets/pickables.png", 32, 32);
	game.load.image("blackScreen", "assets/blackScreen.png");
	game.load.spritesheet("upgradeIcons", "assets/Upgrades.png", 32, 32);
	game.load.image("blackBox", "assets/blackBox.png");
	game.load.image("getUpgrade", "assets/getUpgrade.png");
	game.load.image("skipUpgrade", "assets/skipUpgrades.png");
	game.load.spritesheet("deathAnim", "assets/deathAnim.png", 64, 32);
	game.load.spritesheet("humanDead", "assets/humanDead.png", 64, 32);
	game.load.spritesheet("enemyDead", "assets/enemyDead.png", 64, 32);
	loadWeapons();
	loadEnemies();
	loadLevels();
	loadPlayer();
}

var parallaxSprite;
var longStyle;
var shortStyle;
var curAI;
function createDefaults(x, y) {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	game.stage.backgroundColor = '#000000';

    game.physics.startSystem(Phaser.Physics.ARCADE);

	sightLine = new Phaser.Line();

	pickables = game.add.group();
	aigroup = game.add.group();
	
	player = new Player(game, x, y);
	targeter = game.add.sprite(100, 100, 'reticle');

    targeter.anchor.x = 0.5;
    targeter.anchor.y = 0.5;
	targeter.fixedToCamera = true;

	ammoCount = game.add.text(0, 0, "AMMO:", shortStyle);
	ammoCount.visible = false;
	ammoCount.padding.set(10, 16);
	tag = game.add.text(0, 0, "AI  ", longStyle);
	tag.visible = false;
	tag.padding.set(10, 16);
	// triggerQuest(null, intro);
	player.ammoCountActive = true;

	player.healthBar = game.add.graphics(-2, 15);
	player.com.addChild(player.healthBar);
	player.gun = defaultMelee(player);
	if (upgrades.bulletBombActive) upgrades.bulletBomb = bulletBomb(player);
	shotsFired = false;
}

function updateDefaults() {
	parallaxSprite.cameraOffset.x = game.width*0.5 + game.camera.x/15;
	parallaxSprite.cameraOffset.y = game.height*0.5 + game.camera.y/15;

	if (player.gun != null) {
		game.physics.arcade.overlap(player.gun.bullets, aigroup, collisionHandler, null, this);

		game.physics.arcade.collide(player.gun.bullets, map.wallLayer, function(bullet) {
			bullet.kill();
		});
	}
	if (upgrades.bulletBombActive) {
		game.physics.arcade.overlap(upgrades.bulletBomb.bullets, aigroup, collisionHandler, null, this);

		game.physics.arcade.collide(upgrades.bulletBomb.bullets, map.wallLayer, function(bullet) {
			bullet.kill();
		});
	}

    for (var i = 0; i < aigroup.length; i++) {
		curAI = aigroup.getAt(i);
        if(curAI.exists) aigroup.getAt(i).logic();
        if (aigroup.getAt(i).gun != null) {
            game.physics.arcade.collide(curAI.gun.bullets, map.wallLayer, function(bullet) {
                bullet.kill();
            });
			game.physics.arcade.overlap(curAI.gun.bullets, player.com, function(playercom, bullet) {
				player.health -= bullet.damage;
				player.recoil(150, bullet.angle * (Math.PI/180));
				if (player.health <= 0 && !player.dead) {
					player.com.angle = bullet.angle + 180;
					player.dropWeapon();
					createCorpse(player.com, "deathAnim");
					playercom.kill();
					player.dead = true;
				}
                bullet.kill();
            });
        }
    }

	for (var i = 0; i < pickables.length; i++) {
        if(pickables.getAt(i).exists) pickables.getAt(i).logic();
    }

    targeter.cameraOffset.x = game.input.activePointer.x;
    targeter.cameraOffset.y = game.input.activePointer.y;
    targeter.angle += 10;

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'

	player.logic();

	game.physics.arcade.collide(aigroup);
	game.physics.arcade.collide(aigroup, player.com, function(p, ai) {
		ai.faceTowards(player.com);
	});
	game.physics.arcade.collide(aigroup, map.wallLayer);
	game.physics.arcade.collide(aigroup, map.coverLayer);

	game.physics.arcade.collide(pickables);
	game.physics.arcade.collide(pickables, map.wallLayer);
	game.physics.arcade.collide(pickables, map.coverLayer);

    let mouseDistanceToCenter = Phaser.Math.distance(game.input.activePointer.x, game.width/2, game.input.activePointer.y, game.height/2);
    let newcam = {
        x: player.com.x + Math.cos(player.head.rotation) * mouseDistanceToCenter * 0.45,
        y: player.com.y + Math.sin(player.head.rotation) * mouseDistanceToCenter * 0.45
    }

    let oldcam = {
        x:recCam.x,
        y:recCam.y
    }

    recCam.x = (oldcam.x - newcam.x) * 0.9 + newcam.x;
    recCam.y = (oldcam.y - newcam.y) * 0.9 + newcam.y;

    game.camera.focusOnXY(recCam.x, recCam.y);

	if (game.input.keyboard.isDown(Phaser.Keyboard.DELETE)) {
		console.log("DELETE ALL AI");
		aigroup.forEachExists(function(ai) {
			ai.kill();
		});
	}

	player.drawHealth();

	if (player.dead) {
		if (blackScreen == null || blackScreen == undefined) {
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
				game.state.restart(true, false);
			}
		}
	}
}

var player;
var targeter;
var cursors;
var wasd;
var keys;
var shotsFired;

var gun;
var bulletTime = 0;
var bullets;

var map;

var ammoCount;
var tag;

var test;
var blackScreen;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var angle = 0;
var fireRate = 0;
var nextFire = 0;
var clicked = false;
var recCam = {
    x:0,
    y:0
}

function collisionHandler(bullet, ai) {
	bullet.kill();
	ai.health -= bullet.damage;
	ai.faceTowards(player.com);
	ai.addForce(Math.sin(bullet.angle * (Math.PI/180)) * 150, Math.cos(bullet.angle * (Math.PI/180)) * 150);
	if (ai.type == "Human") {
		
	}
	else if (ai.type == "Enemy") {
		if (ai.enemyType == "unprovoked") {
			ai.provoked = true;
		}
	}
	if (ai.health <= 0 || isNaN(ai.health)) {
		ai.angle = bullet.angle + 180;
		if (ai.type == "Human") {
			createCorpse(ai, "humanDead");
		}
		else if (ai.type == "Enemy") {
			createCorpse(ai, "enemyDead");
		}
		ai.kill();
	}
}
