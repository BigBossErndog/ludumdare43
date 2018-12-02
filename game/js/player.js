console.log("hello")

function loadPlayer() {
    game.load.spritesheet('head', 'assets/Head.png', 32, 32);
    game.load.spritesheet("cape", "assets/cape.png", 32, 32);
    game.load.spritesheet('legs', 'assets/WalkSprite.png', 32, 32);
    game.load.image("playercom", "assets/playercom.png");
}

class Player {
    constructor(game, spawnX, spawnY) {
        this.com = null;
        this.head = null;
        this.cape = null;
        this.legs = null;

    	this.com = game.add.sprite(spawnX, spawnY, "playercom");
        this.com.addChild(this.legs = game.add.sprite(0, 0, 'legs'));
        this.com.addChild(this.cape = game.add.sprite(0, 0, "cape"));
        this.com.addChild(this.head = game.add.sprite(0, 0, 'head'));

    	player.legs.animations.add("walk", [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 20, true);
    	player.legs.animations.add("stand", [0], 1, false);
    	player.legs.animations.play("stand");

        this.legs.anchor.x = 0.5;
        this.legs.anchor.y = 0.5;
        this.cape.anchor.x = 0.5;
        this.cape.anchor.y = 0.5;
        this.head.anchor.x = 0.5;
        this.head.anchor.y = 0.5;
    	this.com.anchor.x = 0.5;
    	this.com.anchor.y = 0.5;

        this.legs.recAngle = this.legs.angle;
        this.cape.recHeadAngle = this.head.angle;

        game.physics.enable(this.head, Phaser.Physics.ARCADE);
        game.physics.enable(this.legs, Phaser.Physics.ARCADE);
    	game.physics.enable(this.com, Phaser.Physics.ARCADE);

    	this.com.body.setSize(24, 24, 4, 4);
    }
}
