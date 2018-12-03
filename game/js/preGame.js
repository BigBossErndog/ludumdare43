var loadbar;

var BootScene = {
	preload: function() {
		
	},
	
	create: function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		game.stage.backgroundColor = "#000000";
		
		loadBar = game.add.graphics();
	},
	
	update: function() {
		game.state.start("loading", false, false);
	}
}

function loadFunction(progress) {
	loadBar.clear();
	
	loadBar.beginFill(0xffffff, 1);
	loadBar.drawRect(20, 300 - 20, progress, 10);
	loadBar.endFill();
}

var LoadScene = {
	preload: function() {
		loadDefaults();
		
		game.load.spritesheet("title", "assets/mainMenu/title.png", 400, 300);
		game.load.image("cityBackground", "assets/mainMenu/cityBackground.png");
		game.load.image("glow", "assets/mainMenu/glow.png");
		
		this.game.load.onFileComplete.add(loadFunction, this);
	},
	
	create: function() {
		
	},
	
	update: function() {
		game.state.start("splashes", true, false);
	}
}

var Splashes = {
	preload: function() {
		
	},
	
	create: function() {
		game.state.start("mainMenu");
	},
	
	update: function() {
		
	}
}

var MainMenu = {
	preload: function() {
		
	},
	
	create: function() {
		this.justStarted = true;
		
		this.cityBackground = game.add.image(0, 0, "cityBackground");
		this.glow = game.add.sprite(0, 0, "glow");
		this.logo = game.add.sprite(0, 0, "title");
		this.logo2 = game.add.sprite(0, 0, "title");
		
		this.logo.animations.add("off", [0], 1, false);
		this.logo.play("off");
		this.logo2.animations.add("on", [1], 1, false);
		this.logo2.play("on");
		
		this.flickerCount1 = 0;
		this.flickerCount2 = 0;
		
		targeter = game.add.sprite(100, 100, 'reticle');

		targeter.anchor.x = 0.5;
		targeter.anchor.y = 0.5;
		targeter.fixedToCamera = true;
	},
	
	update: function() {
		targeter.cameraOffset.x = game.input.activePointer.x;
		targeter.cameraOffset.y = game.input.activePointer.y;
		targeter.angle += 10;
		
		if (this.justStarted) {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 1;
			}
			else {
				if (blackScreen.alpha > 0) {
					blackScreen.alpha -= 0.01;
				}
				else {
					blackScreen.destroy();
					blackScreen = null;
					this.justStarted = false;
				}
			}
		}
		
		if (this.flickerCount2 > this.flickerCount1) {
			this.glow.alpha = Math.random();
			this.glow.alpha = (this.glow.alpha - 1) * 0.25 + 1;
			if (this.glow.alpha > 1) {
				this.glow.alpha = 1;
			}
			this.logo2.alpha = this.glow.alpha;
			
			
			this.flickerCount2 = 0;
			this.flickerCount1 = Math.random() * 10;
		}
		this.flickerCount2 += 1;
	}
}