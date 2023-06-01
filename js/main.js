'use strict'
var gLevel = {
    SIZE: 4,
    Mines: 2
}
var gBoard;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    document.querySelector('.emoji').innerHTML = `<img src="img/happy-smiley.jpg" onclick="onInit()">`;
    var radioButtons = document.querySelectorAll('input[name="difficulty"]');
    for (var i=0; i<radioButtons.length; i++) {
	if (radioButtons[i].checked) {
	    chooseLevel(Number(radioButtons[i].value));
	}
    }
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gBoard = buildBoard();
    renderBoard();
}

function chooseLevel(size) {
    switch (size) {
    case 4:
	gLevel.SIZE = 4;
	gLevel.Mines = 2;
	break;
    case 5:
	gLevel.SIZE = 10;
	gLevel.Mines = 10;
	break;
    case 6:
	gLevel.SIZE = 16;
	gLevel.Mines = 40;
    }
}


function buildBoard () {
    var board = [];
    for (var i=0; i<gLevel.SIZE; i++) {
	board[i] = [];
	for (var j=0; j<gLevel.SIZE; j++) {
	    board[i][j] = {
		minesAroundCount: 0,
		isShown: false,
		isMine: false,
		isMarked: false
	    }
	}
    }
//    var rndNums = shuffle(3);
//    console.log(rndNums);
//    for (var k=0; k<gLevel.Mines; k++) {
//	var rowI = toIJ(rndNums[k]).i
//	var colJ = toIJ(rndNums[k]).j
//	console.log(rowI,colJ);
//	board[rowI][colJ].isMine = true;
//	setMinesNegsCount(board, rowI, colJ);
//    }
//    console.log(board);
//
    return board;
}


function fillMines(skipNum) {
    var rndNums = shuffle(skipNum);
    for (var k=0; k<gLevel.Mines; k++) {
	var rowI = toIJ(rndNums[k]).i
	var colJ = toIJ(rndNums[k]).j
	console.log(rowI,colJ);
	gBoard[rowI][colJ].isMine = true;
	setMinesNegsCount(gBoard, rowI, colJ);
    }
}
 

function renderBoard() {
    var strHTML = '';
    for (var i=0; i<gLevel.SIZE; i++) {
	strHTML += '<tr>';
	    for (var j=0; j<gLevel.SIZE; j++) {
		var classlist = '';
		strHTML += `<td class="cell ${classlist}" data-i="${i}" data-j="${j}" oncontextmenu="onRightClick(this, ${i}, ${j})" 
                             onclick="onCellClicked(this, ${i}, ${j})">
                             </td>`;
	    }
	strHTML += '</tr>';
    }
    document.querySelector('.board').innerHTML = strHTML;
}


function shuffle(num) {
    var nums = [];
    for (var i=0; i<gLevel.SIZE**2; i++) {
	nums[i] = i;
    }
    var rndNums = [];
    for (var i=0; i<gLevel.Mines; i++) {
	var drawnIdx = Math.floor(Math.random()*(gLevel.SIZE**2-1-i));
	while (nums[drawnIdx] === num) {
	    drawnIdx = Math.floor(Math.random()*(gLevel.SIZE**2-1-i));
	}
	rndNums.push(nums.splice(drawnIdx,1)[0]);
    }
    return rndNums;
    
}

//transform from num to matrix position
function toIJ(num) {
	
    var i = (num === 0) ? 0 : Math.floor((num-1)/gLevel.SIZE);
    var j = (num === 0) ? 0 : (num-1)%gLevel.SIZE;
    return {
	i: i,
	j: j
    }
}


function setMinesNegsCount(board,rowI,colJ) {
    for (var i=rowI-1; i<rowI+2; i++) {
	for (var j=colJ-1; j<colJ+2; j++) {
	    if (i<0 || i >= gLevel.SIZE || j<0 || j >= gLevel.SIZE || i === rowI && j === colJ) {
		continue;
	    }
	    
	    board[i][j].minesAroundCount++;
	}
    }
}


function onCellClicked(elCell, i , j) {
    if (!gGame.shownCount) {
	fillMines(i*gLevel.SIZE+j+1);
    }
	
    if (!gGame.isOn || gBoard[i][j].isMarked) {
	return;
    }
    if (gBoard[i][j].isMine) {
	gGame.isOn = false;
	renderGameOver();
	return;
    }
    gBoard[i][j].isShown = true;
    if (gBoard[i][j].minesAroundCount === 0) {
	expandShown(i, j);
    }

    else {
	elCell.innerText = gBoard[i][j].minesAroundCount;
	elCell.classList.add("pressed");
	gGame.shownCount++;
    }
	checkGameOver();
	
}

function expandShown(rowI, colJ) {
    var elCell = document.querySelector(`[data-i="${rowI}"][data-j="${colJ}"]`);
    //check if cell opened during recurssion
    if (elCell.classList.contains("pressed")){
	return;
    }
    elCell.classList.add("pressed");
    gGame.shownCount++;
    for (var i=rowI-1; i<rowI+2; i++) {
	for (var j=colJ-1; j<colJ+2; j++) {
	    if (i<0 || i >= gLevel.SIZE || j<0 || j >= gLevel.SIZE || i === rowI && j === colJ) {
		continue;
	    }
	   
	    if (gBoard[i][j].minesAroundCount === 0) {
		expandShown(i,j)
	    }
	    elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
	    if (elCell.classList.contains("pressed")) {
		continue;
	    }
	    elCell.innerText = gBoard[i][j].minesAroundCount;
	    elCell.classList.add("pressed");
	    gGame.shownCount++;

	}
    }
}


function onRightClick(elCell, i, j) {
    if (!gGame.isOn || gBoard[i][j].isShown) {
	return;
    }
    if (gBoard[i][j].isMarked) {
	gBoard[i][j].isMarked = false;
	elCell.innerHTML= "";
	gGame.markedCount--;
    }
    else {
	gBoard[i][j].isMarked = true;
	gGame.markedCount++;
	elCell.innerHTML = `<img src="img/minesweeper-flag.jpg">`
	checkGameOver();
    }
}


function checkGameOver() {
    if (gGame.shownCount+gGame.markedCount === gLevel.SIZE*gLevel.SIZE)
    document.querySelector('.emoji').innerHTML = `<img src="img/sunglasses-smiley.png" onclick="onInit()">`;
}

function renderGameOver() {
    document.querySelector('.emoji').innerHTML = `<img src="img/sad-smiley.png" onclick="onInit()">`;
    for (var i=0; i<gLevel.SIZE; i++) {
	for (var j=0; j<gLevel.SIZE; j++) {
	    if (gBoard[i][j].isMine) {
		var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
		elCell.innerHTML = `<img src="img/minesweeper-mine.png">`;
		elCell.classList.add("pressed");
	    }
	}
    }

}
