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
        this.locked = false;
		this.healthBar = null;
        this.scannerActive = false;
        this.ammoCountActive = false;
        this.speedActive = false;
        this.blinkActive = false;
        this.bulletBombActive = false;
        this.superPunchActive = false;

        this.maxHealth = 200;
		this.health = this.maxHealth;

		this.dead = false;

		this.addedVelocity = {
			x:0,
			y:0
		}

    	this.com = game.add.sprite(spawnX, spawnY, "playercom");
        this.com.addChild(this.legs = game.add.sprite(0, 0, 'legs'));
        this.com.addChild(this.cape = game.add.sprite(0, 0, "cape"));
        this.com.addChild(this.head = game.add.sprite(0, 0, 'head'));

        this.gun = defaultMelee(this);

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

		this.recSpace = false;
		
		this.notifTxt = null;
		this.notifCounter = 0;
    }

    logic() {
		if (this.health <= 0) {
			return;
		}
		this.addedVelocity.x = this.addedVelocity.x * 0.8;
		this.addedVelocity.y = this.addedVelocity.y * 0.8;

        this.com.body.velocity.x = this.addedVelocity.x;
        this.com.body.velocity.y = this.addedVelocity.y;

        if (this.gun == null || (!this.locked)) {
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
            if (this.com.body.velocity.x !== 0 && this.com.body.velocity.y !== 0) {
                this.com.body.velocity.x /= Math.sqrt(2);
                this.com.body.velocity.y /= Math.sqrt(2);
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
        } else {
            this.playStandAnimation();
        }

		if (game.input.activePointer.isDown)
		{
			if (this.gun != null && (clicked === false || this.gun.automatic) && !upgrades.blinkRunning) {
				if (this.gun.type === 'special') {
					var fireResult = this.gun.shoot(player);
					
					
					if (fireResult) {
						console.log(this.gun.weaponName)
						this.playShootAnimation();
						this.shooting = true;
						if (this.gun.weaponName != "Sword" && this.gun.weaponName != "Punch") {
							aigroup.forEachExists(function(ai) {
								ai.faceTowards(player.com);
							});
						}
					} else if (this.gun.type !== 'melee' && this.gun.fireLimit <= this.gun.shots && !upgrades.ammoCountActive) {
                        this.noAmmo(ammoCount);
                    }
					
				}
				else {
					var fireResult = this.gun.fire();
					
					if (fireResult) {
						console.log(this.gun.weaponName)
						this.playShootAnimation();
						this.shooting = true;
						if (this.gun.weaponName != "Sword" && this.gun.weaponName != "Punch") {
							aigroup.forEachExists(function(ai) {
								ai.faceTowards(player.com);
							});
						}
					} else if (this.gun.type !== 'melee' && this.gun.fireLimit <= this.gun.shots && !upgrades.ammoCountActive) {
                        this.noAmmo(ammoCount);
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
					this.dropWeapon();
				}

				var canPickUp = true;
				pickables.forEachExists(function(item) {
					if (item.pickableName != "corpse" && canPickUp && item.overlap(player.com)) {
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


		if (!game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.recSpace = false;
		}

        if (upgrades.scannerActive) player.scanner(aigroup, pickables, targeter, tag);
        if (upgrades.ammoCountActive) player.ammoCount(ammoCount, player.gun);
        if (upgrades.blinkActive && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.recSpace) {
			this.recSpace = true;
            if (Date.now() - upgrades.lastBlink >= 10000 && !upgrades.blinkRunning) {
                upgrades.blinkRunning = true;
                game.time.slowMotion = 50.0;
        		game.time.desiredFps = 30000;

        		game.time.events.add(8000, function() {
                    game.time.slowMotion = 1;
                    game.time.desiredFps = 60;
                    upgrades.blinkRunning = false;
                }, this);
            } else if (upgrades.blinkRunning) {
				console.log("Blink Already Active");
				upgrades.blinkRunning = false;
				game.time.slowMotion = 1;
				game.time.desiredFps = 60;
            } else {
				/*flash cooldown somehow*/ console.log("blink on cooldown");
				if (this.notifTxt == null) {
					let style = { font: "12px Arial", fill: "#ffffff", align: "left" };
					this.notifTxt = game.add.text(10, 25, "Blink is still cooling", style);
					this.notifTxt.fixedToCamera = true;
					this.notifTxt.stroke = '#000000';
					this.notifTxt.strokeThickness = 3;
				}
			}
        }

		if (upgrades.blinkActive && upgrades.blinkRunning && game.input.activePointer.justPressed(1000)) {
			//makeGhost(targeter.x, targeter.y);
            player.blink(targeter.x, targeter.y);
		}
        if (upgrades.bulletBombActive && game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
            upgrades.bulletBomb.shoot();
        }

        if (ammoCount.visible) {
        	ammoCount.x = this.com.x - 10;
        	ammoCount.y = this.com.y + 20;
        }
		
		if (this.notifTxt != null) {
			this.notifCounter += 1;
			if (this.notifCounter < 1 * 60) {
				this.notifCounter += 1;
			}
			else {
				this.notifCounter = 0;
				this.notifTxt.destroy();
				this.notifTxt = null;
			}
		}
    }

	dropWeapon() {
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
			case "Pulse Rifle":
				newPickable = pulseriflePickable(this.com.x, this.com.y);
				newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
				newPickable.ammo = this.gun.shots;
				break;
		}
		if (newPickable != undefined) {
			this.playStandAnimation();
			newPickable.dropped = true;
			this.gun.destroy();
			this.gun = defaultMelee(this);
		}
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
		anim = this.head.animations.add("autorifleShoot", [61,60], 20, false);
		anim.onComplete.add(function() {
			player.shooting = false;
		}, this);

		anim = this.head.animations.add("punchStand", [0], 1, false);
		anim = this.head.animations.add("punch", [70,71,72,73,0], 15, false);
		anim.onComplete.add(function() {
			player.shooting = false;
		}, this);

		anim = this.head.animations.add("pulserifleStand", [80], 1, false);
		anim = this.head.animations.add("pulserifleShoot", [81,80], 10, false);
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
				case "Punch":
					this.head.animations.play("punchStand");
					break;
				case "Pulse Rifle":
					this.head.animations.play("pulserifleStand");
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
				case "Punch":
					this.recoil(100, this.head.angle * (Math.PI/180));
					this.head.animations.play("punch");
					break;
				case "Pulse Rifle":
					this.recoil(300, this.head.angle * (Math.PI/180) + Math.PI);
					this.head.animations.play("pulserifleShoot");
					break;
			}
		}
	}

	recoil(force, direction) {
		this.addedVelocity.x += Math.cos(direction) * force;
		this.addedVelocity.y += Math.sin(direction) * force;
	}

    scanner(aigroup, pickables, targeter, tag) {
        tag.visible = true;
    	var closest = null;
    	var targeterBounds = targeter.getBounds();
    	var entityBounds;
    	aigroup.forEachAlive(function () {
    		entityBounds = arguments[0].getBounds();
    		if (Phaser.Rectangle.intersects(targeterBounds, entityBounds)) {
                closest = arguments[0];
                if (tag.tagged !== arguments[0]) {
                    if (closest.type == "Enemy") {
                        if ((Math.random() * 100) <= (upgrades.inhumanity)) tag.text = /*Add random percentage*/" CIVILIAN: " + (Math.random() * upgrades.inhumanity).toFixed(1) + "% CONFIDENCE  ";
                        else tag.text = " AI: 100% CONFIDENCE  ";
                    }
                    else {
                        if ((Math.random() * 100) <= (upgrades.inhumanity)) tag.text = /*Add random percentage*/" AI: " + (Math.random() * upgrades.inhumanity).toFixed(1) + "% CONFIDENCE  ";
                        else tag.text = "CIVILIAN: 100% CONFIDENCE  ";
                    }
                }
            }
    	}, this, [ null ]);
        pickables.forEachExists(function () {
            entityBounds = arguments[0].getBounds();
            if (Phaser.Rectangle.intersects(targeterBounds, entityBounds)) {
                if (arguments[0].pickableName !== 'corpse') {
                    closest = arguments[0];
                    tag.text = "[E] " + closest.pickableName + "  ";
                }
            }
        }, this, [ null ]);
        // if (closest !== null && tag.isPickable)
        // else
    	if (closest !== null) {
    		tag.x = closest.x - 10;
    		tag.y = closest.y + 20;
    		tag.visible = true;
    		tag.tagged = closest;
            tag.activated = Date.now();
    	} else if (tag.tagged !== undefined && tag.tagged.alive && (Date.now() - tag.activated < 3500)) {
    		tag.x = tag.tagged.x - 10;
    		tag.y = tag.tagged.y + 20;
    	} else {
    		tag.visible = false;
    	}
    }

    ammoCount(ammoCount, gun) {
        ammoCount.visible = true;
        if (gun !== null) ammoCount.setText("Ammo:" + (gun.fireLimit > 0 ? (gun.fireLimit - gun.shots) + "  \t\t\t\t\t\t\t\t  " : "N/A  \t\t\t\t\t\t  "));
    	else ammoCount.setText("");
    	// ammoCount.x = this.com.x - 10;
    	// ammoCount.y = this.com.y + 20;
    }

    noAmmo(ammoCount) {
        console.log("no ammo");
        ammoCount.visible = true;
        ammoCount.setText("Out of Rounds");
        // ammoCount.style = shortStyle;
    	// ammoCount.x = this.com.x - 10;
    	// ammoCount.y = this.com.y + 20;
        game.time.events.add(200, function() {
            ammoCount.visible = false;
            // ammoCount.style = longStyle;
        }, this, ammoCount);
    }

    blink(targetx, targety) {
        let requestedDistance = Math.sqrt(Math.pow(targetx - this.com.x, 2) + Math.pow(targety - this.com.y, 2));
        if (requestedDistance > 240) {
            targetx *= (240 / requestedDistance);
            targety *= (240 / requestedDistance);
        }
        sightLine.start.set(this.com.x, this.com.y);
        sightLine.end.set(targetx, targety);

        var hits = map.wallLayer.getRayCastTiles_custom(sightLine, 4, false, true);
        hits = hits.concat(map.coverLayer.getRayCastTiles_custom(sightLine, 4, false, true));
        if (hits.length === 0) {
            player.com.x = targetx;
            player.com.y = targety;
            upgrades.lastBlink = Date.now();
            upgrades.blinkRunning = false;
            game.time.slowMotion = 1;
            game.time.desiredFps = 60;
        } else console.log("obstruction");
    }

	drawHealth() {
		if (this.healthBar != null) {
			this.healthBar.clear();

			this.healthBar.beginFill(0xbc1e1e);
			this.healthBar.drawRect(0,0,Math.floor(40*(this.health/this.maxHealth)), 3);
			this.healthBar.endFill();
		}
	}
}

function createCorpse(person, anim) {
	var corpse = game.add.sprite(person.x, person.y, anim);
	corpse.anchor.x = 0.75;
	corpse.anchor.y = 0.5;
	corpse.pickableName = "corpse";

	game.physics.enable(corpse, Phaser.Physics.ARCADE);

	corpse.angle = person.angle;
	corpse.body.drag.x = 600;
	corpse.body.drag.y = 600;

	corpse.body.velocity.x = Math.cos(corpse.angle * (Math.PI/180) + Math.PI) * 300;
	corpse.body.velocity.y = Math.sin(corpse.angle * (Math.PI/180) + Math.PI) * 300;

	corpse.animations.add("die", [0,1,2,3], 10, false);
	corpse.play("die");

	corpse.logic = function() {

	}

	pickables.add(corpse);

	return corpse;
}

function makeGhost(targetx, targety) {
	console.log("hello")
	for (var i = 0; i < 5; i++) {
		var xtotal = player.com.x + targetx * i;
		var ytotal = player.com.y + targety * i;

		var ghost = game.add.sprite(xtotal / (i + 1), ytotal / (i + 1), "head");
		ghost.anchor.x = 0.25;
		ghost.anchor.y = 0.5;
		ghost.angle = player.head.angle;
		ghost.tryalpha = i+1/6;
		ghost.alpha = ghost.tryalpha;
		ghost.pickableName = "ghost";

		ghost.logic = function() {
			if (this.tryalpha > 0) {
				this.tryalpha -= 0.02;
				if (this.tryalpha > 0) {
					this.alpha = this.tryalpha;
				}
				else {
					this.destroy();
				}
			}
			else {
				this.destroy();
			}
		}

		pickables.add(ghost);
	}
}
