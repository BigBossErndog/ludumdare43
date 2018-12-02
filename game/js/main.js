var game;

window.onload = function() {
	game = new Phaser.Game(400, 300, Phaser.AUTO, '', { preload: preload, create: create, update: update }, false, false);
    console.log(game);
    // game.state.add("mainScene", mainScene);
}

function preload() {
    console.log("preload");
    game.load.spritesheet('head', 'assets/Head.png', 32, 32);
    game.load.spritesheet("cape", "assets/cape.png", 32, 32);
    game.load.spritesheet('legs', 'assets/WalkSprite.png', 32, 32);
    game.load.spritesheet('reticle', 'assets/reticle.png', 15, 15);
	game.load.image("playercom", "assets/playercom.png");
    loadWeapons();
	loadEnemies();
	loadLevels();
}

var player = { com: null, head: null, cape: null, legs: null };
var targeter;
var cursors;

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
	player.com = game.add.sprite(x, y, "playercom");
    player.com.addChild(player.legs = game.add.sprite(0, 0, 'legs'));
    player.com.addChild(player.cape = game.add.sprite(0, 0, "cape"));
    player.com.addChild(player.head = game.add.sprite(0, 0, 'head'));
    targeter = game.add.sprite(100, 100, 'reticle');
    gun = shotgun(player.head);

	player.legs.animations.add("walk", [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 20, true);
	player.legs.animations.add("stand", [0], 1, false);
	player.legs.animations.play("stand");

    targeter.anchor.x = 0.5;
    targeter.anchor.y = 0.5;
    player.legs.anchor.x = 0.5;
    player.legs.anchor.y = 0.5;
    player.cape.anchor.x = 0.5;
    player.cape.anchor.y = 0.5;
    player.head.anchor.x = 0.5;
    player.head.anchor.y = 0.5;
	player.com.anchor.x = 0.5;
	player.com.anchor.y = 0.5;

    player.legs.recAngle = player.legs.angle;
    player.cape.recHeadAngle = player.head.angle;

    game.physics.enable(player.head, Phaser.Physics.ARCADE);
    game.physics.enable(player.legs, Phaser.Physics.ARCADE);
	game.physics.enable(player.com, Phaser.Physics.ARCADE);

	player.com.body.setSize(24, 24, 4, 4);

	// player.legs.body.immovable = true;
	// player.com.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();
    this.wasd = {
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

	game.physics.arcade.overlap(gun.bullets, aigroup, collisionHandler, null, this);

	game.physics.arcade.collide(gun.bullets, map.wallLayer, function(bullet) {
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
    console.log(targeter.x + " : " + targeter.y)
    targeter.x = game.input.activePointer.x;
    targeter.y = game.input.activePointer.y;

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'

    player.com.body.velocity.x = 0;
    player.com.body.velocity.y = 0;

    if (cursors.left.isDown || this.wasd.left.isDown)
    {
        player.com.body.velocity.x += -240;
		player.legs.animations.play("walk");
    }
     if (cursors.right.isDown || this.wasd.right.isDown)
    {
        player.com.body.velocity.x += 240;
		player.legs.animations.play("walk");
    }
    if (cursors.up.isDown || this.wasd.up.isDown) {
        player.com.body.velocity.y += -240;
		player.legs.animations.play("walk");
    }
    if (cursors.down.isDown || this.wasd.down.isDown) {
        player.com.body.velocity.y += 240;
		player.legs.animations.play("walk");
    }

    if (player.com.body.velocity.y != player.com.body.velocity.x || player.com.body.velocity.x != 0) {
        angle = Math.atan2(player.com.body.velocity.y, player.com.body.velocity.x) * (180/Math.PI);
    }
	else {
        angle = player.legs.angle;
		player.legs.animations.play("stand");
    }

    var prevAngle = {
        sin:Math.sin(player.legs.angle * (Math.PI/180)),
        cos:Math.cos(player.legs.angle * (Math.PI/180))
    }
    var newAngle = {
        sin:Math.sin(angle * (Math.PI/180)),
        cos:Math.cos(angle * (Math.PI/180))
    }

    prevAngle.sin = (prevAngle.sin - newAngle.sin) * 0.8 + newAngle.sin;
    prevAngle.cos = (prevAngle.cos - newAngle.cos) * 0.8 + newAngle.cos;

    player.legs.angle = Math.atan2(prevAngle.sin, prevAngle.cos) * (180/Math.PI);

    if (game.input.activePointer.isDown)
    {
		if (clicked === false || gun.automatic) {
			console.log(clicked);
			if (gun.type === 'special') gun.shoot();
			else gun.fire();
			clicked = true;
		}
    }
	if (game.input.activePointer.isUp) {
		if (clicked === true) clicked = false;
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)) {
		gun.shots = 0;
	}

	// player.head.rotation = game.physics.arcade.angleToPointer(player.head);
    player.head.angle = Math.atan2((game.input.mousePointer.y + game.camera.y) - player.com.body.y, (game.input.mousePointer.x + game.camera.x) - player.com.body.x) * (180/Math.PI);

    var headAngle = {
        sin:Math.sin(player.head.angle * (Math.PI/180)),
        cos:Math.cos(player.head.angle * (Math.PI/180))
    }
    var capeAngle = {
        sin:Math.sin(player.cape.angle * (Math.PI/180)),
        cos:Math.cos(player.cape.angle * (Math.PI/180))
    }
    capeAngle.sin = (capeAngle.sin - headAngle.sin) * 0.8 + headAngle.sin;
    capeAngle.cos = (capeAngle.cos - headAngle.cos) * 0.8 + headAngle.cos;
    player.cape.angle = Math.atan2(capeAngle.sin, capeAngle.cos) * (180/Math.PI);

	game.physics.arcade.collide(aigroup);
	game.physics.arcade.collide(aigroup, player.com);

	game.physics.arcade.collide(aigroup, map.wallLayer);
    game.physics.arcade.collide(player.com, map.wallLayer);
    
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
