function loadWeapons() {
	game.load.spritesheet("bullet1", "assets/bullet1.png");
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
