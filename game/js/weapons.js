function loadWeapons() {
	game.load.spritesheet("bullet1", "assets/bullet1.png");
	game.load.image("shield1", "assets/shield1.png");
}

function basicGun(owner) {
	var newGun = game.add.weapon(3, "bullet1");
	newGun.trackSprite(owner, 0, 0, true);
	newGun.fireRate = 100;
	newGun.bulletSpeed = 400;
	newGun.bullKill = Phaser.Weapon.KILL_WORLD_BOUNDS;

	return newGun;
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
