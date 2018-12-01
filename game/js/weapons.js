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
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

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
	newgun.bulletAngleVariance = 25;
	newgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	newgun.fireLimit = 30;

	return newgun;
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
