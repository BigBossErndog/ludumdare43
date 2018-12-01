var game;

window.onload = function() {
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    console.log(game);
    // game.state.add("mainScene", mainScene);
}

function preload() {
    console.log("preload");
    game.load.image('head', 'assets/Head.png');
    game.load.image('legs', 'assets/Legs.png');
    game.load.image('target', 'assets/target.jpg')

}

var player = { head: null, legs: null };
var targeter;
var cursors;

var bulletTime = 0;
var bullet;

function create() {

    console.log("creating");
    game.stage.backgroundColor = '#dce2e2';

    //  This will check Group vs. Group collision (bullets vs. veggies!)


    player.legs = game.add.sprite(0, 0, 'legs');
    player.head = game.add.sprite(0, 0, 'head');
    targeter = game.add.sprite(0, 0, 'target');
    targeter.anchor.x = 0.5;
    targeter.anchor.y = 0.5;
    player.legs.anchor.x = 0.5;
    player.legs.anchor.y = 0.5;
    player.head.anchor.x = 0.5;
    player.head.anchor.y = 0.5;
    targeter.scale.x = 0.05;
    targeter.scale.y = 0.05;
    game.physics.enable(player.head, Phaser.Physics.ARCADE);
    game.physics.enable(player.legs, Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    this.wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

var angle = 0;
var previousAngle = 0;
var previousPreviousAngle = 0;

function update() {

    targeter.x = game.input.mousePointer.x;
    targeter.y = game.input.mousePointer.y;

    player.head.rotation = game.physics.arcade.angleToPointer(player.head);

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'

    player.head.body.velocity.x = 0;
    player.head.body.velocity.y = 0;
    player.legs.body.velocity.x = 0;
    player.legs.body.velocity.y = 0;

    if (cursors.left.isDown || this.wasd.left.isDown)
    {
        player.head.body.velocity.x += -300;
        player.legs.body.velocity.x += -300;
    }
     if (cursors.right.isDown || this.wasd.right.isDown)
    {
        player.head.body.velocity.x += 300;
        player.legs.body.velocity.x += 300;
    }
    if (cursors.up.isDown || this.wasd.up.isDown) {
        player.head.body.velocity.y += -300;
        player.legs.body.velocity.y += -300;
    }
     if (cursors.down.isDown || this.wasd.down.isDown) {
        player.head.body.velocity.y += 300;
        player.legs.body.velocity.y += 300;
    }

    if (player.legs.body.velocity.y != player.legs.body.velocity.x || player.legs.body.velocity.x != 0) {
        angle = Math.atan2(player.legs.body.velocity.y, player.legs.body.velocity.x) * (180/Math.PI);
        player.legs.angle = (angle + previousAngle + previousPreviousAngle) / 3;
    }
    previousAngle = angle;
    previousPreviousAngle = previousAngle;
}
