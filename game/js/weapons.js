function loadWeapons() {
	game.load.spritesheet("bullet1", "assets/bullet1.png");
	game.load.spritesheet("debugBullet", "assets/debugBullet.png");
	game.load.spritesheet("invistest", "assets/playercom.png");
	game.load.image("shield1", "assets/shield1.png");
}

function pistol(owner) {
	var newgun = game.add.weapon(100, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 15, 5, true);
	else newgun.trackSprite(owner, 15, 5, true);
	newgun.bullets.setAll('scale.y', 0.25);
	newgun.fireRate = 500;
	newgun.fireRateVariance = 200;
	newgun.bulletSpeed = 450;
	newgun.bulletSpeedVariance = 50;
	newgun.bulletAngleVariance = 1;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.onFire.add(function() {
		shotsFired = true;
	});
	newgun.fireLimit = 8;
	newgun.bullets.setAll('damage', 8);
	newgun.weaponName = "Pistol";

	return newgun;
}

function autorifle(owner) {
	var newgun = game.add.weapon(100, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 15, 5, true);
	else newgun.trackSprite(owner, 15, 5, true);
	newgun.fireRate = 100;
	newgun.bulletSpeed = 400;
	newgun.bulletAngleVariance = 5;
	newgun.bulletSpeedVariance = 50;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.onFire.add(function() {
		shotsFired = true;
	});
	newgun.automatic = true;
	newgun.fireLimit = 30;
	newgun.damage = 10;
	newgun.bullets.setAll('damage', 10);
	newgun.weaponName = "Auto Rifle";

	return newgun;
}

function pulserifle(owner) {
	var newgun = game.add.weapon(100, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 15, 5, true);
	else newgun.trackSprite(owner, 15, 5, true);
	newgun.fireRate = 50;
	newgun.bulletSpeed = 700;
	newgun.bulletAngleVariance = 1;
	newgun.bulletSpeedVariance = 0;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.onFire.add(function() {
		shotsFired = true;
	});
	newgun.multiFire = true;
	newgun.lastBurst = 0;
	newgun.shoot = function () {
		if (this.fireLimit - this.shots <= 0) {
			return null;
		}
		if (Date.now() - this.lastBurst >= 800 && this.shots <= (this.fireLimit - 3)) {
			this.lastBurst = Date.now();
			game.time.events.add(50, function() {
				this.fire();
				this.shots++;
			}, this, this);
			game.time.events.add(100, function() {
				this.fire();
				// this.shots++;
			}, this, this);
			// game.time.events.add(150, function() {
			// 	console.log("fire3");
			// 	console.log(this.fire());
			// 	console.log(this.shots);
			// });
			return true;
		}
		return false;
	}
	newgun.automatic = false;
	newgun.fireLimit = 30;
	newgun.damage = 10;
	newgun.bullets.setAll('damage', 10);
	newgun.type = 'special';
	newgun.weaponName = "Pulse Rifle";

	return newgun;
}

function megaParticleCannon(owner) {
	var newgun = game.add.weapon(900, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 15, 5, true);
	else newgun.trackSprite(owner, 75, 5, true);
	newgun.bullets.setAll('scale.x', 3);
	newgun.fireRate = 0.5;
	// newgun.fireRateVariance = 1;
	newgun.bulletSpeed = 1000;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.fireLimit = 30;
	newgun.multiFire = true;
	newgun.specialFiring = false;
	newgun.shoot = function () {
		console.log(newgun.fireLimit > newgun.shots);
		if (!newgun.specialFiring && newgun.fireLimit > newgun.shots) {
			console.log("fire start");
			newgun.specialFiring = true;
			//start timer
			var scale = 2;
			var fireLoop = game.time.events.loop(50, function() {
				newgun.fire();
				newgun.bullets.setAll('scale.y', scale++, true, true, 0);
			}, this, newgun, scale);
			game.time.events.add(Phaser.Timer.SECOND * 2, function() {
				newgun.specialFiring = false;
				// owner.com.immovable = false;
				game.time.events.remove(fireLoop);
				newgun.bullets.setAll('scale.y', 1);
				console.log("fire over");
			}, this, newgun, fireLoop, owner);
			//spawn blast
		}
		// unlock - reregister inputs?
	}
	newgun.onFire.add(function() {
		shotsFired = true;
	});
	newgun.bullets.setAll('damage', 1000);
	newgun.type = "special";
	newgun.weaponName = "Railgun";

	return newgun;
}

function smg(owner) {
	var newgun = game.add.weapon(25, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 15, 5, true);
	else newgun.trackSprite(owner, 15, 5, true);
	newgun.fireRate = 25;
	newgun.bulletSpeed = 750;
	newgun.bulletSpeedVariance = 150;
	newgun.bulletAngleVariance = 35;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.onFire.add(function() {
		shotsFired = true;
	});
	newgun.fireLimit = 30;
	newgun.bullets.setAll('damage', 15);
	newgun.automatic = true;
	newgun.weaponName = "Submachine Gun";

	return newgun;
}

