function loadEnemies() {
	game.load.spritesheet("human", "assets/human.png", 64, 32);
	game.load.spritesheet("enemy", "assets/enemy.png", 64, 32);
}

var sightLine;

function makeHuman(x, y, angle) {
	var human = game.add.sprite(x, y, "human");
	human.health = 10;
	human.anchor.x = 0.25;
	human.anchor.y = 0.5;
	human.shooting = true;

	human.addedVelocity = {
		x:0,
		y:0
	}

	human.type = "Human";

	game.physics.enable(human, Phaser.Physics.ARCADE);

	human.body.drag.x = 500;
	human.body.drag.y = 500;
	human.body.maxVelocity.set(100);

	human.body.setSize(20, 20, 6, 6);

	human.addAnimations = function() {
		var anim;

		anim = this.animations.add("stand", [0], 1, false);
		anim = this.animations.add("walk", [0,1,0,2], 5, true);

		anim = this.animations.add("shotGunShoot", [31,32,33,30], 7, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("shotGunStand", [30], 1, false);

		anim = this.animations.add("smgShoot", [41,40], 20, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("smgStand", [40], 1, false);

		anim = this.animations.add("swordSwing", [52,53,54,51,50], 15, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("swordStand", [50], 1, false);

		anim = this.animations.add("pistolStand", [10], 1, false);
		anim = this.animations.add("pistolShoot", [11, 10], 10, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("autorifleStand", [60], 1, false);
		anim = this.animations.add("autorifleShoot", [61,60], 20, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("punchStand", [0], 1, false);
		anim = this.animations.add("punch", [70,71,72,73,0], 15, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("pulserifleStand", [80], 1, false);
		anim = this.animations.add("pulserifleShoot", [81,80], 10, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		this.animations.play("stand");
	}
	human.addAnimations();

	if (angle != undefined && angle != null) {
		human.angle = angle;
	}
	else {
		human.angle = Math.random() * 360;
	}

	human.logic = function() {
		this.body.velocity.x = this.addedVelocity.x;
		this.body.velocity.y = this.addedVelocity.y;

		if (shotsFired /*this.canSee(player.com, map.wallLayer)*/) {
			this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 300;
			this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 300;
			this.angle = Math.atan2(player.head.body.y - this.body.y, player.head.body.x - this.body.x) * (180/Math.PI);
			this.angle += 180;
			this.animations.play("walk");
		}

		this.addedVelocity.x = this.addedVelocity.x * 0.8;
		this.addedVelocity.y = this.addedVelocity.y * 0.8;
	}

	human.canSee = function(other, layer) {
		var success = false;
		sightLine.start.set(this.body.x, this.body.y);
	    sightLine.end.set(other.body.x, other.body.y);

		var tileHits = layer.getRayCastTiles_custom(sightLine, 4, false, true);
	    if (tileHits.length > 0){
	        success = false;
	    }
		else{
	        success = true;
	    }

		if (success) {
			toOtherAngle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x);

			a = Math.atan2(Math.sin(toOtherAngle-this.angle*(Math.PI/180)), Math.cos(toOtherAngle-this.angle*(Math.PI/180))) * (180/Math.PI);
			a = Math.abs(a);

			if (a > 60) {
				success = false;
			}
		}

		return success;
	}

	human.faceTowards = function(other) {
		this.angle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x) * (180/Math.PI);
	}

	human.addForce = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	return human;
}

function makeDefaultEnemy(x, y, angle) {
	var enemy = game.add.sprite(x, y, "enemy");
	enemy.health = 100;
	enemy.reloadStart = 0;
	enemy.shooting = false;

	enemy.addedVelocity = {
			x:0,
			y:0
		}

	enemy.type = "Enemy";
	enemy.enemyType = "default";

	enemy.anchor.x = 0.25;
	enemy.anchor.y = 0.5;

	game.physics.enable(enemy, Phaser.Physics.ARCADE);

	enemy.body.drag.x = 500;
	enemy.body.drag.y = 500;
	enemy.body.maxVelocity.set(100);

	enemy.body.setSize(20, 20, 6, 6);

	if (angle != undefined && angle != null) {
		enemy.angle = angle;
	}
	else {
		enemy.angle = Math.random() * 360;
	}

	enemy.gun = null;

	enemy.recPlayerSight = null;

	enemy.addAnimations = function() {
		var anim;

		anim = this.animations.add("stand", [0], 1, false);
		anim = this.animations.add("walk", [0,1,0,2], 5, true);

		anim = this.animations.add("shotGunShoot", [31,32,33,30], 7, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("shotGunStand", [30], 1, false);

		anim = this.animations.add("smgShoot", [41,40], 20, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("smgStand", [40], 1, false);

		anim = this.animations.add("swordSwing", [52,53,54,51,50], 15, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("swordStand", [50], 1, false);

		anim = this.animations.add("pistolStand", [10], 1, false);
		anim = this.animations.add("pistolShoot", [11, 10], 10, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("autorifleStand", [60], 1, false);
		anim = this.animations.add("autorifleShoot", [61,60], 20, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("punchStand", [0], 1, false);
		anim = this.animations.add("punch", [70,71,72,73,0], 15, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("pulserifleStand", [80], 1, false);
		anim = this.animations.add("pulserifleShoot", [81,80], 10, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		this.animations.play("stand");
	}
	enemy.addAnimations();

	enemy.playStandAnimation = function() {
		if (this.gun == null) {
			this.animations.play("stand");
		}
		else if (!this.shooting) {
			switch (this.gun.weaponName) {
				case "Shot Gun":
					this.animations.play("shotGunStand");
					break;
				case "Submachine Gun":
					this.animations.play("smgStand");
					break;
				case "Sword":
					this.animations.play("swordStand");
					break;
				case "Pistol":
					this.animations.play("pistolStand");
					break;
				case "Auto Rifle":
					this.animations.play("autorifleStand");
					break;
				case "Punch":
					this.animations.play("punchStand");
					break;
				case "Pulse Rifle":
					this.animations.play("pulserifleStand");
					break;
			}
		}
	}

	enemy.playShootAnimation = function() {
		if (this.gun != null) {
			switch (this.gun.weaponName) {
				case "Shot Gun":
					this.recoil(700, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("shotGunShoot");
					break;
				case "Submachine Gun":
					this.recoil(10, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("smgShoot");
					break;
				case "Sword":
					this.recoil(100, this.angle * (Math.PI/180));
					this.animations.play("swordSwing");
					break;
				case "Pistol":
					this.recoil(10, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("pistolShoot");
					break;
				case "Auto Rifle":
					this.recoil(10, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("autorifleShoot");
					break;
				case "Punch":
					this.recoil(100, this.angle * (Math.PI/180));
					this.animations.play("punch");
					break;
				case "Pulse Rifle":
					this.recoil(300, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("pulserifleShoot");
					break;
			}
		}
	}

	enemy.recoil = function(force, direction) {
		this.addedVelocity.x += Math.cos(direction) * force;
		this.addedVelocity.y += Math.sin(direction) * force;
	}

	enemy.logic = function() {
		this.body.velocity.x = this.addedVelocity.x;
		this.body.velocity.y = this.addedVelocity.y;

		if (this.canSee(player.com, map.wallLayer)) {
			if (this.recPlayerSight != null) {
				this.recPlayerSight.x = player.com.body.x;
				this.recPlayerSight.y = player.com.body.y;
			}
			else {
				this.recPlayerSight = {
					x:player.com.body.x,
					y:player.com.body.y
				}
			}

			if (this.gun != null) {
				// this.gun.resetShots();
				var fireResult;
				if (this.gun.type == "special") {
					fireResult = this.gun.shoot();
				}
				else {
					fireResult = this.gun.fire();
				}
				if (fireResult == null) {
					if (this.reloadStart === -1) this.reloadStart = Date.now();
					else if (Date.now() - this.reloadStart >= 5000) {
						console.log("reloading");
						this.gun.resetShots();
						this.reloadStart = -1;
					}
				}
				else if (fireResult) {
					this.shooting = true;
					this.playShootAnimation();
				}
			}
			this.angle = Math.atan2(this.recPlayerSight.y - this.body.y, this.recPlayerSight.x - this.body.x) * (180/Math.PI);
			if (player.health > 0) {
				this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 240;
				this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 240;
			}
		}
		else if (this.recPlayerSight != null) {
			this.angle = Math.atan2(this.recPlayerSight.y - this.body.y, this.recPlayerSight.x - this.body.x) * (180/Math.PI);
			if (player.health > 0) {
				this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 240;
				this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 240;
			}

			let xdiff = Math.abs(this.body.x - this.recPlayerSight.x);
			let ydiff = Math.abs(this.body.y - this.recPlayerSight.y);
			if (xdiff + ydiff < 32) {
				this.recPlayerSight = null;
			}
		}

		this.addedVelocity.x = this.addedVelocity.x * 0.8;
		this.addedVelocity.y = this.addedVelocity.y * 0.8;
	}

	enemy.canSee = function(other, layer) {
		var success = false;
		sightLine.start.set(this.body.x, this.body.y);
	    sightLine.end.set(other.body.x, other.body.y);

		var tileHits = layer.getRayCastTiles_custom(sightLine, 4, false, true);
	    if (tileHits.length > 0){
	        success = false;
	    }
		else{
	        success = true;
	    }

		if (success) {
			toOtherAngle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x);

			a = Math.atan2(Math.sin(toOtherAngle-this.angle*(Math.PI/180)), Math.cos(toOtherAngle-this.angle*(Math.PI/180))) * (180/Math.PI);
			a = Math.abs(a);

			if (a > 60) {
				success = false;
			}
		}

		return success;
	}

	enemy.faceTowards = function(other) {
		this.angle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x) * (180/Math.PI);
	}

	enemy.addForce = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	return enemy;
}


function makeUnprovokedEnemy(x, y, angle) {
	var enemy = game.add.sprite(x, y, "enemy");
	enemy.health = 40;
	enemy.reloadStart = 0;
	enemy.shooting = false;

	enemy.addedVelocity = {
			x:0,
			y:0
		}

	enemy.type = "Enemy"
	enemy.enemyType = "unprovoked";

	enemy.provoked = false;

	enemy.anchor.x = 0.25;
	enemy.anchor.y = 0.5;

	game.physics.enable(enemy, Phaser.Physics.ARCADE);

	enemy.body.drag.x = 500;
	enemy.body.drag.y = 500;
	enemy.body.maxVelocity.set(100);

	enemy.body.setSize(20, 20, 6, 6);

	if (angle != undefined && angle != null) {
		enemy.angle = angle;
	}
	else {
		console.log("Someone has a random rotation.");
		enemy.angle = Math.random() * 360;
	}

	enemy.gun = null;

	enemy.recPlayerSight = null;
	
	enemy.dropWeapon = function() {
		var newPickable;
		switch (this.gun.weaponName) {
			case "Shot Gun":
				newPickable = shotgunPickable(this.x, this.y);
				newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
				newPickable.ammo = this.gun.shots;
				break;
			case "Pistol":
				newPickable = pistolPickable(this.x, this.y);
				newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
				newPickable.ammo = this.gun.shots;
				break;
			case "Submachine Gun":
				newPickable = smgPickable(this.x, this.y);
				newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
				newPickable.ammo = this.gun.shots;
				break;
			case "Sword":
				newPickable = swordPickable(this.x, this.y);
				newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
				newPickable.ammo = this.gun.shots;
				break;
			case "Auto Rifle":
				newPickable = autoriflePickable(this.x, this.y);
				newPickable.setVelocity(Math.random() * 500 - 250, Math.random() * 500 - 250);
				newPickable.ammo = this.gun.shots;
				break;
			case "Pulse Rifle":
				newPickable = pulseriflePickable(this.x, this.y);
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

	enemy.addAnimations = function() {
		var anim;

		anim = this.animations.add("stand", [0], 1, false);
		anim = this.animations.add("walk", [0,1,0,2], 5, true);

		anim = this.animations.add("shotGunShoot", [31,32,33,30], 7, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("shotGunStand", [30], 1, false);

		anim = this.animations.add("smgShoot", [41,40], 20, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("smgStand", [40], 1, false);

		anim = this.animations.add("swordSwing", [52,53,54,51,50], 15, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);
		anim = this.animations.add("swordStand", [50], 1, false);

		anim = this.animations.add("pistolStand", [10], 1, false);
		anim = this.animations.add("pistolShoot", [11, 10], 10, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("autorifleStand", [60], 1, false);
		anim = this.animations.add("autorifleShoot", [61,60], 20, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("punchStand", [0], 1, false);
		anim = this.animations.add("punch", [70,71,72,73,0], 15, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		anim = this.animations.add("pulserifleStand", [80], 1, false);
		anim = this.animations.add("pulserifleShoot", [81,80], 10, false);
		anim.onComplete.add(function() {
			this.shooting = false;
		}, this);

		this.animations.play("stand");
	}
	enemy.addAnimations();

	enemy.playStandAnimation = function() {
		if (this.gun == null) {
			this.animations.play("stand");
		}
		else if (!this.shooting) {
			switch (this.gun.weaponName) {
				case "Shot Gun":
					this.animations.play("shotGunStand");
					break;
				case "Submachine Gun":
					this.animations.play("smgStand");
					break;
				case "Sword":
					this.animations.play("swordStand");
					break;
				case "Pistol":
					this.animations.play("pistolStand");
					break;
				case "Auto Rifle":
					this.animations.play("autorifleStand");
					break;
				case "Punch":
					this.animations.play("punchStand");
					break;
				case "Pulse Rifle":
					this.animations.play("pulserifleStand");
					break;
			}
		}
	}

	enemy.playShootAnimation = function() {
		if (this.gun != null) {
			switch (this.gun.weaponName) {
				case "Shot Gun":
					this.recoil(700, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("shotGunShoot");
					break;
				case "Submachine Gun":
					this.recoil(10, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("smgShoot");
					break;
				case "Sword":
					this.recoil(100, this.angle * (Math.PI/180));
					this.animations.play("swordSwing");
					break;
				case "Pistol":
					this.recoil(10, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("pistolShoot");
					break;
				case "Auto Rifle":
					this.recoil(10, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("autorifleShoot");
					break;
				case "Punch":
					this.recoil(100, this.angle * (Math.PI/180));
					this.animations.play("punch");
					break;
				case "Pulse Rifle":
					this.recoil(300, this.angle * (Math.PI/180) + Math.PI);
					this.animations.play("pulserifleShoot");
					break;
			}
		}
	}

	enemy.recoil = function(force, direction) {
		this.addedVelocity.x += Math.cos(direction) * force;
		this.addedVelocity.y += Math.sin(direction) * force;
	}

	enemy.logic = function() {
		this.body.velocity.x = this.addedVelocity.x;
		this.body.velocity.y = this.addedVelocity.y;

		if (this.canSee(player.com, map.wallLayer) && this.provoked) {
			if (this.recPlayerSight != null) {
				this.recPlayerSight.x = player.com.body.x;
				this.recPlayerSight.y = player.com.body.y;
			}
			else {
				this.recPlayerSight = {
					x:player.com.body.x,
					y:player.com.body.y
				}
			}

			if (this.gun != null) {
				// this.gun.resetShots();
				var fireResult;
				if (this.gun.type == "special") {
					fireResult = this.gun.shoot();
				}
				else {
					fireResult = this.gun.fire();
				}
				if (fireResult == null) {
					if (this.reloadStart === -1) this.reloadStart = Date.now();
					else if (Date.now() - this.reloadStart >= 5000) {
						console.log("reloading");
						this.gun.resetShots();
						this.reloadStart = -1;
					}
				}
				else if (fireResult) {
					this.shooting = true;
					this.playShootAnimation();
				}
			}
			this.angle = Math.atan2(this.recPlayerSight.y - this.body.y, this.recPlayerSight.x - this.body.x) * (180/Math.PI);
			if (player.health > 0) {
				this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 240;
				this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 240;
			}
		}
		else if (this.recPlayerSight != null && this.provoked) {
			this.angle = Math.atan2(this.recPlayerSight.y - this.body.y, this.recPlayerSight.x - this.body.x) * (180/Math.PI);
			if (player.health > 0) {
				this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 240;
				this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 240;
			}

			let xdiff = Math.abs(this.body.x - this.recPlayerSight.x);
			let ydiff = Math.abs(this.body.y - this.recPlayerSight.y);
			if (xdiff + ydiff < 32) {
				this.recPlayerSight = null;
			}
		}

		this.addedVelocity.x = this.addedVelocity.x * 0.8;
		this.addedVelocity.y = this.addedVelocity.y * 0.8;
	}

	enemy.canSee = function(other, layer) {
		var success = false;
		sightLine.start.set(this.body.x, this.body.y);
	    sightLine.end.set(other.body.x, other.body.y);

		var tileHits = layer.getRayCastTiles_custom(sightLine, 4, false, true);
	    if (tileHits.length > 0){
	        success = false;
	    }
		else{
	        success = true;
	    }

		if (success) {
			toOtherAngle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x);

			a = Math.atan2(Math.sin(toOtherAngle-this.angle*(Math.PI/180)), Math.cos(toOtherAngle-this.angle*(Math.PI/180))) * (180/Math.PI);
			a = Math.abs(a);

			if (a > 60) {
				success = false;
			}
		}

		return success;
	}

	enemy.faceTowards = function(other) {
		this.angle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x) * (180/Math.PI);
	}

	enemy.addForce = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	return enemy;
}
