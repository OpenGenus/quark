$(document).ready(function() {

    // ----------------- Game Rules -----------------
    var matrix, gameData;
    var gameMessage = document.getElementsByClassName('game-message')[0]
    var gameBoardSpaces = document.getElementsByClassName('game-board-space');

    function initGame() {

        //clear the board
        gameMessage.innerHTML = '';
        for (var i = 0, l = gameBoardSpaces.length; i < l; i++) {
            gameBoardSpaces[i].innerHTML = '';
            gameBoardSpaces[i].classList.remove('selected-space');
        }

        //clear data
        matrix = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        //reset the meta data
        gameData = {
            nextMover: null,
            currentMover: null,
            gameMessage: null,
            gameComplete: false
        };
    }

    initGame();

    function autoMove(x, y) { // toggles between users
        if (gameData.currentMover === null) { //if autoMoves first go, choose X
            gameData.currentMover = 'X';
            xMoves(x, y);
            return;
        }

        switch (gameData.currentMover) { //last mover
            case 'X':
                oMoves(x, y);
                break;
            case 'O':
                xMoves(x, y);
                break;
        }
    }

    function oMoves(x, y) { // wrappers for ease of use
        gameData.currentMover = 'O';
        makeMove(x, y, 'O');
        return;
    }

    function xMoves(x, y) { // wrappers for ease of use
        gameData.currentMover = 'X';
        makeMove(x, y, 'X');
        return;
    }

    function beforeMove() {
        if (gameData.gameComplete === true) {
            alert('Please reset the game');
            throw ('reset board');
        }
        gameData.gameMessage = null;
    }

    function afterMove() {
        checkForWinner();
        if (gameData.gameMessage !== null) {
            showGameMessage(gameData.gameMessage);
            return;
        }
    }

    function makeMove(x, y, val) {
        beforeMove();

        if (matrix[y - 1][x - 1] === null) { // make args 1 based for ease of use
            matrix[y - 1][x - 1] = val;
        } else {
            gameData.gameMessage = 'this space is already taken';
        }

        afterMove();
        return;
    }


    function checkForWinner() {

        for (var i = 0, l = matrix.length; i < l; i++) {
            // horizontal non-null match
            if (matrix[i][0] !== null && matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2]) {
                declareWinner(gameData.currentMover);
                return;
            }

            // vertical non-null match
            if (matrix[0][i] !== null && matrix[0][i] === matrix[1][i] && matrix[1][i] === matrix[2][i]) {
                declareWinner(gameData.currentMover);
                return;
            }

            // downward diagnal non-null-match
            if (matrix[0][0] !== null && matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
                declareWinner(gameData.currentMover);
                return;
            }

            // upward diagnal non-null-match
            if (matrix[2][0] !== null && matrix[2][0] === matrix[1][1] && matrix[1][1] === matrix[0][2]) {
                declareWinner(gameData.currentMover);
                return;
            }
        }
    }


    // ----------------- Game UI Interactions -----------------
    function declareWinner(player) {
        gameData.gameComplete = true;
        gameData.gameMessage = "";
        gameData.gameMessage += player + ' wins! ';
        gameData.gameMessage += "<span>New Game?</span>";
        return;
    }

    function showGameMessage(msg) {
        gameMessage.innerHTML = msg;
    }

    // ----------------- Handle Events -----------------
    for (var i = 0, l = gameBoardSpaces.length; i < l; i++) {
        gameBoardSpaces[i].addEventListener('click', function (e) {
            var coords = e.target.dataset['space'].split(',');
            autoMove(coords[0], coords[1]);
            e.target.innerHTML = gameData.currentMover;
            e.target.classList.add('selected-space');
        });
    }

    gameMessage.addEventListener('click', function () {
        initGame();
    });
});