function shotgun(owner) {
	var shotgun = game.add.weapon(36, "bullet1");
	shotgun.type = 'special';
	if (owner.head !== undefined) shotgun.trackSprite(owner.head, 15, 5, true);
	else shotgun.trackSprite(owner, 15, 5, true);
	shotgun.fireRate = 480;
	shotgun.bulletSpeed = 500;
	shotgun.bulletSpeedVariance = 50;
	shotgun.bulletAngleVariance = 40;
	shotgun.fireLimit = 6;
	shotgun.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
	shotgun.bulletKillDistance = 64;
	shotgun.multiFire = true;
	shotgun.weaponName = "Shot Gun";
	shotgun.shoot = function () {
		if (this.shots === 5) this.fireLimit = 7;
		if (this.fireLimit - this.shots <= 0) {
			return null;
		}
		
		var success = false;

		//insert check for enough bullets to fire full spread
		for (var i = 0; i < 4; i++) {
			if (this.fire()) {
				success = true;
			}
		}
		if (this.shots === 6) this.fireLimit = 6;

		return success;
	}
	shotgun.onFire.add(function() {
		shotsFired = true;
	});
	shotgun.bullets.setAll('damage', 35);

	return shotgun;
}

function sword(owner) {
	var sword = game.add.weapon(1, "debugBullet");
	if (owner.head !== undefined) sword.trackSprite(owner.head, 15, 5, true);
	sword.bullets.setAll('scale.y', 4);
	sword.bullets.setAll('alpha', 0);
	sword.fireRate = 480;
	sword.bulletSpeed = 60;
	// sword.bulletAngleVariance = 10;
	sword.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
	sword.bulletLifespan = 10;
	sword.bullets.setAll('damage', 50);
	sword.weaponName = "Sword";
	sword.type = "melee";

	return sword;
}

var meleeDamage = 3;
function defaultMelee(owner) {
	var punch = game.add.weapon(1, "bullet1");
	if (owner.head !== undefined) punch.trackSprite(owner.head, 15, 5, true);
	else punch.trackSprite(owner, 15, 5, true);
	punch.bullets.setAll('scale.y', 1.5);
	punch.bullets.setAll('scale.x', 0.5);
	punch.fireRate = 240;
	punch.bulletSpeed = 60;
	// punch.bulletAngleVariance = 10;
	punch.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
	punch.bulletLifespan = 5;
	punch.bullets.setAll('damage', meleeDamage);
	punch.bullets.setAll('alpha', 0);
	punch.type = "melee";
	punch.weaponName = /*FALCON*/"Punch";

	return punch;
}

function typhoon(owner) {
	var typhoon = game.add.weapon(36, "bullet1");
	typhoon.type = 'special';
	if (owner.head !== undefined) typhoon.trackSprite(owner.head, 0, 0, true);
	else typhoon.trackSprite(owner, 15, 5, true);
	typhoon.fireRate = 480;
	typhoon.bulletSpeed = 500;
	typhoon.bulletAngleVariance = 360;
	typhoon.fireLimit = 1;
	typhoon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
	typhoon.bulletKillDistance = 256;
	typhoon.multiFire = true;
	typhoon.autoExpandBulletsGroup  = true;
	typhoon.shoot = function () {
		if (typhoon.shots >= 1) return;
		owner.locked = true;
		game.time.slowMotion = 5.0;
		game.time.desiredFps = 300;
		var success = false;

		game.time.events.add(500, function() {
			game.time.events.repeat(5, 125, function() {
				aigroup.forEach(function () {
					if (arguments[0].gun !== undefined) arguments[0].gun.killAll();
				});
			}, this, aigroup);
		}, this, typhoon);

		//insert check for enough bullets to fire full spread

		game.time.events.add(Phaser.Timer.SECOND * 1, function() {
			typhoon.fireLimit = 2;
			for (var i = 0; i < 120; i++) {
				if (typhoon.fire(0, 0)) {
					success = true;
				}
			}
			typhoon.fireLimit = 1;
		}, this, typhoon);
		game.time.events.add(Phaser.Timer.SECOND * 2, function() {
			owner.locked = false;
			game.time.slowMotion = 1;
			game.time.desiredFps = 60;
		}, this, typhoon);

		return success;
	}
	typhoon.onFire.add(function() {
		shotsFired = true;
	});
	typhoon.bullets.setAll('damage', 75);

	return typhoon;
}

function shield(owner) {
	var shield = game.add.sprite();
	shield.shieldOwner = owner;
	shield.logic = function() {
		this.angle += 1;
		this.x = this.shieldOwner.x + Math.sin(this.angle) * 50;
		this.y = this.shieldOwner.y + Math.cos(this.angle) * 50;
	}

	return shield;
}
