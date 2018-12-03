function loadEnemies() {
	game.load.spritesheet("human", "assets/Head.png", 32, 32);
}

var sightLine;

function makeHuman(x, y, angle) {
	var human = game.add.sprite(x, y, "human");
	human.health = 10;
	human.anchor.x = 0.5;
	human.anchor.y = 0.5;

	game.physics.enable(human, Phaser.Physics.ARCADE);

	human.body.drag.x = 500;
	human.body.drag.y = 500;
	human.body.maxVelocity.set(100);

	human.body.setSize(20, 20, 6, 6);

	if (angle != undefined && angle != null) {
		human.angle = angle;
	}
	else {
		human.angle = Math.random() * 360;
	}

	human.logic = function() {
		if (shotsFired /*this.canSee(player.com, map.wallLayer)*/) {
			this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 40;
			this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 40;
			this.angle = Math.atan2(player.head.body.y - this.body.y, player.head.body.x - this.body.x) * (180/Math.PI);
			this.angle += 180;
		}
	}

	human.canSee = function(other, layer) {
		var success = false;
		sightLine.start.set(this.body.x, this.body.y);
	    sightLine.end.set(other.body.x, other.body.y);

		var tileHits = layer.getRayCastTiles_custom(sightLine, 4, false, true);
	    if (tileHits.length > 0){
	        success = false;
	    }
		else{
	        success = true;
	    }

		if (success) {
			toOtherAngle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x);

			a = Math.atan2(Math.sin(toOtherAngle-this.angle*(Math.PI/180)), Math.cos(toOtherAngle-this.angle*(Math.PI/180))) * (180/Math.PI);
			a = Math.abs(a);

			if (a > 60) {
				success = false;
			}
		}

		return success;
	}
	
	human.faceTowards = function(other) {
		this.angle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x) * (180/Math.PI);
	}

	return human;
}

function makeDefaultEnemy(x, y, angle) {
	var enemy = game.add.sprite(x, y, "human");
	enemy.health = 100;

	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;

	game.physics.enable(enemy, Phaser.Physics.ARCADE);

	enemy.body.drag.x = 500;
	enemy.body.drag.y = 500;
	enemy.body.maxVelocity.set(100);

	enemy.body.setSize(20, 20, 6, 6);

	if (angle != undefined && angle != null) {
		enemy.angle = angle;
	}
	else {
		enemy.angle = Math.random() * 360;
	}

	enemy.gun = null;

	enemy.recPlayerSight = null;

	enemy.logic = function() {
		if (this.canSee(player.com, map.wallLayer)) {
			if (this.recPlayerSight != null) {
				this.recPlayerSight.x = player.com.body.x;
				this.recPlayerSight.y = player.com.body.y;
			}
			else {
				this.recPlayerSight = {
					x:player.com.body.x,
					y:player.com.body.y
				}
			}

			if (this.gun != null) {
				this.gun.resetShots();
				this.gun.fire();
			}
			this.angle = Math.atan2(this.recPlayerSight.y - this.body.y, this.recPlayerSight.x - this.body.x) * (180/Math.PI);
			this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 20;
			this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 20;
		}
		else if (this.recPlayerSight != null) {
			this.angle = Math.atan2(this.recPlayerSight.y - this.body.y, this.recPlayerSight.x - this.body.x) * (180/Math.PI);
			this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 20;
			this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 20;

			let xdiff = Math.abs(this.body.x - this.recPlayerSight.x);
			let ydiff = Math.abs(this.body.y - this.recPlayerSight.y);
			if (xdiff + ydiff < 32) {
				this.recPlayerSight = null;
			}
		}
	}

	enemy.canSee = function(other, layer) {
		var success = false;
		sightLine.start.set(this.body.x, this.body.y);
	    sightLine.end.set(other.body.x, other.body.y);

		var tileHits = layer.getRayCastTiles_custom(sightLine, 4, false, true);
	    if (tileHits.length > 0){
	        success = false;
	    }
		else{
	        success = true;
	    }

		if (success) {
			toOtherAngle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x);

			a = Math.atan2(Math.sin(toOtherAngle-this.angle*(Math.PI/180)), Math.cos(toOtherAngle-this.angle*(Math.PI/180))) * (180/Math.PI);
			a = Math.abs(a);

			if (a > 60) {
				success = false;
			}
		}

		return success;
	}
	
	enemy.faceTowards = function(other) {
		this.angle = Math.atan2(other.body.y - this.body.y, other.body.x - this.body.x) * (180/Math.PI);
	}

	return enemy;
}
