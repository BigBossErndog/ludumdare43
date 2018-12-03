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
		this.healthBar = null;
        this.scannerActive = true;
        this.ammoCountActive = false;
        this.speedActive = false;
        this.blinkActive = false;
        this.typhoonActive = false;
        this.superPunchActive = false;
		
		this.health = 100;
		
		this.addedVelocity = {
			x:0,
			y:0
		}

    	this.com = game.add.sprite(spawnX, spawnY, "playercom");
        this.com.addChild(this.legs = game.add.sprite(0, 0, 'legs'));
        this.com.addChild(this.cape = game.add.sprite(0, 0, "cape"));
        this.com.addChild(this.head = game.add.sprite(0, 0, 'head'));

        this.gun = typhoon(this);

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

        this.com.body.setSize(20, 20, 6, 6);

        this.makeWeaponAnimations();

		this.weaponPickUpButton = false;
		this.shooting = false;
    }

    logic() {
		this.addedVelocity.x = this.addedVelocity.x * 0.8;
		this.addedVelocity.y = this.addedVelocity.y * 0.8;

        this.com.body.velocity.x = this.addedVelocity.x;
        this.com.body.velocity.y = this.addedVelocity.y;

        if (this.gun == null || (this.gun !== 'special' && !this.gun.specialFiring)) {
            if (cursors.left.isDown || wasd.left.isDown)
            {
                this.com.body.velocity.x += -240;
                this.playWalkAnimation();
            }
            if (cursors.right.isDown || wasd.right.isDown)
            {
                this.com.body.velocity.x += 240;
                this.playWalkAnimation();
            }
            if (cursors.up.isDown || wasd.up.isDown) {
                this.com.body.velocity.y += -240;
                this.playWalkAnimation();
            }
            if (cursors.down.isDown || wasd.down.isDown) {
                this.com.body.velocity.y += 240;
                this.playWalkAnimation();
            }

            if (Math.abs(this.com.body.velocity.x) + Math.abs(this.com.body.velocity.y) > 10) {
                angle = Math.atan2(this.com.body.velocity.y, this.com.body.velocity.x) * (180/Math.PI);
            }
            else {
                angle = this.legs.angle;
                this.playStandAnimation();
            }

            var prevAngle = {
                sin:Math.sin(this.legs.angle * (Math.PI/180)),
                cos:Math.cos(this.legs.angle * (Math.PI/180))
            }
            var newAngle = {
                sin:Math.sin(angle * (Math.PI/180)),
                cos:Math.cos(angle * (Math.PI/180))
            }

            prevAngle.sin = (prevAngle.sin - newAngle.sin) * 0.9 + newAngle.sin;
            prevAngle.cos = (prevAngle.cos - newAngle.cos) * 0.9 + newAngle.cos;

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
            capeAngle.sin = (capeAngle.sin - headAngle.sin) * 0.85 + headAngle.sin;
            capeAngle.cos = (capeAngle.cos - headAngle.cos) * 0.85 + headAngle.cos;
            this.cape.angle = Math.atan2(capeAngle.sin, capeAngle.cos) * (180/Math.PI);
        }

		if (game.input.activePointer.isDown)
		{
			if (this.gun != null && (clicked === false || this.gun.automatic)) {
				if (this.gun.type === 'special') {
					if (this.gun.shoot(player)) {
						this.playShootAnimation();
						this.shooting = true;
					}
				}
				else {
					if (this.gun.fire()) {
						this.playShootAnimation();
						this.shooting = true;
					}
				}
				clicked = true;
			}
		}
		if (game.input.activePointer.isUp) {
			if (clicked === true) clicked = false;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.R)) {
			if (this.gun !== null) this.gun.resetShots();
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.E) || game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
			if (!this.weaponPickUpButton) {
				this.weaponPickUpButton = true;

				if (this.gun != null) {
					var newPickable;
					switch (this.gun.weaponName) {
						case "Shot Gun":
							newPickable = shotgunPickable(this.com.x, this.com.y);
							newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
							newPickable.ammo = this.gun.shots;
							break;
						case "Pistol":
							newPickable = pistolPickable(this.com.x, this.com.y);
							newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
							newPickable.ammo = this.gun.shots;
							break;
						case "Submachine Gun":
							newPickable = smgPickable(this.com.x, this.com.y);
							newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
							newPickable.ammo = this.gun.shots;
							break;
						case "Sword":
							newPickable = swordPickable(this.com.x, this.com.y);
							newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
							newPickable.ammo = this.gun.shots;
							break;
						case "Auto Rifle":
							newPickable = autoriflePickable(this.com.x, this.com.y);
							newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
							newPickable.ammo = this.gun.shots;
							break;
					}
					if (newPickable != undefined) {
						newPickable.dropped = true;
						this.gun.destroy();
						this.gun = null;
					}
				}

				var canPickUp = true;
				pickables.forEachExists(function(item) {
					if (canPickUp && item.overlap(player.com)) {
						item.pickUp();
						canPickUp = false;
					}
				});
			}
		}
		else {
			this.weaponPickUpButton = false;
		}

        game.physics.arcade.collide(this.com, map.wallLayer);
		game.physics.arcade.collide(this.com, map.coverLayer);

        if (player.scannerActive) player.scanner(aigroup, pickables, targeter, tag);
        if (player.ammoCountActive) player.ammoCount(ammoCount, player.gun);
    }

	makeWeaponAnimations() {
		var anim;

        anim = this.head.animations.add("stand", [0], 1, false);
        anim = this.head.animations.add("walk", [0,1,0,2], 5, true);

		anim = this.head.animations.add("shotGunShoot", [31,32,33,30], 7, false);
		anim.onComplete.add(function() {
			player.shooting = false;
		}, this);
		anim = this.head.animations.add("shotGunStand", [30], 1, false);

		anim = this.head.animations.add("smgShoot", [41,40], 20, false);
		anim.onComplete.add(function() {
			player.shooting = false;
		}, this);
		anim = this.head.animations.add("smgStand", [40], 1, false);

		anim = this.head.animations.add("swordSwing", [52,53,54,51,50], 15, false);
		anim.onComplete.add(function() {
			player.shooting = false;
		}, this);
		anim = this.head.animations.add("swordStand", [50], 1, false);

		anim = this.head.animations.add("pistolStand", [10], 1, false);
		anim = this.head.animations.add("pistolShoot", [11, 10], 10, false);
		anim.onComplete.add(function() {
			player.shooting = false;
		}, this);
		
		anim = this.head.animations.add("autorifleStand", [60], 1, false);
		anim = this.head.animations.add("autorifleShoot", [61,60], 1, false);
		anim.onComplete.add(function() {
			player.shooting = false;
		}, this);
		
        this.head.animations.play("stand");
    }

	playStandAnimation() {
		this.legs.animations.play("stand");

		if (this.gun == null) {
			this.head.animations.play("stand");
		}
		else if (!this.shooting) {
			switch (this.gun.weaponName) {
				case "Shot Gun":
					this.head.animations.play("shotGunStand");
					break;
				case "Submachine Gun":
					this.head.animations.play("smgStand");
					break;
				case "Sword":
					this.head.animations.play("swordStand");
					break;
				case "Pistol":
					this.head.animations.play("pistolStand");
					break;
				case "Auto Rifle":
					this.head.animations.play("autorifleStand");
					break;
			}
		}
	}

	playWalkAnimation() {
		this.legs.animations.play("walk");

		if (this.gun == null) {
			this.head.play("walk");
		}
	}

	playShootAnimation() {
		if (this.gun != null) {
			switch (this.gun.weaponName) {
				case "Shot Gun":
					this.recoil(700, this.head.angle * (Math.PI/180) + Math.PI);
					this.head.animations.play("shotGunShoot");
					break;
				case "Submachine Gun":
					this.recoil(10, this.head.angle * (Math.PI/180) + Math.PI);
					this.head.animations.play("smgShoot");
					break;
				case "Sword":
					this.recoil(100, this.head.angle * (Math.PI/180));
					this.head.animations.play("swordSwing");
					break;
				case "Pistol":
					this.recoil(10, this.head.angle * (Math.PI/180) + Math.PI);
					this.head.animations.play("pistolShoot");
					break;
				case "Auto Rifle":
					this.recoil(10, this.head.angle * (Math.PI/180) + Math.PI);
					this.head.animations.play("autorifleShoot");
					break;
			}
		}
	}

	recoil(force, direction) {
		this.addedVelocity.x += Math.cos(direction) * force;
		this.addedVelocity.y += Math.sin(direction) * force;
	}

    scanner(aigroup, pickables, targeter, tag) {
        var aigroup = arguments[0], pickables = arguments[1], targeter = arguments[2], tag = arguments[3];
		
    	var closest = null;
    	var targeterBounds = targeter.getBounds();
    	var entityBounds;
    	aigroup.forEachAlive(function () {
    		entityBounds = arguments[0].getBounds();
    		if (Phaser.Rectangle.intersects(targeterBounds, entityBounds)) {
                closest = arguments[0];
                tag.text = /*Add random percentage*/(Math.random() * 100).toFixed(2) + "% AI  ";
            }
    	}, this, [ null ]);
        pickables.forEachExists(function () {
            entityBounds = arguments[0].getBounds();
            if (Phaser.Rectangle.intersects(targeterBounds, entityBounds)) {
                closest = arguments[0];
                tag.text = "[E] " + closest.pickableName + "  ";
            }
        }, this, [ null ]);
        // if (closest !== null && tag.isPickable)
        // else
    	if (closest !== null) {
    		tag.x = closest.x;
    		tag.y = closest.y;
    		tag.visible = true;
    		tag.tagged = closest;
            tag.activated = Date.now();
    	} else if (tag.tagged !== undefined && tag.tagged.alive && (Date.now() - tag.activated < 3500)) {
    		tag.x = tag.tagged.x;
    		tag.y = tag.tagged.y;
    	} else {
    		tag.visible = false;
    	}
    }

    ammoCount(ammoCount, gun) {
        if (gun !== null) ammoCount.setText("Ammo:" + (gun.fireLimit > 0 ? (gun.fireLimit - gun.shots) + "  " : "∞  "));
    	else ammoCount.setText("");
    	ammoCount.x = this.com.x - 10;
    	ammoCount.y = this.com.y + 20;
    }
	
	
	drawHealth() {
		if (this.healthBar != null) {
			this.healthBar.clear();
			
			this.healthBar.beginFill(0xbc1e1e);
			this.healthBar.drawRect(0,0,Math.floor(40*(this.health/100)), 3);
			this.healthBar.endFill();
			
			console.log(this.health);
		}
	}
}
