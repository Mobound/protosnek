function startGame() {
	screenflow = "game";
	score = 0;
	stage = 0;
	
	generateLevel();
	createFood("apple");
}

function createSnake() {
	var length = 5;
	snakeArray = [];
	
	for(var i = startingPos.x; i > startingPos.x - length; i--) {
		snakeArray.push({x: i, y: startingPos.y});
	}
}

function createFood(type) {
	food = {
		x: Math.round(Math.random()*(gameWidth - cellWidth) / cellWidth),
		y: Math.round(Math.random()*(gameHeight - cellWidth) / cellWidth),
		type: type,
	};
	while (checkCollision(food.x, food.y, snakeArray, false) || checkCollision(food.x, food.y, mazeArray, false)) {
		food = {
			x: Math.round(Math.random()*(gameWidth - cellWidth) / cellWidth),
			y: Math.round(Math.random()*(gameHeight - cellWidth) / cellWidth),
			type: type,
		};
	}
	
	if (type == "apple") {
		appleCounter++;
		if (appleCounter == 5) {
			appleCounter = 0;
			createFood("pineapple");
		}
	} else if (type == "pineapple") {
		pineappleCounter++;
		if (pineappleCounter == 2) {
			pineappleCounter = 0;
			createGrapes = true;
		}
	} else if (type == "grapes") {
		grapesTimer = new Date().getTime();
		grapes = {
			x: Math.round(Math.random()*(gameWidth - cellWidth) / cellWidth),
			y: Math.round(Math.random()*(gameHeight - cellWidth) / cellWidth),
			type: "grapes",
		};
		while (checkCollision(grapes.x, grapes.y, snakeArray, false) || checkCollision(grapes.x, grapes.y, mazeArray, false)
				|| (grapes.x == food.x && grapes.y == food.y)) {
			grapes = {
				x: Math.round(Math.random()*(gameWidth - cellWidth) / cellWidth),
				y: Math.round(Math.random()*(gameHeight - cellWidth) / cellWidth),
				type: "grapes",
			};
		}
	}
}

function updateGameArea(timestamp) {
	// Renders background
	renderBackground();

	if (timestamp - lastMoveTs > 1000 / speed) {
		lastMoveTs = timestamp;
		var newX = snakeArray[0].x;
		var newY = snakeArray[0].y;

		if (changeDirection) {
			changeDirection = false;
			direction = nextDirection;
		}
		
		if (direction == "right") {newX++; }
		else if (direction == "left") {newX--; }
		else if (direction == "up") {newY--;}
		else if (direction == "down") {newY++; }
		
		// makes the snake reappears at the other side
		if (newX == -1) {
			newX += gameWidth / cellWidth
		} else if (newX == gameWidth / cellWidth) {
			newX = 0;
		} else if (newY == -1) {
			newY += gameHeight / cellWidth;
		} else if (newY == gameHeight / cellWidth) {
			newY = 0;
		}
		
		if (checkCollision(newX, newY, snakeArray, true) || checkCollision(newX, newY, mazeArray, true)) {
			screenflow = "game-over";
			return;
		}
		
		if (passLevel) {
			generateLevel();
			return;
		}

		if(newX == food.x && newY == food.y) {
			var tail = {x: newX, y: newY};
			score++;
			tillNextLevel--;
			if (food.type == "pineapple") {
				speed += 2;
				score += 4;
				tillNextLevel -= 4;
				if (createGrapes) {
					createGrapes = false;
					createFood("grapes");
				}
			}
			
			createFood("apple");
		} else if (grapes != null && newX == grapes.x && newY == grapes.y) {
			grapes = null;
			grapesTimer = 0;
			var tail = {x: newX, y: newY};
			speed = speed - 3;
			score += 5;
			tillNextLevel -= 5;
		} else {
			var tail = snakeArray.pop();
			tail.x = newX; tail.y = newY;
		}
		
		snakeArray.unshift(tail);
	}

	// renders the snake
	for (var i = 0; i < snakeArray.length; i++) {
		var cell = snakeArray[i];
		var part;
		if (i == 0) {
			part = "head-" + direction;
		} else if (i < snakeArray.length - 1) {
			part = "body-";
			
			var cellBefore = snakeArray[i-1];
			var cellAfter = snakeArray[i+1];
			var directionFrom = previousDirection(cell.x, cell.y, cellBefore.x, cellBefore.y);
			var directionTo = previousDirection(cell.x, cell.y, cellAfter.x, cellAfter.y);
			
			if (directionFrom == "up" || directionFrom == "down") {
				if (directionTo == "up" || directionTo == "down") {
					part += "vertical"
				} else  {
					part += directionTo + "-" + directionFrom;
				}
			} else {
				if (directionTo == "up" || directionTo == "down") {
					part += directionFrom + "-" + directionTo;
				} else  {
					part += "horizontal"
				}
			}
		} else {
			part = "tail-" + previousDirection(snakeArray[i-1].x, snakeArray[i-1].y, cell.x, cell.y);
		}
		
		paintCell(cell.x, cell.y, "snake", part);
	}
	
	// renders the food
	paintCell(food.x, food.y, food.type, '');
	if (timestamp - grapesTimer < 20000) {
		paintCell(grapes.x, grapes.y, grapes.type, '');
	}
	
	// renders the maze
	for (var i = 0; i < mazeArray.length; i++) {
		var cell = mazeArray[i];
		
		paintCell(cell.x, cell.y, cell.type, '');
	}
	
	// Draws the score
	var scoreText = "Score: " + score;
	
	myGameArea.context.fillStyle = "white";
	myGameArea.context.fillRect(0, gameHeight, gameWidth, 50);
	myGameArea.context.strokeStyle = "black";
	myGameArea.context.strokeRect(0, gameHeight, gameWidth, 50);
	myGameArea.context.fillStyle = "black";
	myGameArea.context.fillText(scoreText, 5, canvasHeight - 5);
}

