function loadWeapons() {
	game.load.spritesheet("bullet1", "assets/bullet1.png");
	game.load.spritesheet("railbullet", "assets/bullet1.png");
	game.load.image("shield1", "assets/shield1.png");
}

function basicGun(owner) {
	var newgun = game.add.weapon(100, "bullet1");
	newgun.trackSprite(owner, 25, 5, true);
	newgun.fireRate = 100;
	newgun.bulletSpeed = 400;
	newgun.bulletAngleVariance = 5;
	newgun.bulletSpeedVariance = 50;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.automatic = true;
	newgun.fireLimit = 60;

	return newgun;
}

function railgunLaserType(owner) {
	var newgun = game.add.weapon(900, "bullet1");
	newgun.trackSprite(owner, 25, 5, true);
	// newgun.bullets.setAll('scale.x', 10);
	newgun.bullets.setAll('scale.y', 0.25);
	newgun.fireRate = 0.5;
	// newgun.fireRateVariance = 1;
	newgun.bulletSpeed = 3000;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.fireLimit = 20;
	newgun.automatic = true;

	return newgun;
}

function fireCooldown() {
	console.log("cooldown");
}

function smg(owner) {
	var newgun = game.add.weapon(25, "bullet1");
	newgun.trackSprite(owner, 25, 5, true);
	newgun.fireRate = 25;
	newgun.bulletSpeed = 750;
	newgun.bulletSpeedVariance = 150;
	newgun.bulletAngleVariance = 35;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.fireLimit = 30;
	newgun.automatic = true;

	return newgun;
}

function shotgun(owner) {
	var shotgun = game.add.weapon(36, "bullet1");
	shotgun.type = 'special';
	shotgun.trackSprite(owner, 15, 5, true);
	shotgun.fireRate = 480;
	shotgun.bulletSpeed = 500;
	shotgun.bulletSpeedVariance = 50;
	shotgun.bulletAngleVariance = 40;
	shotgun.fireLimit = 6;
	shotgun.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
	shotgun.bulletKillDistance = 64;
	shotgun.multiFire = true;
	shotgun.shoot = function () {
		var success = false;

		//insert check for enough bullets to fire full spread
		for (var i = 0; i < 6; i++) {
			if (shotgun.fire()) {
				success = true;
			}
		}

		return success;
	}

	return shotgun;
}

function sword(owner) {
	var sword = game.add.weapon(1, "bullet1");
	sword.trackSprite(owner, 25, 5, true);
	sword.bullets.setAll('scale.y', 5);
	sword.fireRate = 480;
	sword.bulletSpeed = 75;
	// sword.bulletAngleVariance = 10;
	sword.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
	sword.bulletLifespan = 10;

	return sword;
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
