/*****************************************************
*	Designed and programmed by Mohamed Adam Chaieb.
*****************************************************/

function GraphicsManager() {
	// Some convenient renames and constants
	var Point = Isomer.Point;
	var Path = Isomer.Path;
	var Shape = Isomer.Shape;
	var Color = Isomer.Color;
	//some constants
	var squareSide = 3;
	var gridSize = 4;
	var thickness = 0.15;
	var boardcolors = [new Color(32,32,32), new Color(0,0,0)];
	var progression = [new Color(226,208,169), new Color(247,223,177), new Color(228,125,173), new Color(111,125,173),
				   	   new Color(111,225,118), new Color(179,238,93), new Color(95,241,124), new Color(0,249,138),
				       new Color(0,249,255), new Color(208,21,139), new Color(95,241,9)];

	this.iso = new Isomer(document.getElementById("game"));

	this.drawBoard = function() {
		//add board
		this.iso.add(Shape.Prism(Point(0-thickness,0-thickness,0), 4*squareSide, 4*squareSide, thickness));
		//initialize the squares
		for (var i = 3; i >= 0; i--) {
			for (var j = 3; j >= 0; j--) {
				this.iso.add(new Path([Point(i*squareSide, j*squareSide, 0), 
					Point(i*squareSide+squareSide, j*squareSide, 0),
					Point(i*squareSide+squareSide, j*squareSide+squareSide, 0),
					Point(i*squareSide, j*squareSide+squareSide, 0)]), boardcolors[(i+j)%2]);
			};
		};
	};

	this.makeTile3D = function(tile) {
		return Shape.Prism(Point(tile.x*squareSide,tile.y*squareSide), squareSide, squareSide, thickness);
	};

	this.drawTiles = function(grid) {
		this.iso.canvas.clear();
		this.drawBoard();
		for (var i = grid.tiles.length-1 ; i >= 0 ; i--) {
			if(grid.tiles[i])
				this.iso.add(this.makeTile3D(grid.tiles[i]),progression[grid.tiles[i].level]);
		};
	};

	//constructs movement arrays and calls translation function
	this.updateTiles = function(grid) {
		var gridCells = [];
		var newXs = [];
		var newYs = [];
		for (var i = 0; i < grid.moveMap.length; i++) {
			if(grid.moveMap[i]) {
				gridCells.push(grid.moveMap[i].tile);
				newXs.push(grid.moveMap[i].newPos%gridSize);
				newYs.push(Math.floor(grid.moveMap[i].newPos/gridSize));
			};
		};
		this.translateTiles(gridCells, newXs, newYs);
	};

	// ISSUE seems to stop animation a little too early
	// dynamically moves a tiles from positions (x,y) to positions (newX, newY)
	this.translateTiles = function(tiles,newXs,newYs) {
		var self = this;
		var dxs = [];
		var dys = [];
		var tile3Ds = [];
		var refreshes = 12;
		var c = 0;
		for (var i = 0; i < tiles.length; i++) {
			tile3Ds[i] = this.makeTile3D(tiles[i]);
			dxs[i] = 0;
			dys[i] = 0;
		};
		var id = setInterval(function() {
			self.iso.canvas.clear();
			self.drawBoard();
			console.log("YOLO it's working!");
			for (var i = 0; i < tiles.length; i++) {
				self.iso.add(tile3Ds[i].translate(dxs[i],dys[i],0), progression[tiles[i].level]);
				dxs[i] += (newXs[i]-tiles[i].x)/refreshes;
				dys[i] += (newYs[i]-tiles[i].y)/refreshes;
			};
			c++;
			if(c == refreshes*3 + 1) {
				//redraw the tiles properly
				clearInterval(id);
			}
		}, 1);
	};
};