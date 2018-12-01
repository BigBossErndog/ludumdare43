function loadWeapons() {
	game.load.spritesheet("bullet1", "assets/bullet1.png");
}

function basicGun(owner) {
	var newgun = game.add.weapon(20, "bullet1");
	newgun.trackSprite(owner, 0, 0, true);

	return newgun;
}
