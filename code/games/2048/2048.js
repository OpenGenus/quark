// setting up the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// canvas has width="500" height="600"

// setting up the parameters of the playing space

// number of boxes in a standard game is 4 x 4
var hsize = 4; // number of boxes horiontally
var vsize = 4; // number of boxes vertically

// The playing board parameters (to be drawn in gray)
var boardx = 50;
var boardy = 100;
var boardwidth = 400;
var boardheight = 400;

// The playing boards grid outlines (basically to make it look like a 4 x 4 grid)
var boxwidth = boardwidth / hsize;
var boxheight = boardheight / vsize;

// Initialise a 2D array denoting the value of the current element at that position
var box_values = [];
for (var i = 0; i < hsize; i++) {
    box_values[i] = [];
    for (var j = 0; j < vsize; j++) {
        box_values[i][j] = { x: boardx + i * boxwidth, y: boardy + j * boxheight, value: 0 }
    }
}

// colors
var boardColor = "#aaa"
var boxColor = [boardColor, "#f00", "#ff0", "#0f0", "#0ff", "#00f", "#f0f", "#a00", "#aa0", "#0a0", "#0aa", "#00a", "#a0a"]

// maximum scores obtained in a session
var maxScore1 = 0;
var maxScore2 = 0;

// check if the movement has taken place or not
var isMove = 0;

// functions related to the logic of the game

// get the count of the number of digits in a given number
function digCount(n) {
    var m = n;
    var ans = 0;
    do {
        ans++;
        m = Math.floor(m / 10);
    } while (m != 0);
    return ans;
}

// get the number of empty spaces in the grid
function getEmptyBox() {
    var count = 0;
    for (var i = 0; i < hsize; i++) {
        for (var j = 0; j < vsize; j++) {
            if (box_values[i][j].value == 0)
                count++;
        }
    }
    // console.log(count)
    return count;
}

// clear the board
function clearGrid() {
    for (var i = 0; i < hsize; i++) {
        for (var j = 0; j < vsize; j++) {
            box_values[i][j].value = 0;
        }
    }
}

// returns a copy of the board()
function copyGrid() {
    var bv = [];
    for (var i = 0; i < hsize; i++) {
        bv[i] = [];
        for (var j = 0; j < vsize; j++) {
            bv[i][j] = box_values[i][j];
        }
    }
    return bv;
}

// get the score1, that is the sum of all the values in the grid
function getScore1() {
    var score1 = 0;
    for (var i = 0; i < hsize; i++) {
        for (var j = 0; j < vsize; j++) {
            score1 += Math.floor(Math.pow(2, box_values[i][j].value - 1));
        }
    }
    return score1;
}

// get the score2, that is the maximum value of all the values in the grid
function getScore2() {
    var score2 = 0;
    for (var i = 0; i < hsize; i++) {
        for (var j = 0; j < vsize; j++) {
            if (box_values[i][j].value > score2)
                score2 = box_values[i][j].value;
        }
    }
    return Math.floor(Math.pow(2, score2 - 1));
}

// get a random empty box to get a value 1
function carryOn() {
    if (getEmptyBox() == 0)
        return;
    var randx = Math.floor(Math.random() * 4);
    var randy = Math.floor(Math.random() * 4);
    while (box_values[randx][randy].value != 0) {
        var randx = Math.floor(Math.random() * 4);
        var randy = Math.floor(Math.random() * 4);
    }
    box_values[randx][randy].value = 1;
}

// moves all the non-zero elements in a single row to the left
function moveAllUp(row, len) {
    var i, j;
    for (i = 0; i < len; i++) {
        if (row[i].value == 0) {
            for (j = i + 1; j < len && row[j].value == 0; j++)
                ;
            var k = j, l = i;
            while (l < j) {
                if (k < len) {
                    row[l].value = row[k].value;
                    row[k].value = 0;
                }
                else
                    row[l].value = 0;
                l++;
                k++;
            }
        }
    }
    return row;
}

