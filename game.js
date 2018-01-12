function startGame() {
	screenflow = "game";
	direction = "right";
	score = 0;
	
	generateLevel();
	createSnake();
	createFood();
}

function createSnake() {
	var length = 5;
	snakeArray = [];
	
	for(var i = length; i > 0; i--) {
		snakeArray.push({x: i, y: 1});
	}
}

function createFood() {
	food = {
		x: Math.round(Math.random()*(gameWidth - cellWidth) / cellWidth),
		y: Math.round(Math.random()*(gameHeight - cellWidth) / cellWidth),
	};
	while (checkCollision(food.x, food.y, snakeArray) || checkCollision(food.x, food.y, mazeArray)) {
		food = {
			x: Math.round(Math.random()*(gameWidth - cellWidth) / cellWidth),
			y: Math.round(Math.random()*(gameHeight - cellWidth) / cellWidth),
		};
	}
}

function updateGameArea() {
	var newX = snakeArray[0].x;
	var newY = snakeArray[0].y;
	changeDirection = false;
	
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
	
	if (checkCollision(newX, newY, snakeArray) || checkCollision(newX, newY, mazeArray)) {
		screenflow = "game-over";
		return;
	}
	
	if(newX == food.x && newY == food.y) {
		var tail = {x: newX, y: newY};
		score++;
		
		createFood();
	}
	else
	{
		var tail = snakeArray.pop();
		tail.x = newX; tail.y = newY;
	}
	
	snakeArray.unshift(tail);
	
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
		
		paintCell(cell.x, cell.y, "green", true, part);
	}
	
	// renders the food
	paintCell(food.x, food.y, "red", false, '');
	
	// renders the maze
	for (var i = 0; i < mazeArray.length; i++) {
		var cell = mazeArray[i];
		
		paintCell(cell.x, cell.y, "blue", false, '');
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

function paintCell(x, y, color, isSnake, part) {
	if (isSnake) {
		var image = new Image();
		image.src = "img/snake-" + part + ".png";
		
		myGameArea.context.drawImage(image, x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	} else {
		myGameArea.context.fillStyle = color;
		myGameArea.context.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		myGameArea.context.strokeStyle = "white";
		myGameArea.context.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	}
}

function checkCollision(x, y, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == x && array[i].y == y) {
			return true;
		}
	}
	
	return false;
}

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