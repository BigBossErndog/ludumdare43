var game;

window.onload = function() {
	game = new Phaser.Game(400, 300, Phaser.AUTO, '', null, false, false);

	game.state.add("main", mainScene);
	game.state.start("main");

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
}

var parallaxSprite;
var style = { font: "12px Courier", stroke: '#000000', strokeThickness: 2, fill: "#fff", tabs: 10 };
function createDefaults() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	game.stage.backgroundColor = '#dce2e2';

    game.physics.startSystem(Phaser.Physics.ARCADE);

	sightLine = new Phaser.Line();

	var x, y;
	x = getRandomInt(300, 500);
	y = getRandomInt(200, 400);

	player = new Player(game, x, y);
	targeter = game.add.sprite(100, 100, 'reticle');
    player.gun = shotgun(player.head);

	aigroup = game.add.group();
	var spawnPoints = [ [30,40], [60,70], [100, 50], [550, 370], [190, 500] ];
    for (var i = 0; i < 5; i++) {
		let newEnemy = makeDefaultEnemy(spawnPoints[i][0], spawnPoints[i][1]);
		newEnemy.gun = autorifle(newEnemy);
        aigroup.add(newEnemy);
    }

    targeter.anchor.x = 0.5;
    targeter.anchor.y = 0.5;
	targeter.fixedToCamera = true;

	ammoCount = game.add.text(0, 0, "Ammo:\t", style);
	tag = game.add.text(0, 0, "AI  ", style);
	// triggerDialogue(intro);
}

function updateDefaults() {
	parallaxSprite.cameraOffset.x = game.camera.x / 2;
	parallaxSprite.cameraOffset.y = game.camera.y / 2;

	game.physics.arcade.collide(player.gun.bullets, aigroup, collisionHandler, null, this);

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

	ammoCount.setText("Ammo:" + (player.gun.fireLimit > 0 ? (player.gun.fireLimit - player.gun.shots) + "  " : "∞  "));
	ammoCount.x = player.com.x - 10;
	ammoCount.y = player.com.y + 15;
	player.scanner(aigroup, targeter, tag);
}

var player;
var targeter;
var cursors;
var wasd;

var gun;
var bulletTime = 0;
var bullets;

var map;

var ammoCount;
var tag;

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
	console.log(ai.health);
	if (ai.health <= 0) ai.kill();
}