// fixes a single row, when the UP arrow is passed to it
function fixSingleRowUp(row, len) {
    row = moveAllUp(row, len);
    // merging
    for (var i = 0; i < len - 1; i++) {
        isMove = 1;
        if (row[i].value == row[i + 1].value && row[i].value != 0) {
            row[i].value++;
            row[i + 1].value = 0;
        }
    }
    row = moveAllUp(row, len);
    return row;
}

// moves all the non-zero elements in a single row to the left
function moveAllDown(row, len) {
    var i, j;
    for (i = len - 1; i >= 0; i--) {
        if (row[i].value == 0) {
            for (j = i - 1; j >= 0 && row[j].value == 0; j--)
                ;
            var k = j, l = i;
            while (l > j) {
                if (k >= 0) {
                    row[l].value = row[k].value;
                    row[k].value = 0;
                }
                else
                    row[l].value = 0;
                l--;
                k--;
            }
        }
    }
    return row;
}

// fixes a single row, when the DOWN arrow is passed to it
function fixSingleRowDown(row, len) {
    row = moveAllDown(row, len);
    // merging
    for (var i = len - 1; i > 0; i--) {
        if (row[i].value == row[i - 1].value && row[i].value != 0) {
            row[i].value++;
            row[i - 1].value = 0;
            isMove = 1;
        }
    }
    row = moveAllDown(row, len);
    return row;
}

// moves all the elements on the board to the right
function rightMoveBoard(box_values) {
    // console.log("Right arrow pressed");
    var oldBoardValues = JSON.stringify(box_values);
    for (var i = 0; i < vsize; i++) {
        var a = new Array(hsize);
        for (var j = 0; j < hsize; j++)
            a[j] = box_values[j][i];
        a = fixSingleRowDown(a, vsize);
        for (var j = 0; j < hsize; j++)
            box_values[j][i] = a[j];
    }
    if (oldBoardValues == JSON.stringify(box_values))
        return 0;
    else
        return 1;
}

// moves all the elements on the board to the left
function leftMoveBoard(box_values) {
    // console.log("Left arrow pressed");
    var oldBoardValues = JSON.stringify(box_values);
    for (var i = 0; i < vsize; i++) {
        var a = new Array(hsize);
        for (var j = 0; j < hsize; j++)
            a[j] = box_values[j][i];
        a = fixSingleRowUp(a, vsize);
        for (var j = 0; j < hsize; j++)
            box_values[j][i] = a[j];
    } if (oldBoardValues == JSON.stringify(box_values))
        return 0;
    else
        return 1;
}

// moves all the elements on the board to the up
function upMoveBoard(box_values) {
    // console.log("Up arrow pressed");
    var oldBoardValues = JSON.stringify(box_values);
    for (var i = 0; i < hsize; i++) {
        box_values[i] = fixSingleRowUp(box_values[i], vsize);
    } if (oldBoardValues == JSON.stringify(box_values))
        return 0;
    else
        return 1;
}

// moves all the elements on the board to the down
function downMoveBoard(box_values) {
    // console.log("Down arrow pressed");
    var oldBoardValues = JSON.stringify(box_values);
    for (var i = 0; i < hsize; i++) {
        box_values[i] = fixSingleRowDown(box_values[i], vsize);
    }
    if (oldBoardValues == JSON.stringify(box_values))
        return 0;
    else
        return 1;
}

// returns 1 if no move is possible
function noOtherMovePossible() {
    if (getEmptyBox() > 0)
        return 0;
    for (var i = 0; i < hsize; i++) {
        for (var j = 0; j < vsize; j++) {
            if (j + 1 < vsize && box_values[i][j].value == box_values[i][j + 1].value) {
                return 0;
            }
            if (i + 1 < hsize && box_values[i][j].value == box_values[i + 1][j].value) {
                return 0;
            }
        }
    }
    // for (var i = 0; i < hsize; i++) {
    //     for (var j = 0; j < vsize; j++) {
    //         console.log(box_values[i][j].value)
    //     }
    // }
    return 1;
}

