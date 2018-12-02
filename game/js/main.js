var game;

window.onload = function() {
	game = new Phaser.Game(400, 300, Phaser.AUTO, '', { preload: preload, create: create, update: update }, false, false);
    console.log(game);
    // game.state.add("mainScene", mainScene);
}

function preload() {
    console.log("preload");
	game.load.spritesheet('reticle', 'assets/reticle.png', 15, 15);
    loadWeapons();
	loadEnemies();
	loadLevels();
	loadPlayer();
}

var player;
var targeter;
var cursors;
var wasd;

var gun;
var bulletTime = 0;
var bullets;

var map;

function create() {

	sightLine = new Phaser.Line();

    console.log("creating");

	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    game.physics.startSystem(Phaser.Physics.ARCADE);
	
    game.stage.backgroundColor = '#dce2e2';

	map = makeLevel("mapTest1", "spritemap2");

    aigroup = game.add.group();
	var spawnPoints = [ [30,40], [60,70], [100, 50], [550, 370], [190, 500] ];
    for (var i = 0; i < 5; i++) {
		let newEnemy = makeDefaultEnemy(spawnPoints[i][0], spawnPoints[i][1]);
		newEnemy.gun = basicGun(newEnemy);
        aigroup.add(newEnemy);
    }

	var x, y;
	x = getRandomInt(300, 500);
	y = getRandomInt(200, 400);
	player = new Player(game, x, y);
	targeter = game.add.sprite(100, 100, 'reticle');
    player.gun = shotgun(player.head);

    targeter.anchor.x = 0.5;
    targeter.anchor.y = 0.5;
	targeter.fixedToCamera = true;

	// player.legs.body.immovable = true;
	// player.com.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();
    wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.R ]);
}

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

function update() {

	game.physics.arcade.overlap(player.gun.bullets, aigroup, collisionHandler, null, this);

	game.physics.arcade.collide(player.gun.bullets, map.wallLayer, function(bullet) {
		bullet.kill();
	});

    for (var i = 0; i < aigroup.length; i++) {
        if(aigroup.getAt(i).exists) aigroup.getAt(i).logic();
        if (aigroup.getAt(i).gun != null) {
            game.physics.arcade.collide(aigroup.getAt(i).gun.bullets, map.wallLayer, function(bullet) {
                bullet.kill();
            });
        }
    }
    
    targeter.cameraOffset.x = game.input.activePointer.x;
    targeter.cameraOffset.y = game.input.activePointer.y;
    targeter.angle += 10;

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'

	player.logic();

    if (game.input.activePointer.isDown)
    {
		if (clicked === false || player.gun.automatic) {
			console.log(clicked);
			if (player.gun.type === 'special') player.gun.shoot(player);
			else player.gun.fire();
			clicked = true;
		}
    }
	if (game.input.activePointer.isUp) {
		if (clicked === true) clicked = false;
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)) {
		gun.shots = 0;
	}

	game.physics.arcade.collide(aigroup);
	game.physics.arcade.collide(aigroup, player.com);

	game.physics.arcade.collide(aigroup, map.wallLayer);

    let mouseDistanceToCenter = Phaser.Math.distance(game.input.activePointer.x, game.width/2, game.input.activePointer.y, game.height/2);
    let newcam = {
        x: player.com.x + Math.cos(player.head.rotation) * mouseDistanceToCenter * 0.4,
        y: player.com.y + Math.sin(player.head.rotation) * mouseDistanceToCenter * 0.4
    }

    let oldcam = {
        x:recCam.x,
        y:recCam.y
    }

    recCam.x = (oldcam.x - newcam.x) * 0.9 + newcam.x;
    recCam.y = (oldcam.y - newcam.y) * 0.9 + newcam.y;

    game.camera.focusOnXY(recCam.x, recCam.y);
}

function collisionHandler(bullet, ai) {
	bullet.kill();
	ai.kill();
}
