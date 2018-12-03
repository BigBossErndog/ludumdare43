function pistolPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickables");
	sprite.pickableName = "Pistol  ";
	sprite.animations.add("item", [0], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.drag.x = 400;
	sprite.body.drag.y = 400;

	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;

		this.angle += Math.abs(this.body.velocity.x + this.body.velocity.y)/10;
	}

	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}

		player.gun = pistol(player);
		this.destroy();

		player.gun.shots = this.ammo;

		player.playStandAnimation();
	}

	pickables.add(sprite);

	return sprite;
}

function smgPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickables");
	sprite.pickableName = "SMG  ";
	sprite.animations.add("item", [1], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.drag.x = 400;
	sprite.body.drag.y = 400;

	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;

		this.angle += Math.abs(this.body.velocity.x + this.body.velocity.y)/10;
	}

	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}

		player.gun = smg(player);
		this.destroy();

		player.gun.shots = this.ammo;

		player.playStandAnimation();
	}

	pickables.add(sprite);

	return sprite;
}

function shotgunPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickables");
	sprite.pickableName = "Shotgun  ";
	sprite.animations.add("item", [2], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.drag.x = 400;
	sprite.body.drag.y = 400;

	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;

		this.angle += Math.abs(this.body.velocity.x + this.body.velocity.y)/10;
	}

	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}

		player.gun = shotgun(player);
		this.destroy();

		player.gun.shots = this.ammo;

		player.playStandAnimation();
	}

	pickables.add(sprite);

	return sprite;
}

function swordPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickables");
	sprite.pickableName = "Sword  ";
	sprite.animations.add("item", [3], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.drag.x = 400;
	sprite.body.drag.y = 400;

	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;

		this.angle += Math.abs(this.body.velocity.x + this.body.velocity.y)/10;
	}

	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}

		player.gun = sword(player);
		this.destroy();

		player.gun.shots = this.ammo;

		player.playStandAnimation();
	}

	pickables.add(sprite);

	return sprite;
}


function autoriflePickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickables");
	sprite.pickableName = "Auto Rifle  ";
	sprite.animations.add("item", [4], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.drag.x = 400;
	sprite.body.drag.y = 400;

	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;

		this.angle += Math.abs(this.body.velocity.x + this.body.velocity.y)/10;
	}

	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}

		player.gun = autorifle(player);
		this.destroy();

		player.gun.shots = this.ammo;

		player.playStandAnimation();
	}

	pickables.add(sprite);

	return sprite;
}

function pulseriflePickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickables");
	sprite.pickableName = "Pulse Rifle  ";
	sprite.animations.add("item", [5], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;

	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.drag.x = 400;
	sprite.body.drag.y = 400;

	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;

		this.angle += Math.abs(this.body.velocity.x + this.body.velocity.y)/10;
	}

	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}

	sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}

		player.gun = pulserifle(player);
		this.destroy();

		player.gun.shots = this.ammo;

		player.playStandAnimation();
	}

	pickables.add(sprite);

	return sprite;
}
