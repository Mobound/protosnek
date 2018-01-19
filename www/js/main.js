var cellWidth = 10;
var direction;
var nextDirection;
var food;
var grapes;
var createGrapes = false;
var score;
var snakeArray;
var mazeArray;
var changeDirection = false;
var canvasWidth = 450;
var canvasHeight = 500;
var gameWidth = 450;
var gameHeight = 450;
var bgTile;
var appleImg;
var pineappleImg;
var grapesImg;
var mazeTile;
var verticalDoorTile;
var horizontalDoorTile;
var portalAnimController = 1;
var speed;
var stage;
var startingPos
var appleCounter;
var pineappleCounter;
var grapesTimer;
var lastMoveTs;
var xRatio;
var yRatio;
var tillNextLevel;
var passLevel;

// Possible screens: main-menu, game, game-over
var screenflow = "main-menu";

var myGameArea = {
	canvas : document.getElementById("main"),
	start : function() {
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		
		this.context = this.canvas.getContext("2d");
		
		this.previousSize = {width: this.canvas.width, height: this.canvas.height};
		
		lastMoveTs = new Date().getTime();
		requestAnimationFrame(updateArea);
		window.addEventListener('keydown', function (e) {
			if (!changeDirection) {
				if (e.keyCode == 37 && direction != "right") {
					nextDirection = "left";
					changeDirection = true;
				} else if (e.keyCode == 38 && direction != "down") {
					nextDirection = "up";
					changeDirection = true;
				} else if (e.keyCode == 39 && direction != "left") {
					nextDirection = "right";
					changeDirection = true;
				} else if (e.keyCode == 40 && direction != "up") {
					nextDirection = "down";
					changeDirection = true;
				}
			}
		});
		window.addEventListener('mouseup', function (e) {
			if (screenflow == "main-menu") {
				startGame();
			} else if (screenflow == "game-over") {
				startMenu();
			}
		});
		window.addEventListener('touchstart', function(e) {
			if (screenflow == "main-menu") {
				startGame();
			} else if (screenflow == "game-over") {
				startMenu();
			} else {
				var touchObj = e.changedTouches[0]
				this.startX = touchObj.pageX;
				this.startY = touchObj.pageY;
			
				e.preventDefault();
			}
		});
		window.addEventListener('touchmove', function(e) {
			e.preventDefault();
		});
		window.addEventListener('touchend', function(e) {
			var touchObj = e.changedTouches[0];
			distX = touchObj.pageX - startX;
			distY = touchObj.pageY - startY;
			
			if (Math.abs(distX) >= Math.abs(distY) && direction != "right" && direction != "left"){
				nextDirection = (distX < 0)? "left" : "right";
				changeDirection = true;
			} else if (Math.abs(distY) >= Math.abs(distX) && direction != "up" && direction != "down"){
				nextDirection = (distY < 0)? "up" : "down";
				changeDirection = true;
			}

			e.preventDefault();
		});
	},
	clear : function() {
		this.context.clearRect(0, 0, canvasWidth, canvasHeight);
	}
}

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)}
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)}

function startApp() {
	// loading images
	bgTile = new Image();
	bgTile.src = "img/background-tile.png";
	appleImg = new Image();
	appleImg.src = "img/apple.png";
	pineappleImg = new Image();
	pineappleImg.src = "img/pineapple.png";
	grapesImg = new Image();
	grapesImg.src = "img/grapes.png";
	mazeTile = new Image();
	mazeTile.src = "img/stone-wall.png";
	verticalDoorTile = new Image();
	verticalDoorTile.src = "img/doors-vertical.png";
	horizontalDoorTile = new Image();
	horizontalDoorTile.src = "img/doors-horizontal.png";

	myGameArea.start();
	startMenu();
}

function updateArea() {
	myGameArea.clear();

	// prolly uneeded
	xRatio = myGameArea.canvas.width / myGameArea.previousSize.width;
	yRatio = myGameArea.canvas.height / myGameArea.previousSize.height;

	if (screenflow == "game") {
		updateGameArea(new Date().getTime());
	} else if (screenflow == "main-menu") {
		updateMainMenu();
	} else if (screenflow == "game-over") {
		doGameOver();
	}

	requestAnimationFrame(updateArea);
}