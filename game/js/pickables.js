function pistolPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickables");
	sprite.animations.add("item", [0], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	
	game.physics.enable(sprite, Phaser.Physics.ARCADE);
	
	sprite.body.drag.x = 1000;
	sprite.body.drag.y = 1000;
	
	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;
	}
	
	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
		
		this.angle += (this.body.velocity.x + this.body.velocity.y)/1000;
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
	sprite.animations.add("item", [1], 1, false);
	sprite.animations.play("item");
	sprite.ammo = null;
	sprite.dropped = false;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	
	game.physics.enable(sprite, Phaser.Physics.ARCADE);
	
	sprite.body.drag.x = 1000;
	sprite.body.drag.y = 1000;
	
	sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
		this.dropped = false;
	}
	
	sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
		
		this.angle += (this.body.velocity.x + this.body.velocity.y)/1000;
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
		this.body.velocity.x = x;
		this.body.velocity.y = y;
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