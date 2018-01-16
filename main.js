var cellWidth = 10;
var direction;
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
var speed;
var stage;
var appleCounter;
var pineappleCounter;
var grapesTimer;
var lastMoveTs;

// Possible screens: main-menu, game, game-over
var screenflow = "main-menu";

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
		
		this.context = this.canvas.getContext("2d");
		
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		/*
		if (typeof this.interval != "undefined") clearInterval(this.interval);
		this.interval = setInterval(updateArea, 60);
		*/
		lastMoveTs = new Date().getTime();
		requestAnimationFrame(updateArea);
		window.addEventListener('keydown', function (e) {
			if (!changeDirection) {
				if (e.keyCode == 37 && direction != "right") {
					direction = "left";
					changeDirection = true;
				} else if (e.keyCode == 38 && direction != "down") {
					direction = "up";
					changeDirection = true;
				} else if (e.keyCode == 39 && direction != "left") {
					direction = "right";
					changeDirection = true;
				} else if (e.keyCode == 40 && direction != "up") {
					direction = "down";
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

		// TODO add touch controls
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

	myGameArea.start();
	startMenu();
}

function updateArea() {
	myGameArea.clear();

	if (screenflow == "game") {
		updateGameArea(new Date().getTime());
	} else if (screenflow == "main-menu") {
		updateMainMenu();
	} else if (screenflow == "game-over") {
		doGameOver();
	}

	requestAnimationFrame(updateArea);
}
