function loadLevels() {
	game.load.tilemap("maptest1", "assets/tilemaps/mapTest1.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("spritemap2", "assets/spritemaps/Sprite Map 2.png", 32, 32);
}

function makeLevel(mapdata, imgdata, img) {
	var newmap = game.add.tilemap(mapdata);
	
	newmap.addTilesetImage(imgdata, img);

	var floorLayer = newmap.createLayer("Floor");
	var wallLayer = newmap.createLayer("Walls");
	var coverLayer = newmap.createLayer("Cover");
	var decalsLayer = newmap.createLayer("Decals");

	newmap.setCollisionBetween(0, 255, true, wallLayer);
	newmap.setCollisionBetween(0, 255, true, coverLayer);
	
	newmap.floorLayer = floorLayer;
	newmap.wallLayer = wallLayer;
	newmap.coverLayer = coverLayer;
	newmap.decalsLayer = decalsLayer;

	wallLayer.resizeWorld();

	return newmap;
}
