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
		game.state.start("Level0");
	},
	
	update: function() {
		
	}
}