function renderBackground() {
	for (i = 0; i < gameWidth / cellWidth; i++) {
		for (j = 0; j < gameHeight / cellWidth; j++) {
			myGameArea.context.drawImage(bgTile, i * cellWidth, j * cellWidth, cellWidth, cellWidth);
		}
	}
}

function paintCell(x, y, cellType, part) {
	if (cellType == "snake") {
		var image = new Image();
		image.src = "img/snake-" + part + ".png";
		
		myGameArea.context.drawImage(image, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	} else if (cellType == "apple") {
		myGameArea.context.drawImage(appleImg, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	} else if (cellType == "pineapple") {
		myGameArea.context.drawImage(pineappleImg, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	} else if (cellType == "grapes") {
		myGameArea.context.drawImage(grapesImg, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	} else if (cellType == "maze") {
		myGameArea.context.drawImage(mazeTile, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	} else if (cellType == "doors-vertical") {
		if (tillNextLevel > 0) {
			myGameArea.context.drawImage(verticalDoorTile, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		} else {
			var image = new Image();
			image.src = "img/portal-vertical-" + portalAnimController++ + ".png";
			myGameArea.context.drawImage(image, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		}
	} else if (cellType == "doors-horizontal") {
		if (tillNextLevel > 0) {
			myGameArea.context.drawImage(horizontalDoorTile, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		} else {
			var image = new Image();
			image.src = "img/portal-vertical-" + portalAnimController++ + ".png";
			myGameArea.context.drawImage(image, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		}
	}

	if (portalAnimController > 2) {
		portalAnimController = 1;
	}
}

function checkCollision(x, y, array, isSnake) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == x && array[i].y == y) {
			if (!array[i].type || (array[i].type != "doors-vertical" && array[i].type != "doors-horizontal") || tillNextLevel > 0) {
				return true;
			}
			if (isSnake && (array[i].type == "doors-vertical" || array[i].type == "doors-horizontal") && tillNextLevel <= 0) {
				passLevel = true;
			}
		}
	}
	
	return false;
}

function generateLevel() {
	appleCounter = 0;
	pineappleCounter = 0;
	grapesTimer = 0;
	createGrapes = false;
	grapes = null;
	passLevel = false;
	mazeArray = [];
	// 'x' for walls, 'o' for empty spaces, 'v' for vertical doors, 'h' for horizontal doors, 's' for spikes
	levelData = window[("level" + ++stage)]().split("|");
	
	for(var i = 0; i < levelData.length; i++) {
		for(var j = 0; j < levelData[i].length; j++)  {
			if (levelData[i].charAt(j) == 'x') {
				mazeArray.push({x: j, y: i, type: "maze"});
			} else  if (levelData[i].charAt(j) == 'v') {
				mazeArray.push({x: j, y: i, type: "doors-vertical"});
			} else  if (levelData[i].charAt(j) == 'h') {
				mazeArray.push({x: j, y: i, type: "doors-horizontal"});
			}
		}
	}

	createSnake();
}
/* older level design
function generateLevel() {
	mazeArray = [];
	
	for(var i = 3; i < 41; i++) {
		mazeArray.push({x: i, y: 0});
		mazeArray.push({x: i, y: 44});
		mazeArray.push({x: 0, y: i});
		mazeArray.push({x: 44, y: i});
	}
	
	for(var i = 4; i < 41; i++)  {
		mazeArray.push({x: i, y: 22});
		mazeArray.push({x: 22, y: i});
	}
	
	
	for(var i = 1; i < 19; i++)  {
		mazeArray.push({x: i, y: 11});
		mazeArray.push({x: 33, y: i});
		mazeArray.push({x: i + 25, y: 33});
		mazeArray.push({x: 11, y: i + 25});
	}
}
*/
function previousDirection(oldX, oldY, newX, newY) {
	if (oldX == newX) {
		if (oldY < newY) {
			return "down";
		} else {
			return "up";
		}
	}
	if (oldY == newY) {
		if (oldX < newX) {
			return "right";
		} else {
			return "left";
		}
	}
}