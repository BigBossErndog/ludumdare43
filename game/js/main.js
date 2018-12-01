var game;

window.onload = function() {
	game = new Phaser.Game(400, 300, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    console.log(game);
    // game.state.add("mainScene", mainScene);
}

function preload() {
    console.log("preload");
    game.load.spritesheet('head', 'assets/Head.png', 32, 32);
    game.load.spritesheet('legs', 'assets/Legs.png', 32, 32);
    game.load.spritesheet('target', 'assets/target.jpg');
	game.load.image("playercom", "assets/playercom.png");
    loadWeapons();
	loadEnemies();
	loadLevels();
}

var player = { com: null, head: null, legs: null };
var targeter;
var cursors;

var gun;
var bulletTime = 0;
var bullets;

var map;

function create() {

    console.log("creating");

	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#dce2e2';

	map = makeLevel("mapTest1", "spritemap2");

    //  This will check Group vs. Group collision (bullets vs. veggies!)
    humans = game.add.group();
	var x, y;
    for (var i = 0; i < 5; i++) {
     	x = getRandomInt(0, 800);
		y = getRandomInt(0, 600);
        humans.add(makeHuman(x, y));
    }

	x = getRandomInt(300, 500);
	y = getRandomInt(200, 400);
	player.com = game.add.sprite(x, y, "playercom");
    player.com.addChild(player.legs = game.add.sprite(0, 0, 'legs'));
    player.com.addChild(player.head = game.add.sprite(0, 0, 'head'));
    targeter = game.add.sprite(0, 0, 'target');
    gun = basicGun(player.head);

    targeter.anchor.x = 0.5;
    targeter.anchor.y = 0.5;
    player.legs.anchor.x = 0.5;
    player.legs.anchor.y = 0.5;
    player.head.anchor.x = 0.5;
    player.head.anchor.y = 0.5;
	player.com.anchor.x = 0.5;
	player.com.anchor.y = 0.5;
    targeter.scale.x = 0.05;
    targeter.scale.y = 0.05;

    game.physics.enable(player.head, Phaser.Physics.ARCADE);
    game.physics.enable(player.legs, Phaser.Physics.ARCADE);
	game.physics.enable(player.com, Phaser.Physics.ARCADE);

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

	game.camera.follow(player.com);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var angle = 0;
var previousAngle = 0;
var previousPreviousAngle = 0;
var fireRate = 0;
var nextFire = 0;

function update() {

    for (var i = 0; i < humans.length; i++) {
        humans.getAt(i).logic();
    }

    targeter.x = game.input.mousePointer.x;
    targeter.y = game.input.mousePointer.y;


    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'

    player.com.body.velocity.x = 0;
    player.com.body.velocity.y = 0;

    if (cursors.left.isDown || this.wasd.left.isDown)
    {
        player.com.body.velocity.x += -300;
    }
     if (cursors.right.isDown || this.wasd.right.isDown)
    {
        player.com.body.velocity.x += 300;
    }
    if (cursors.up.isDown || this.wasd.up.isDown) {
        player.com.body.velocity.y += -300;
    }
     if (cursors.down.isDown || this.wasd.down.isDown) {
        player.com.body.velocity.y += 300;
    }

    if (player.com.body.velocity.y != player.com.body.velocity.x || player.com.body.velocity.x != 0) {
        angle = Math.atan2(player.com.body.velocity.y, player.com.body.velocity.x) * (180/Math.PI);
        player.legs.angle = (angle + previousAngle + previousPreviousAngle) / 3;
    }
    previousAngle = angle;
    previousPreviousAngle = previousAngle;

    if (game.input.activePointer.isDown)
    {
        gun.fire();
    }

	// player.head.rotation = game.physics.arcade.angleToPointer(player.head);
	player.head.angle = Math.atan2(game.input.mousePointer.y - player.com.body.y, game.input.mousePointer.x - player.com.body.x) * (180/Math.PI);

	game.physics.arcade.collide(humans);
	game.physics.arcade.collide(humans, player.com);

	game.physics.arcade.collide(humans, map.wallLayer, printCollision);
	game.physics.arcade.collide(player.com, map.wallLayer, printCollision);
}

function printCollision() {
	console.log("HELLO");
}
