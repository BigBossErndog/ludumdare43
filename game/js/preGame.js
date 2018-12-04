var loadbar;
var logInTxt;

var loadTextStyle = { font: "12px Arial", fill: "#ffffff", align: "left" };

var BootScene = {
	preload: function() {
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	},

	create: function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		game.stage.backgroundColor = "#000000";

		loadBar = game.add.graphics();

		logInTxt = game.add.text(25, 260, "Logging into Humanity.", loadTextStyle);
	},

	update: function() {
		game.state.start("loading", false, false);
	}
}

function loadFunction(progress) {
	loadBar.clear();

	loadBar.beginFill(0xffffff, 1);
	loadBar.drawRect(20, 300 - 20, progress * 2, 10);
	loadBar.endFill();
}

var LoadScene = {
	preload: function() {
		loadDefaults();

		game.load.spritesheet("title", "assets/mainMenu/title.png", 400, 300);
		game.load.image("cityBackground", "assets/mainMenu/cityBackground.png");
		game.load.image("glow", "assets/mainMenu/glow.png");

		game.load.image("startBtn", "assets/startBtn.png");
		game.load.image("howToPlayBtn", "assets/howToPlayBtn.png");
		game.load.image("creditsBtn", "assets/creditsBtn.png");

		this.game.load.onFileComplete.add(loadFunction, this);
	},

	create: function() {
		this.counter = 0;
	},

	update: function() {
		this.counter += 1;
		if (this.counter == 60) {
			game.state.start("splashes", true, false);
		}
	}
}

var Splashes = {
	preload: function() {

	},

	create: function() {
		game.state.start("Level2");
	},

	update: function() {

	}
}

var MainMenu = {
	preload: function() {

	},

	create: function() {
		this.justStarted = true;
		this.leaving = false;

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

		this.startBtn = game.add.image(game.width/2, 180, "startBtn");
		this.startBtn.anchor.x = 0.5;
		this.startBtn.anchor.y = 0.5;
		this.startBtn.alpha = 0.3;
		this.startBtn.inputEnabled = true;

		this.howToPlayBtn = game.add.image(game.width/2, 220, "howToPlayBtn");
		this.howToPlayBtn.anchor.x = 0.5;
		this.howToPlayBtn.anchor.y = 0.5;
		this.howToPlayBtn.alpha = 0.3;
		this.howToPlayBtn.inputEnabled = true;

		this.creditsBtn = game.add.image(game.width/2, 260, "creditsBtn");
		this.creditsBtn.anchor.x = 0.5;
		this.creditsBtn.anchor.y = 0.5;
		this.creditsBtn.alpha = 0.3;
		this.creditsBtn.inputEnabled = true;

		this.targetScene = null;
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

		if (!this.leaving) {
			if (this.startBtn.input.justOver(0, 500)) {
				this.startBtn.alpha = 1;
			}
			if (this.startBtn.input.justOut(0, 500)) {
				this.startBtn.alpha = 0.3;
			}

			if (this.howToPlayBtn.input.justOver(0, 500)) {
				this.howToPlayBtn.alpha = 1;
			}
			if (this.howToPlayBtn.input.justOut(0, 500)) {
				this.howToPlayBtn.alpha = 0.3;
			}

			if (this.creditsBtn.input.justOver(0, 500)) {
				this.creditsBtn.alpha = 1;
			}
			if (this.creditsBtn.input.justOut(0, 500)) {
				this.creditsBtn.alpha = 0.3;
			}

			if (!this.justStarted) {
				if (this.startBtn.input.justPressed(0, 500)) {
					upgrades.restart();
					upgradeList = [];
					this.startBtn.alpha = 1;
					this.targetScene = "Level0";
					this.leaving = true;
				}

				if (this.howToPlayBtn.input.justPressed(0, 500)) {
					this.howToPlayBtn.alpha = 1;
					this.targetScene = "howToPlay";
					this.leaving = true;
				}

				if (this.creditsBtn.input.justPressed(0, 500)) {
					this.creditsBtn.alpha = 1;
					this.targetScene = "credits";
					this.leaving = true;
				}
			}
		}
		else {
			if (blackScreen == undefined || blackScreen == null) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 0;
			}
			else {
				if (blackScreen.alpha < 1) {
					blackScreen.alpha += 0.01;
				}
				else {
					blackScreen = null;
					this.justStarted = false;
					game.state.start(this.targetScene, true, false);
				}
			}
		}
	}
}

var Credits = {
	preload:function() {

	},

	create:function() {
		logInTxt = game.add.text(10, 10, "Made By:\n\tErnest Placido\n\tSandy Steele\n\tIain Laird", loadTextStyle);
		logInTxt.text += "\n\nClick to return.";
	},

	update: function() {
		if (game.input.activePointer.justPressed(1000)) {
			game.state.start("mainMenu", true, false);
		}
	}
}

var HowToPlay = {
	preload:function() {

	},

	create:function() {
		logInTxt = game.add.text(10, 10, "Instructions", loadTextStyle);
		logInTxt.text += "\n\tWASD / Arrow Keys - Move";
		logInTxt.text += "\n\tMouse Left Click - Shoot / Attack";
		logInTxt.text += "\n\tE - Drop currently equipped weapon / Pick up weapon.";
		logInTxt.text += "\n\tSpace - Blink (When Blink upgrade is equipped.)";
		logInTxt.text += "\n\tQ - Bullet Explosion (When Bullet Explosion upgrade is equipped.)";
		logInTxt.text += "\n\nClick to return.";
	},

	update: function() {
		if (game.input.activePointer.justPressed(1000)) {
			game.state.start("mainMenu", true, false);
		}
	}
}
