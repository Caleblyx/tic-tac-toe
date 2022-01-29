const gameboard = (function (){
    const board = [[],[],[]];
    const initializeBoard = function() {
        for (let row of board) {
            for (let i = 0; i<3; i++) {
                row.push('')
            }
        }
    }

    const clearBoard = function() {
        for (let i = 0; i < 3; i ++) {
            board[i] = []
        }
    }

    const queryCell = function(row, col) {
        return board[row][col];
    }
    const viewBoard = function() {
        console.log(board);
    }
    const markPosition = function(row, column, symbol) {
        if (row < 0 || row > 2 || column < 0 || column > 2){
            console.log("Position does not exist!")
        } else {
            board[row][column] = symbol;
        }
    }

    const getColumn = function(i) {
        colState = []
        for (let row of board) {
            colState.push(row[i]);
        }
        return colState;
        
    }

    const getDiagonals = function() {
        const diagonals = []
        const diagonalOne = []
        const diagonalTwo = []
        let index = 0
        for (let row of board) {
            diagonalOne.push(row[index]);
            diagonalTwo.push(row[2 - index]);
            index++;
        }
        diagonals.push(diagonalOne);
        diagonals.push(diagonalTwo);
        return diagonals;
    }

    const checkFull = function() {
        for (let row of board) {
            if (row.includes("")) {
                return false;
            }
        }
        return true;
    }

    const getWinningCells = function(symbol) {
        const winningState = JSON.stringify([symbol, symbol, symbol]);
        let rowNum = 0
        for (let row of board) {
            if (JSON.stringify(row) == winningState) {
                return [[rowNum, 0], [rowNum, 1], [rowNum, 2]];
            } 
            rowNum++;
        }
        for (let i = 0; i < 3; i++) {
            if (JSON.stringify(getColumn(i)) == winningState) {
                return [[0, i], [1,i], [2,i]];
            }
        }
        let diagNum = 0
        for (let diagonal of getDiagonals()) {
            if (JSON.stringify(diagonal) == winningState) {
                if (diagNum == 0) {
                    return [[0,0], [1,1], [2,2]];
                } else {
                    return [[0,2], [1,1], [2,0]];
                }
            }
            diagNum++;
        }
        return [];
    }

    const checkWin = function(symbol) {
        const winningState = JSON.stringify([symbol, symbol, symbol]);
        for (let row of board) {
            if (JSON.stringify(row) == winningState) {
                return true;
            } 
        }
        for (let i = 0; i < 3; i++) {
            if (JSON.stringify(getColumn(i)) == winningState) {
                return true;
            }
        }
        for (let diagonal of getDiagonals()) {
            if (JSON.stringify(diagonal) == winningState) {
                return true;
            }
        }
        return false;
    }
    const publicMethods = {
        initializeBoard: initializeBoard,
        viewBoard : viewBoard,
        markPosition : markPosition,
        checkWin: checkWin,
        queryCell: queryCell,
        checkFull: checkFull,
        getWinningCells : getWinningCells,
        clearBoard: clearBoard
    }
    return publicMethods;
})();

const Player = (function (s) {
    const symbol = s;

    const markPosition = function (row, column) {
        gameboard.markPosition(row, column, symbol);
    };
    
    const getSymbol = function() {
        return symbol;
    }

    const publicMethods = {
        markPosition: markPosition,
        getSymbol: getSymbol,
    };
    return publicMethods;
});

