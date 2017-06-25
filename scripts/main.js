//A special thanks to ahmad abdolsaheb who, through his blog, helped me figure out how to properly create the MiniMax function for the AI portion of this project: https://medium.freecodecamp.com/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37

$(document).ready(function () {

    var playerSelected = 0;
    var symbolSelected = "neither";
    var player1Symbol;
    var player2Symbol;
    var order;
    var gameStarted = false;
    var gameType;
    var turn;
    var gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var moveNumber;
    var name1 = "Player 1";
    var name2 = "Player 2";

    $("#newGame").click(function () {
        if (playerSelected == 0) {
            $("#warning").html("<h5 class = 'text-center alert alert-warning'>Please select a player count.</h5>");
            return;
        }
        else if (symbolSelected == "neither" && playerSelected == 1) {
            $("#warning").html("<h5 class = 'text-center alert alert-warning'>Please select a symbol for yourself.</h5>");
            return;
        }
        else if (symbolSelected == "neither" && playerSelected == 2) {
            $("#warning").html("<h5 class = 'text-center alert alert-warning'>Please select a symbol for player 1.</h5>");
            return;
        }
        else {
            gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            moveNumber = 0;
            $("#warning").empty();
            $(".spot").empty();
            gameType = playerSelected;
            player1Symbol = symbolSelected;
            if (player1Symbol == "X") {
                player2Symbol = "O";
            }
            else {
                player2Symbol = "X";
            }
            gameStarted = true;
            order = Math.random() < 0.5 ? 1 : 2;
            if (order == 1) {
                if (gameType == 2) {
                    $("#turnCounter").html("<h5 class = 'text-center alert alert-warning'>" + name1 + "'s turn.</h5>");
                }
                else {
                    $("#turnCounter").html("<h5 class = 'text-center alert alert-warning'>Your turn.</h5>");
                }
                turn = 1;
            }
            else {
                if (gameType == 2) {
                    $("#turnCounter").html("<h5 class = 'text-center alert alert-warning'>" + name2 + "'s turn.</h5>");
                    turn = 2;
                }
                else {
                    $("#turnCounter").html("<h5 class = 'text-center alert alert-warning'>The computer is thinking...</h5>");
                    bestSpot = decision(gameBoard, player2Symbol);
                    gameBoard[bestSpot.index] = player2Symbol;
                    switch (bestSpot.index) {
                        case 0: $("#spot1").html(player2Symbol);
                            break;
                        case 1: $("#spot2").html(player2Symbol);
                            break;
                        case 2: $("#spot3").html(player2Symbol);
                            break;
                        case 3: $("#spot4").html(player2Symbol);
                            break;
                        case 4: $("#spot5").html(player2Symbol);
                            break;
                        case 5: $("#spot6").html(player2Symbol);
                            break;
                        case 6: $("#spot7").html(player2Symbol);
                            break;
                        case 7: $("#spot8").html(player2Symbol);
                            break;
                        case 8: $("#spot9").html(player2Symbol);
                            break;
                        default:
                            break;
                    }
                    moveNumber = 1;
                    $("#turnCounter").html("<h5 class = 'text-center alert alert-warning'>Your turn.</h5>");
                }
            }
        }
    });
    $("#1player").click(function () {
        $("#1player").removeClass("btn-primary").addClass("btn-success");
        $("#2players").removeClass("btn-success").addClass("btn-primary");
        $(".names1").css("visibility", "hidden");
        $(".names1").css("margin", "-20px");
        $(".names2").css("visibility", "hidden");
        $(".names2").css("margin", "-20px");
        playerSelected = 1;
        $("#warning").empty();
    });
    $("#2players").click(function () {
        $("#2players").removeClass("btn-primary").addClass("btn-success");
        $("#1player").removeClass("btn-success").addClass("btn-primary");
        if (playerSelected == 0 || playerSelected == 1) {
            $(".names1").css("visibility", "visible");
            $(".names1").css("margin", "5px 5px 20px 5px");
            $(".names2").css("visibility", "visible");
            $(".names2").css("margin", "5px 5px 20px 5px");
        }
        playerSelected = 2;
        $("#warning").empty();
    });
    $("#x").click(function () {
        $("#x").removeClass("btn-primary").addClass("btn-success");
        $("#o").removeClass("btn-success").addClass("btn-primary");
        symbolSelected = "X"
        $("#warning").empty();
    });
    $("#o").click(function () {
        $("#o").removeClass("btn-primary").addClass("btn-success");
        $("#x").removeClass("btn-success").addClass("btn-primary");
        symbolSelected = "O";
        $("#warning").empty();
    });

    // the main minimax function
    function decision(newBoard, player) {

        //available spots
        var availSpots = emptyIndexies(newBoard);

        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
        if (winning(newBoard, player1Symbol)) {
            return { score: -10 };
        }
        else if (winning(newBoard, player2Symbol)) {
            return { score: 10 };
        }
        else if (availSpots.length === 0) {
            return { score: 0 };
        }

        // an array to collect all the objects
        var moves = [];

        // loop through available spots
        for (var i = 0; i < availSpots.length; i++) {

            //create an object for each and store the index of that spot that was stored as a number in the object's index key
            var move = {};
            move.index = newBoard[availSpots[i]];

            // set the empty spot to the current player
            newBoard[availSpots[i]] = player;

            //if collect the score resulted from calling minimax on the opponent of the current player
            if (player == player2Symbol) {
                var result = decision(newBoard, player1Symbol);
                move.score = result.score;
            }
            else {
                var result = decision(newBoard, player2Symbol);
                move.score = result.score;
            }

            //reset the spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        // if it is the computer's turn loop over the moves and choose the move with the highest score
        var bestMove;
        if (player === player2Symbol) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {

            // else loop over the moves and choose the move with the lowest score
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        // return the chosen move (object) from the array to the higher depth
        return moves[bestMove];
    }

    // returns the available spots on the board
    function emptyIndexies(board) {
        return board.filter(s => s != "O" && s != "X");
    }

    // winning combinations using the board indexies for instace the first win could be 3 xes in a row
    function winning(board, player) {
        return (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        );
    }
    $("#spot1").click(function () {
        squareClick(1);
    });
    $("#spot2").click(function () {
        squareClick(2);
    });
    $("#spot3").click(function () {
        squareClick(3);
    });
    $("#spot4").click(function () {
        squareClick(4);
    });
    $("#spot5").click(function () {
        squareClick(5);
    });
    $("#spot6").click(function () {
        squareClick(6);
    });
    $("#spot7").click(function () {
        squareClick(7);
    });
    $("#spot8").click(function () {
        squareClick(8);
    });
    $("#spot9").click(function () {
        squareClick(9);
    });
    function squareClick(square) {
        if (gameStarted) {
            if (gameBoard[square - 1] == square - 1) {
                console.log(moveNumber);
                moveNumber++;
                if (gameType == 2) {
                    if (turn == 1) {
                        gameBoard[square - 1] = player1Symbol;
                        $("#spot" + square.toString()).html(player1Symbol);
                        if (winning(gameBoard, player1Symbol)) {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-success'>" + name1 + " wins!</h5>");
                            gameStarted = false;
                        }
                        else if (moveNumber >= 9) {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-info'>The game has ended in a tie... how shocking...</h5>");
                            gameStarted = false;
                        }
                        else {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-warning'>" + name2 + "'s turn.</h5>");
                            turn = 2;
                        }
                    }
                    else {
                        gameBoard[square - 1] = player2Symbol;
                        $("#spot" + square.toString()).html(player2Symbol);
                        if (winning(gameBoard, player2Symbol)) {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-success'>" + name2 + " wins!</h5>");
                            gameStarted = false;
                        }
                        else if (moveNumber >= 9) {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-info'>The game has ended in a tie... how shocking...</h5>");
                            gameStarted = false;
                        }
                        else {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-warning'>" + name1 + "'s turn.</h5>");
                            turn = 1;
                        }
                    }
                }
                else {
                    gameBoard[square - 1] = player1Symbol;
                    $("#spot" + square.toString()).html(player1Symbol);
                    if (winning(gameBoard, player1Symbol)) {
                        $("#turnCounter").html("<h5 class = 'text-center alert alert-success'>You win!</h5>");
                        gameStarted = false;
                    }
                    else if (moveNumber >= 9) {
                        $("#turnCounter").html("<h5 class = 'text-center alert alert-info'>The game has ended in a tie... how shocking...</h5>");
                        gameStarted = false;
                    }
                    else {
                        moveNumber++;
                        bestSpot = decision(gameBoard, player2Symbol);
                        gameBoard[bestSpot.index] = player2Symbol;
                        switch (bestSpot.index) {
                            case 0: $("#spot1").html(player2Symbol);
                                break;
                            case 1: $("#spot2").html(player2Symbol);
                                break;
                            case 2: $("#spot3").html(player2Symbol);
                                break;
                            case 3: $("#spot4").html(player2Symbol);
                                break;
                            case 4: $("#spot5").html(player2Symbol);
                                break;
                            case 5: $("#spot6").html(player2Symbol);
                                break;
                            case 6: $("#spot7").html(player2Symbol);
                                break;
                            case 7: $("#spot8").html(player2Symbol);
                                break;
                            case 8: $("#spot9").html(player2Symbol);
                                break;
                            default:
                                break;
                        }
                        if (winning(gameBoard, player2Symbol)) {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-danger'>You lost... the computer has defated you...</h5>");
                            gameStarted = false;
                        }
                        else if (moveNumber >= 9) {
                            $("#turnCounter").html("<h5 class = 'text-center alert alert-info'>The game has ended in a tie... how shocking...</h5>");
                            gameStarted = false;
                        }
                    }
                }
            }
        }
    }
    $("#name1")
        .keyup(function () {
            if ($(this).val() == "") {
                name1 = "Player 1"
            }
            else {
                name1 = $(this).val();
            }
        }).keyup();
    $("#name2")
        .keyup(function () {
            if ($(this).val() == "") {
                name2 = "Player 2"
            }
            else {
                name2 = $(this).val();
            }
        }).keyup();
});