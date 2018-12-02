function loadWeapons() {
	game.load.spritesheet("bullet1", "assets/bullet1.png");
	game.load.spritesheet("railbullet", "assets/bullet1.png");
	game.load.image("shield1", "assets/shield1.png");
}

function pistol(owner) {
	var newgun = game.add.weapon(100, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 25, 5, true);
	else newgun.trackSprite(owner, 25, 5, true);
	newgun.bullets.setAll('scale.y', 0.25);
	newgun.fireRate = 500;
	newgun.fireRateVariance = 200;
	newgun.bulletSpeed = 350;
	newgun.bulletSpeedVariance = 150;
	newgun.bulletAngleVariance = 20;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.fireLimit = 8;
	newgun.weaponName = "Basic Gun";

	return newgun;
}

function autorifle(owner) {
	var newgun = game.add.weapon(100, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 25, 5, true);
	else newgun.trackSprite(owner, 25, 5, true);
	newgun.fireRate = 100;
	newgun.bulletSpeed = 400;
	newgun.bulletAngleVariance = 5;
	newgun.bulletSpeedVariance = 50;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.automatic = true;
	newgun.fireLimit = 60;
	newgun.weaponName = "Autorifle";

	return newgun;
}

//cannot be reloaded. badness ensues
function megaParticleCannon(owner) {
	var newgun = game.add.weapon(900, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 25, 5, true);
	else newgun.trackSprite(owner, 75, 5, true);
	newgun.bullets.setAll('scale.x', 3);
	newgun.bullets.setAll('scale.y', 10);
	newgun.fireRate = 0.5;
	// newgun.fireRateVariance = 1;
	newgun.bulletSpeed = 1000;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.fireLimit = 30;
	newgun.multiFire = true;
	newgun.specialFiring = false;
	newgun.shoot = function () {
		if (!newgun.specialFiring && newgun.fireLimit > newgun.shots) {
			console.log("fire start");
			newgun.specialFiring = true;
			owner.com.immovable = true;
			//lock in place - deregister inputs?
			console.log(game);
			//start timer
			var fireLoop = game.time.events.loop(50, function() {
				newgun.fire();
			}, this, newgun);
			game.time.events.add(Phaser.Timer.SECOND * 2, function() {
				newgun.specialFiring = false;
				owner.com.immovable = false;
				game.time.events.stop(fireLoop);
				console.log("fire over");
			}, this, newgun, fireLoop, owner);
			//spawn blast
		}
		// unlock - reregister inputs?
	}
	newgun.type = "special";
	newgun.weaponName = "Railgun";

	return newgun;
}

function fireCooldown() {
	console.log("cooldown");
}

function smg(owner) {
	var newgun = game.add.weapon(25, "bullet1");
	if (owner.head !== undefined) newgun.trackSprite(owner.head, 25, 5, true);
	else newgun.trackSprite(owner, 25, 5, true);
	newgun.fireRate = 25;
	newgun.bulletSpeed = 750;
	newgun.bulletSpeedVariance = 150;
	newgun.bulletAngleVariance = 35;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.fireLimit = 30;
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
	if (owner.head !== undefined) sword.trackSprite(owner.head, 15, 5, true);
	else sword.trackSprite(owner, 15, 5, true);
	sword.bullets.setAll('scale.y', 5);
	sword.fireRate = 480;
	sword.bulletSpeed = 60;
	// sword.bulletAngleVariance = 10;
	sword.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
	sword.bulletLifespan = 10;
	sword.weaponName = "Sword";
	sword.type = "melee";

	return sword;
}

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
	punch.weaponName = "melee";
	punch.weaponName = /*FALCON*/"Punch";

	return punch;
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