// Taking in user input

// Event listeners to manage the input of the game
document.addEventListener("keyup", keyUpHandler, false);

function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "Down" || e.key == "ArrowDown" || e.key == "Left" || e.key == "ArrowLeft" || e.key == "Right" || e.key == "ArrowRight") {
        isMove = 0;
        if (e.key == "Right" || e.key == "ArrowRight") {
            isMove = rightMoveBoard(box_values);
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            isMove = leftMoveBoard(box_values);
        }
        else if (e.key == "Down" || e.key == "ArrowDown") {
            isMove = downMoveBoard(box_values);
        }
        else if (e.key == "Up" || e.key == "ArrowUp") {
            isMove = upMoveBoard(box_values);
        }
        draw();
    }
}

// functions to draw different things

// draw vertical lines from a given starting point and length and color
function drawVLine(x, y, length, color) {
    ctx.beginPath();
    ctx.rect(x, y, 1, length);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// draw horizontal lines from a given starting point and length and color
function drawHLine(x, y, length, color) {
    // console.log(x, y)
    ctx.beginPath();
    ctx.rect(x, y, length, 1);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// draw the main board
function drawBoard() {
    ctx.beginPath();
    ctx.rect(boardx, boardy, boardwidth, boardheight);
    ctx.fillStyle = boardColor;
    ctx.fill();
    ctx.closePath();
}

// draw the grid outline
function drawGridOutline() {
    for (var i = 0; i <= 4; i++)
        drawHLine(boardx, boardy + i * boxwidth, boardwidth, "#000");
    for (var i = 0; i <= 4; i++)
        drawVLine(boardx + i * boxwidth, boardy, boardheight, "#000");
}

// type in the number/value of the given box
function writeValue(box) {
    // console.log(box.value);
    if (box.value == 0)
        return;
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    var numberToPrint = Math.floor(Math.pow(2, box.value - 1));
    ctx.fillText(numberToPrint, box.x + boxwidth / 2 - 4 * digCount(numberToPrint), box.y + boxheight / 2 + 4);
}

// draw a single box
function drawBox(box) {
    // console.log(box);
    ctx.beginPath();
    ctx.rect(box.x + 0.05 * boxwidth, box.y + 0.05 * boxheight, 0.9 * boxwidth, 0.9 * boxheight);
    ctx.fillStyle = boxColor[box.value]; // color of the box depends on its value
    ctx.fill();
    ctx.closePath();
    writeValue(box);
}

// draw the entire grid
function drawGrid() {
    for (var i = 0; i < hsize; i++) {
        for (var j = 0; j < vsize; j++) {
            drawBox(box_values[i][j]);
        }
    }
}

// print the score1
function drawScore1() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Current Score: " + getScore1(), 8, 50);
}

// print the score2
function drawScore2() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Maximum Value Obtained: " + getScore2(), 8, 70);
}

// calculate and print the maximum score1 in this session
function drawMaxScore1() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    var score1 = getScore1();
    if (maxScore1 < score1)
        maxScore1 = score1;
    ctx.fillText("High Score: " + maxScore1, 8, 550);
}

// calculate and print the maximum score2 in this session
function drawMaxScore2() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    var score2 = getScore2();
    if (maxScore2 < score2)
        maxScore2 = score2;
    ctx.fillText("High Score in Maximum Value Obtained: " + maxScore2, 8, 570);
}

// the main draw function
function draw() {
    if (getEmptyBox != 0) {
        carryOn();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the canvas content
    drawBoard();
    drawGridOutline();
    drawGrid();
    drawScore1();
    drawScore2();
    drawMaxScore1();
    drawMaxScore2();
    if (noOtherMovePossible() == 1) {
        alert("GAME OVER!\nCurrent Score: " + getScore1() + "\nMaximum Value Obtained: " + getScore2());
        clearGrid();
        draw();
    }
}

draw();