const game = (function() {
    let playerOne = null;
    let playerTwo = null;
    let currentPlayer = null;

    const initializeGame = function() {
        const displayFunction = function () {
            let id = this.id;
            console.log(id);
            let row = parseInt(id.charAt(1));
            let col = parseInt(id.charAt(2));
            takeTurn(row, col);
            this.removeEventListener("click", displayFunction);
        }
        gameboard.initializeBoard();
        uiController.initializeUIController();
        uiController.initializeBoardFunction(displayFunction);
        uiController.setResetButtonFunction(resetGame);
        playerOne = Player('X');
        playerTwo = Player('O');
        currentPlayer = playerOne;
    }


    const checkWin = function() {
        return gameboard.checkWin(currentPlayer.getSymbol());
    }

    const getWinningCells = function() {
        return gameboard.getWinningCells(currentPlayer.getSymbol());
    }

    const checkFull = function() {
        return gameboard.checkFull();
    }

    const takeTurn = function(row, col) {
        currentPlayer.markPosition(row, col);
        uiController.updateBoard();
        if (checkWin()) {
            console.log(currentPlayer.getSymbol() + " has won!");
            let winningCells = getWinningCells();
            uiController.highlightCells(winningCells);
            uiController.disableBoard();
            uiController.displayMessage(currentPlayer.getSymbol() + " has won!");
        } else if (checkFull()) {
            console.log("It's a tie!");
            uiController.displayMessage("It's a tie!");
            uiController.disableBoard();
        } else {
            initializeNextTurn();
        }
    }
    
    const initializeNextTurn = function() {
        if (currentPlayer == playerOne) {
            currentPlayer = playerTwo
        } else {
            currentPlayer = playerOne;
        }
    }

    const resetGame = function() {
        gameboard.clearBoard();
        uiController.clearBoard();
        uiController.clearMessage();
        initializeGame();
    }

    return {initializeGame};
})();

const uiController = (function () {
    const board = [[],[],[]];
    let resetButton = null;

    const initializeUIController = function() {
        for (let i = 0; i<3; i++) {
            for (let j = 0; j < 3; j++) {
                let id = "#c" + i.toString() + j.toString()
                board[i][j] = document.querySelector(id);
                board[i][j].textContent = "";
            }
        }
        resetButton = document.querySelector(".reset");
    }
    const initializeBoardFunction = function(func) {
        for (let row of board) {
            for (let cell of row) {
                cell.addEventListener("click", func);
            }
        }
    }

    const setResetButtonFunction = function(fun) {
        resetButton.addEventListener("click", fun);
    }

    const disableBoard = function(func) {
        for (let i=0; i < 3; i++) {
            for (let j=0; j<3; j++) {
                let newNode = board[i][j].cloneNode(true)
                board[i][j].parentNode.replaceChild(newNode, board[i][j]);
                board[i][j] = newNode;
            }
        }
    }


    const updateBoard = function() {
        for (let i = 0; i<3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameboard.queryCell(i,j) == board[i][j].textContent) {
                    
                } else {
                    board[i][j].textContent = gameboard.queryCell(i,j);
                    board[i][j].style.color = "black";
                }
            }
        }
    }

    //Sets all cell colours to white, removes any special classes, and removes event listeners.
    const clearBoard = function() {
        for (let i = 0; i<3; i++) {
            for (let j = 0; j<3; j++) {
                board[i][j].style.color = "white";
                board[i][j].classList.remove("cell-highlight");
                board[i][j].parentNode.replaceChild(board[i][j].cloneNode(true), board[i][j]);
                }
            }    
    }

    const highlightCells = function (coordinates) {
        console.log(coordinates);
        for (coord of coordinates) {
            let row = coord[0];
            let col = coord[1];
            board[row][col].classList.add("cell-highlight");
        }
    }

    const displayMessage = function (mes) {
        let message = document.querySelector(".message");
        message.textContent = mes;
        message.style.color = "black";
    }
    
    const clearMessage = function () {
        let message = document.querySelector(".message");
        message.style.color = "white";
        message.textContent = "Another round...";
    }

    const publicMethods = {
        initializeUIController: initializeUIController,
        initializeBoardFunction: initializeBoardFunction,
        updateBoard: updateBoard,
        disableBoard: disableBoard,
        highlightCells : highlightCells,
        clearBoard: clearBoard,
        setResetButtonFunction : setResetButtonFunction,
        displayMessage : displayMessage,
        clearMessage : clearMessage
    }

    return publicMethods;

})();


game.initializeGame();


