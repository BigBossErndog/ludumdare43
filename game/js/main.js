var game;

window.onload = function() {
	game = new Phaser.Game(400, 300, Phaser.AUTO, '', null, false, false);

	game.state.add("UpgradeScene", UpgradeScene);

	game.state.add("main", mainScene);
	game.state.add("Level1", Level1);

	game.state.start("UpgradeScene");

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
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.R ]);

	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.E ]);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.Control ]);
}

function loadDefaults() {
	game.load.spritesheet('reticle', 'assets/reticle.png', 15, 15);
	game.load.image("parallax", "assets/Parallax.png");
	game.load.spritesheet("pickables", "assets/pickables.png", 32, 32);
	game.load.image("blackScreen", "assets/blackScreen.png");
	game.load.spritesheet("upgradeIcons", "assets/Upgrades.png", 32, 32);
	game.load.image("blackBox", "assets/blackBox.png");
	game.load.image("getUpgrade", "assets/getUpgrade.png");
	game.load.image("skipUpgrade", "assets/skipUpgrades.png");
	loadWeapons();
	loadEnemies();
	loadLevels();
	loadPlayer();
}

var parallaxSprite;
var style = { font: "12px Courier", stroke: '#000000', strokeThickness: 2, fill: "#fff", tabs: 10 };
var curAI;
function createDefaults() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	game.stage.backgroundColor = '#000000';

    game.physics.startSystem(Phaser.Physics.ARCADE);

	sightLine = new Phaser.Line();

	pickables = game.add.group();
	aigroup = game.add.group();

	var x, y;
	x = getRandomInt(300, 500);
	y = getRandomInt(200, 400);

	player = new Player(game, x, y);
	targeter = game.add.sprite(100, 100, 'reticle');

    targeter.anchor.x = 0.5;
    targeter.anchor.y = 0.5;
	targeter.fixedToCamera = true;

	ammoCount = game.add.text(0, 0, "Ammo:\t", style);
	tag = game.add.text(0, 0, "AI  ", style);
	// triggerDialogue(intro);
	player.ammoCountActive = true;
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

    for (var i = 0; i < aigroup.length; i++) {
		curAI = aigroup.getAt(i);
        if(curAI.exists) aigroup.getAt(i).logic();
        if (aigroup.getAt(i).gun != null) {
            game.physics.arcade.collide(curAI.gun.bullets, map.wallLayer, function(bullet) {
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
	console.log(ai.health);
	if (ai.health <= 0 || isNaN(ai.health)) ai.kill();
}
