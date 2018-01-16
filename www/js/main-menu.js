function startMenu() {
	screenflow = "main-menu";
}

function updateMainMenu() {
	// Game Title
	myGameArea.context.font = "60px Consolas bold";
	myGameArea.context.fillStyle = "Black";
	myGameArea.context.fillText("ProtoSnek", 90, 100);

	// Click anywhere to start
	myGameArea.context.font = "30px Consolas bold";
	myGameArea.context.fillStyle = "Black";
	myGameArea.context.fillText("Click anywhere to start", 75, 400);
}