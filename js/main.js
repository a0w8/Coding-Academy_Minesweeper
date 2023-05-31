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
    gBoard = buildBoard();
    renderBoard();
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
    var rndNums = shuffle(3);
    console.log(rndNums);
    for (var k=0; k<gLevel.Mines; k++) {
	var rowI = toIJ(rndNums[k]).i
	var colJ = toIJ(rndNums[k]).j
	console.log(rowI,colJ);
	board[rowI][colJ].isMine = true;
	setMinesNegsCount(board, rowI, colJ);
    }
    console.log(board);

    return board;
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

function toIJ(num) {
	
    var i = (num === 0) ? 0 : Math.floor((num-1)/gLevel.SIZE);
    var j = (num === 0) ? 0 : (num-1)%gLevel.SIZE;
    return {
	i: i,
	j: j
    }
}

function negMinesCount(rowI,colJ) {
    var count=0;
    for (var i=rowI-1; i<rowI+2; i++) {
	for (var j=colJ-1; j<colJ+2; j++) {
	    if (i===rowI && j===colJ) {
		continue;
	    }
	    if (gBoard[i][j].isMine) {
		count++;
	    }
	}
    }
    return count;
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
    if (gBoard[i][j].isMarked) {
	return;
    }
    if (gBoard[i][j].isMine) {
	gGame.isOn = false;
	renderGameOver();
	return;
    }
    gBoard[i][j].isShown = true;
    if (gBoard[i][j].minesAroundCount === 0) {
	elCell.innerText = gBoard[i][j].minesAroundCount;
	elCell.classList.add("pressed");
	gGame.isShown++;
	checkGameOver();
	//replace with the following lines later
	//add to isShown count
	//expandShown(board, elCell, i, j);
	//checkGameOver();
    }
    else {
	elCell.innerText = gBoard[i][j].minesAroundCount;
	elCell.classList.add("pressed");
	gGame.isShown++;
	checkGameOver();
    }
	
}


function onRightClick(elCell, i, j) {
    if (gBoard[i][j].isShown) {
	return;
    }
    if (gBoard[i][j].isMarked) {
	console.log('entered');
	gBoard[i][j].isMarked = false;
	console.log(elCell.innerHTML);
	elCell.innerHTML= "";
	console.log(elCell.innerHTML);
	gGame.markedCount--;
    }
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
    elCell.innerHTML = `<img src="img/minesweeper-flag.jpg">`
    checkGameOver();
}


function checkGameOver() {
    if (gGame.isShown+gGame.isMarked === gLevel.SIZE**2)
	console.log('victorious');
}
