function pistolPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickableItems");
	sprite.animations.add("item", [0], 1, false);
	sprite.animations.play("item");
	
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	sprite.body.drag.x = 1000;
	sprite.body.drag.y = 1000;
	
	this.sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
	}
	
	this.sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}
	
	this.sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}
		
		player.gun = pistol(player);
		this.destroy();
	}
	
	return sprite;
}

function smgPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickableItems");
	sprite.animations.add("item", [1], 1, false);
	sprite.animations.play("item");
	
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	sprite.body.drag.x = 1000;
	sprite.body.drag.y = 1000;
	
	this.sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
	}
	
	this.sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}
	
	this.sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}
		
		player.gun = smg(player);
		this.destroy();
	}
	
	return sprite;
}

function shotgunPickable(x, y) {
	var sprite = game.add.sprite(x, y, "pickableItems");
	sprite.animations.add("item", [2], 1, false);
	sprite.animations.play("item");
	
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	sprite.body.drag.x = 1000;
	sprite.body.drag.y = 1000;
	
	this.sprite.logic = function() {
		game.physics.arcade.collide(this, map.wallLayer);
	}
	
	this.sprite.setVelocity = function(x, y) {
		this.body.velocity.x += x;
		this.body.velocity.y += y;
	}
	
	this.sprite.pickUp = function() {
		if (player.gun != null) {
			player.gun.destroy();
		}
		
		player.gun = shotgun(player);
		this.destroy();
	}
	
	return sprite;
}