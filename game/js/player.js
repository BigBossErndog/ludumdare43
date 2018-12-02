console.log("hello")

function loadPlayer() {
    game.load.spritesheet('head', 'assets/Head.png', 64, 32);
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
        this.gun = null;

    	this.com = game.add.sprite(spawnX, spawnY, "playercom");
        this.com.addChild(this.legs = game.add.sprite(0, 0, 'legs'));
        this.com.addChild(this.cape = game.add.sprite(0, 0, "cape"));
        this.com.addChild(this.head = game.add.sprite(0, 0, 'head'));

    	this.legs.animations.add("walk", [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 20, true);
    	this.legs.animations.add("stand", [0], 1, false);
    	this.legs.animations.play("stand");

        this.legs.anchor.x = 0.5;
        this.legs.anchor.y = 0.5;
        this.cape.anchor.x = 0.5;
        this.cape.anchor.y = 0.5;
        this.head.anchor.x = 0.25;
        this.head.anchor.y = 0.5;
    	this.com.anchor.x = 0.5;
    	this.com.anchor.y = 0.5;

        this.legs.recAngle = this.legs.angle;
        this.cape.recHeadAngle = this.head.angle;

        game.physics.enable(this.head, Phaser.Physics.ARCADE);
        game.physics.enable(this.legs, Phaser.Physics.ARCADE);
    	game.physics.enable(this.com, Phaser.Physics.ARCADE);

        this.com.body.setSize(24, 24, 4, 4);
        
        this.makeWeaponAnimations();
    }

    makeWeaponAnimations() {
        this.head.animations.add("stand", [0], 1, false);
        this.head.animations.add("walk", [0,1,0,2], 5, true);

        this.head.animations.play("walk");
    }

    logic() {
        this.com.body.velocity.x = 0;
        this.com.body.velocity.y = 0;
		
        if (cursors.left.isDown || wasd.left.isDown)
        {
            this.com.body.velocity.x += -240;
            this.legs.animations.play("walk");
        }
         if (cursors.right.isDown || wasd.right.isDown)
        {
            this.com.body.velocity.x += 240;
            this.legs.animations.play("walk");
        }
        if (cursors.up.isDown || wasd.up.isDown) {
            this.com.body.velocity.y += -240;
            this.legs.animations.play("walk");
        }
        if (cursors.down.isDown || wasd.down.isDown) {
            this.com.body.velocity.y += 240;
            this.legs.animations.play("walk");
        }
    
        if (this.com.body.velocity.y != this.com.body.velocity.x || this.com.body.velocity.x != 0) {
            angle = Math.atan2(this.com.body.velocity.y, this.com.body.velocity.x) * (180/Math.PI);
        }
        else {
            angle = this.legs.angle;
            this.legs.animations.play("stand");
        }
    
        var prevAngle = {
            sin:Math.sin(this.legs.angle * (Math.PI/180)),
            cos:Math.cos(this.legs.angle * (Math.PI/180))
        }
        var newAngle = {
            sin:Math.sin(angle * (Math.PI/180)),
            cos:Math.cos(angle * (Math.PI/180))
        }
    
        prevAngle.sin = (prevAngle.sin - newAngle.sin) * 0.8 + newAngle.sin;
        prevAngle.cos = (prevAngle.cos - newAngle.cos) * 0.8 + newAngle.cos;
    
        this.legs.angle = Math.atan2(prevAngle.sin, prevAngle.cos) * (180/Math.PI);
        
		// this.head.rotation = game.physics.arcade.angleToPointer(this.head);
		this.head.angle = Math.atan2((game.input.mousePointer.y + game.camera.y) - this.com.body.y, (game.input.mousePointer.x + game.camera.x) - this.com.body.x) * (180/Math.PI);

		var headAngle = {
			sin:Math.sin(this.head.angle * (Math.PI/180)),
			cos:Math.cos(this.head.angle * (Math.PI/180))
		}
		var capeAngle = {
			sin:Math.sin(this.cape.angle * (Math.PI/180)),
			cos:Math.cos(this.cape.angle * (Math.PI/180))
		}
		capeAngle.sin = (capeAngle.sin - headAngle.sin) * 0.8 + headAngle.sin;
		capeAngle.cos = (capeAngle.cos - headAngle.cos) * 0.8 + headAngle.cos;
		this.cape.angle = Math.atan2(capeAngle.sin, capeAngle.cos) * (180/Math.PI);
		
        game.physics.arcade.collide(this.com, map.wallLayer);
    }
}
