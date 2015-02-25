(function () {
    "use strict";

    angular.module('myApp').factory('backGammonLogicService',
        ['enumService',
            function (enumService) {

                // This is a simple implementation for constant and enum, so the value
                // can be changed. Since this is a small personal project, all caps
                // naming convention should be enough.
                var ILLEGAL_CODE = enumService.ILLEGAL_CODE;

                /**
                 * Returns the initial backgammon board as a 28 X 15 board. Index 0 and 27 represent blots exiting the board,
                 * Index 1 and 26 represent blots taken during game play.
                 *
                 *Each player has 15 blots of their own the initial arrangment is: two in each players 24 point, five on each
                 * players thirteen point, three on each players eight point, and five on each player's six point.
                 *
                 *  @returns {*[]}
                 */

                function getInitialBoard() {
                    return [['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//opponent exists the board
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken
                        ['W', 'W', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//start game board 24
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//23
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//22
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//21
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//20
                        ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//19
                        ['B', 'B', 'B', '' , '', '', '', '', '' ,'' ,'', '','','',''],//18
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//17
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//16
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//15
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//14
                        ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//13
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//12
                        ['B', 'B', 'B', 'B' , 'B', '', '', '', '' ,'' ,'', '','','',''],//11
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//10
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//9
                        ['W', 'W', 'W', '' , '', '', '', '', '' ,'' ,'', '','','',''],//8
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//7
                        ['W', 'W', 'W', 'W' , 'W', '', '', '', '' ,'' ,'', '','','',''],//6
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//5
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//4
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//3
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//2
                        ['B', 'B', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//end game board //1
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','',''],//blots taken
                        ['', '', '', '' , '', '', '', '', '' ,'' ,'', '','','','']];//opponent exits the board
                }

                function isMoveOk(params){
                    var board = params.board;
                    var fromDelta = params.fromDelta;
                    var toDelta = params.toDelta;
                    var dice = params.dice;
                    var turnIndexBeforeMove = params.turnIndexBeforeMove;
                    var currentPlayer;
                    var opposingPlayer;
                    var remainingMoves = totalMoves(dice)

                    if(turnIndexBeforeMove === 0){
                        currentPlayer = 'W';
                        opposingPlayer = 'B';
                    }else{
                        currentPlayer = 'B';
                        opposingPlayer = 'W';
                    }

                    //Checks if the player has utilized full dice roll, if not check if other legal moves availible
                    if(!hasUsedFullRoll(fromDelta,toDelta,remainingMoves)){

                        var unusedRolls = getUnusedRolls(fromDelta, toDelta , remainingMoves);

                        if(hasLegalMove(board,unusedRolls,currentPlayer)){
                            throw new Error(ILLEGAL_CODE.INCOMPLETE_MOVE);
                        }
                    }

                    //Check that all blots that were taken entered before other moves were made
                    for(var i = 0; i < toDelta.length; i++){
                        if(toDelta[i] === 1 || toDelta[i] === 26){
                            //If player didn't move off the taken spot then check if any other moves were made
                            for(var j = 0; j<toDelta.length;j++){

                                //If a move was made that didn't remove a blot back onto the board then decalre an
                                //illegal move
                                if(fromDelta[j] !== '' && toDelta[j] !== '' && Math.abs(fromDelta[j] - toDelta[j]) > 0 &&
                                    !(fromDelta[j] === 1 || fromDelta[j] === 26)){
                                    throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                                }

                            }

                        }
                    }

                    //Ensure that player exiting the board is allowed to
                    var remainingRolls = [[]];
                    for(var i = 0; i < toDelta.length; i++){
                        if(currentPlayer === 'W' && toDelta[i] === 27){
                            if(!canExit(board,currentPlayer)){
                                return false;
                            }
                        }

                        if(currentPlayer === 'W' && toDelta[i] === 27){
                            if(!canExit(board,currentPlayer)){
                                return false;
                            }
                        }
                    }

                    //Check that the to point is not held by opposing player
                    for( var i = 0; i < toDelta; i++){
                        if(heldBy(board, toDelta[i]) === opposingPlayer){
                            return false;
                        }
                    }

                    //check intermediate points for each remaining roll
                    var numberOfMovesTaken=0;
                    for(var i = 0; i<fromDelta.length;i++){
                        if(fromDelta[i] !== ''){
                            numberOfMovesTaken++;
                        }
                    }
                    //One move for two rolls
                    if(remainingMoves.length === 2 && numberOfMovesTaken === 1){

                        if(currentPlayer === 'W'){
                            if(heldBy(board,fromDelta[0] + remainingMoves[0]) === 'B' &&
                                heldBy(board, fromDelta[0] + remainingMoves[1]) === 'B'){
                                return false;
                            }
                        }

                        if(currentPlayer ==='B'){
                            if(heldBy(board,fromDelta[0] - remainingMoves[0]) === 'W' &&
                                heldBy(board, fromDelta[0] - remainingMoves[1]) === 'W'){
                                return false;
                            }
                        }
                        //Case of rolling doubles
                    }else if (remainingMoves.length === 4){

                        for( var i = 0; i<=numberOfMovesTaken; i++){

                            if(currentPlayer === 'W'){
                                for(var j = fromDelta[i]; j<= toDelta[i]; j + (remainingMoves[0])){
                                    if(heldBy(board, j) === 'B'){
                                        return false;
                                    }
                                }
                            }else{
                                for(var j = fromDelta[i]; j>= toDelta[i]; j - remainingMoves[0]){
                                    if(heldBy(board, j) === 'W'){
                                        return false;
                                    }
                                }
                            }

                        }
                    }

                    //Iterate through all rolls and check that all moves can be made together
                    var unusedRolls = remainingMoves;

                    for(var i = 0; i < fromDelta.length; i++){
                        if(fromDelta[i] !== '' && toDelta[i] !== 0 && toDelta[i] !== 27){
                            //Check what rolls are left over after each move is made.
                            unusedRolls = (getUnusedRolls(fromDelta[i], toDelta[i], unusedRolls));
                        }
                    }

                    for(var i = 0; i< fromDelta.length; i++){
                        if(toDelta[i] === 0 || toDelta[i] === 27){

                            var totalNumberOfSpaces = Math.abs(fromDelta[i] - toDelta[i]);
                            //Trying to exit but no moves left
                            if(unusedRolls.length === 0){
                                return false;
                            }

                            //Else check that there is a large enough roll total to exit, and remove from unused, look
                            //for smallest amount that will get off the board
                            unusedRolls.sort(function(a, b){return b-a});
                            var runningTotal = 0;

                            for(var j = unusedRolls.length + 1; j >= 0 ;j){

                                if(runningTotal + unusedRolls[j] >= totalNumberOfSpaces){
                                    //Remove the elements that are used
                                    unusedRolls.splice(j, unusedRolls.length - (j + 1));
                                    runningTotal = 0;
                                    break;
                                }

                            }

                        }
                    }

                    return true;


                }


                /**
                 *
                 * @param board current board state before a move is made
                 * @param fromDelta array of starting positions, has 4 moves only one is required, the remaining
                 * are for two blots moving in the case of chaining a roll, or up to 4 blots moving in the case the
                 * roll is doubles. Represented as a single number for the point on the board.
                 * @param toDelta array of ending positions, has 4 moves only one is required, the remaining are for
                 * two blots in the case of chaining a roll, or up to 4 blots moving in the case the player rolls
                 * doubles. Represented as a single number.
                 * @param {Array.<int>} dice an array of two dice rolls
                 * @param turnIndexBeforeMove players turn before the roll
                 */
                function createMove(board, fromDelta, toDelta, dice, turnIndexBeforeMove){
                    //To track remaining dice moves that haven't been taken
                    var remainingMoves = totalMoves(dice);
                    var currentPlayer;
                    var opposingPlayer;

                    if(turnIndexBeforeMove === 0){
                        currentPlayer = 'W';
                        opposingPlayer = 'B';
                    }else{
                        currentPlayer = 'B';
                        opposingPlayer = 'W';
                    }

                    //Checks if the player has utilized full dice roll, if not check if other legal moves availible
                    if(!hasUsedFullRoll(fromDelta,toDelta,remainingMoves)){

                        var unusedRolls = getUnusedRolls(fromDelta, toDelta , remainingMoves);

                        if(hasLegalMove(board,unusedRolls,currentPlayer)){
                            throw new Error(ILLEGAL_CODE.INCOMPLETE_MOVE);
                        }
                    }

                    //Check that all blots that were taken entered before other moves were made
                    for(var i = 0; i < toDelta.length; i++){
                        if(toDelta[i] === 1 || toDelta[i] === 26){
                            //If player didn't move off the taken spot then check if any other moves were made
                            for(var j = 0; j<toDelta.length;j++){

                                //If a move was made that didn't remove a blot back onto the board then decalre an
                                //illegal move
                                if(fromDelta[j] !== '' && toDelta[j] !== '' && Math.abs(fromDelta[j] - toDelta[j]) > 0 &&
                                    !(fromDelta[j] === 1 || fromDelta[j] === 26)){
                                    throw new Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                                }

                            }

                        }
                    }

                    //Ensure that player exiting the board is allowed to
                    var remainingRolls = [[]];
                    for(var i = 0; i < toDelta.length; i++){
                        if(currentPlayer === 'W' && toDelta[i] === 27){
                            if(!canExit(board,currentPlayer)){
                                return Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                            }
                        }

                        if(currentPlayer === 'W' && toDelta[i] === 27){
                            if(!canExit(board,currentPlayer)){
                                return Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                            }
                        }
                    }

                    //Check that the to point is not held by opposing player
                    for( var i = 0; i < toDelta; i++){
                        if(heldBy(board, toDelta[i]) === opposingPlayer){
                            throw new Error(ILLEGAL_CODE.ILLEGAL_DELTA);
                        }
                    }

                    //check intermediate points for each remaining roll
                    var numberOfMovesTaken=0;
                    for(var i = 0; i<fromDelta.length;i++){
                        if(fromDelta[i] !== ''){
                            numberOfMovesTaken++;
                        }
                    }
                    //One move for two rolls
                    if(remainingMoves.length === 2 && numberOfMovesTaken === 1){

                        if(currentPlayer === 'W'){
                            if(heldBy(board,fromDelta[0] + remainingMoves[0]) === 'B' &&
                            heldBy(board, fromDelta[0] + remainingMoves[1]) === 'B'){
                                throw Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                            }
                        }

                        if(currentPlayer ==='B'){
                            if(heldBy(board,fromDelta[0] - remainingMoves[0]) === 'W' &&
                                heldBy(board, fromDelta[0] - remainingMoves[1]) === 'W'){
                                throw Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                            }
                        }
                    //Case of rolling doubles
                    }else if (remainingMoves.length === 4){

                        for( var i = 0; i<=numberOfMovesTaken; i++){

                            if(currentPlayer === 'W'){
                                for(var j = fromDelta[i]; j<= toDelta[i]; j + (remainingMoves[0])){
                                    if(heldBy(board, j) === 'B'){
                                        throw Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                                    }
                                }
                            }else{
                               for(var j = fromDelta[i]; j>= toDelta[i]; j - remainingMoves[0]){
                                   if(heldBy(board, j) === 'W'){
                                       throw Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                                   }
                               }
                            }

                        }



                    }

                    //Iterate through all rolls and check that all moves can be made together
                    var unusedRolls = remainingMoves;

                    for(var i = 0; i < fromDelta.length; i++){
                        if(fromDelta[i] !== '' && toDelta[i] !== 0 && toDelta[i] !== 27){
                            //Check what rolls are left over after each move is made.
                            unusedRolls = (getUnusedRolls(fromDelta[i], toDelta[i], unusedRolls));
                        }
                    }

                    for(var i = 0; i< fromDelta.length; i++){
                        if(toDelta[i] === 0 || toDelta[i] === 27){

                            var totalNumberOfSpaces = Math.abs(fromDelta[i] - toDelta[i]);
                            //Trying to exit but no moves left
                            if(unusedRolls.length === 0){
                                throw Error(ILLEGAL_CODE.ILLEGAL_MOVE);
                            }

                            //Else check that there is a large enough roll total to exit, and remove from unused, look
                            //for smallest amount that will get off the board
                            unusedRolls.sort(function(a, b){return b-a});
                            var runningTotal = 0;

                            for(var j = unusedRolls.length + 1; j >= 0 ;j){

                                if(runningTotal + unusedRolls[j] >= totalNumberOfSpaces){
                                    //Remove the elements that are used
                                    unusedRolls.splice(j, unusedRolls.length - (j + 1));
                                    runningTotal = 0;
                                    break;
                                }

                            }

                        }
                    }


                    //All tests passed then alter the board, set turn index and return
                    var currentBoard = board;
                    for(var i = 0; i < fromDelta.length; i++){
                        if(fromDelta[i] !== ''){
                            currentBoard = makeMove(currentBoard, fromDelta[i], toDelta[i],currentPlayer);
                        }
                    }

                    var setTurn;
                    //check of there is an end of game scenario
                    if(hasWon(currentPlayer, board)){
                        setTurn = {endMatch: {endMatchScores:
                            (currentPlayer === 'W' ? [1, 0] : (currentPlayer === 'B' ? [0, 1] : [0, 0]))}};
                    }else{
                        setTurn = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
                    }

                    return [setTurn,
                        {set:{key:'board', value: currentBoard}},
                        {set:{key:'fromDelta', value:{fromDelta:toDelta}}},
                        {set:{key:'toDelta', value:{toDelta:toDelta}}},
                        {set:{key:'dice',value:{dice:dice}}}];

                }


                /**
                 * Returns true if a player has won the game.
                 * @param player
                 * @param board
                 * @returns {boolean}
                 */
                function hasWon(player, board){
                    var count = 0;
                    var row = winIndex(player);

                    for(var i = 0; i< board[row].length;i++){
                        if(board[row][i] === player){
                            count++;
                        }
                    }

                    return count === 15;

                }

                /**
                 * Returns a board after a single move is made.
                 * @param board
                 * @param from
                 * @param to
                 * @param player
                 * @returns {*}
                 */
                function makeMove(board, from, to, player){

                    //remove piece from current spot get furthest element index
                    for(var i = 14; i >= 0; i-- ){
                        if(board[from][i] === player){
                            board[from][i] = '';
                            break;
                        }
                    }

                    //check if to spot has an opposing player
                    if(board [to][0] === opposingPlayer(player)){
                        //Replace with current player
                        board [to][0] = player;

                        //Put opposing player in taken position
                        var row = takenIndex(opposingPlayer(player));
                        var column = firstEmptySpot(board, row);

                        board[row][column] = opposingPlayer(player);
                        return board;
                    }

                    //if no opposing player then find first empty spot and place piece
                    var column = firstEmptySpot(board, to);
                    board[to][column] = player;


                }

                /**
                 * Gives the color of the opponent given a player
                 * @param player
                 * @returns {string}
                 */
                function opposingPlayer(player){
                    if(player === 'W'){
                        return 'B';
                    }else{
                        return 'W';
                    }
                }

                /**
                 * Given a player returns the index of where the player is held in case of capture.
                 * @param player
                 */
                function takenIndex(player){
                    if(player === 'W'){
                        return 1;
                    }else{
                        return 26;
                    }
                }

                /**
                 * Returns teh index of the row that
                 * @param player
                 * @returns {number}
                 */
                function winIndex(player){
                    if(player === 'W'){
                        return 27;
                    }else{
                        return 0;
                    }
                }

                /**
                 * Finds the first empty position given a row index and a board.
                 * @param board
                 * @param row
                 */
                function firstEmptySpot(board, row){
                    for(var i = 0; i < board[row].length; i++){
                        if(board[row][i] === ''){
                            return i;
                        }
                    }
                }

                /**
                 * Expands the dice rolls into an array of 4 if doubles are rolled, otherwise returns an un-altered
                 * dice object.
                 * @param dice
                 */
                function totalMoves(dice){
                    if(dice[0] === dice[1]){
                        return [dice[0],dice[0],dice[0],dice[0]];
                    }else{
                        return dice;
                    }
                }

                /**
                 * Returns the player that is currently holding the point on the board, if not held then returns and
                 * empty string. Returns undefined if the point index is off the board.
                 * @param board
                 * @param pointIndex
                 */
                function heldBy(board, pointIndex){

                    var countHeld = 0;
                    var color;

                    if(pointIndex > 25 || pointIndex < 2){
                        return undefined;
                    }

                    for(var i = 0; i < 15; i++){
                        if(board[pointIndex][i] !== ''){
                            countHeld++;
                            color = board[pointIndex][i];
                            if(countHeld >= 2){
                                return color;
                            }
                        }
                    }
                    //Less than two blots on the space found
                    return '';

                }

                /**
                 * Check if the full roll has been used, if not then return false.
                 * @param fromDelta
                 * @param toDelta
                 * @param player
                 * @param remainingMoves
                 */
                function hasUsedFullRoll(fromDelta, toDelta, remainingMoves){

                    var totalDice = 0;

                    //Sum of total dice rolls
                    for(var i = 0 ; i< remainingMoves.length; i++){
                        if(remainingMoves[i]!== ''){
                            totalDice = totalDice + remainingMoves[i];
                        }

                    }

                    //Sum of total spaces moved
                    var totalDelta =0;
                    for(var i = 0; i< toDelta; i++){
                        if(toDelta[i] !== ''){
                            totalDelta = totalDelta + Math.abs(toDelta - fromDelta);
                        }
                    }

                    return  totalDice === totalDelta;

                }

                /**
                 * Returns an array of dice rolls that haven't been used
                 * @param fromDelta
                 * @param toDelta
                 * @param remainingMoves
                 * @param board
                 * @param player
                 */
                function getUnusedRolls(fromDelta, toDelta , remainingMoves){


                    var deltaArray =[];
                    //Get the distance traveled
                    for(var i = 0; i<fromDelta.length;i++){

                        if(fromDelta[i] !== ''){
                            deltaArray.push(Math.abs(fromDelta[i] - toDelta[i]));
                        }
                    }

                    var sum = 0;
                    //Check if any combination of dice rolls equals that number, if found then delete from remaing moves
                    for(var i = 0 ; i < deltaArray.length; i++){
                        for( var j = remainingMoves.length -1 ; j>=0;j--){
                            sum = 0;
                            for (var k = j - 1; k>=0;k--){
                                if(remainingMoves[k] + sum === deltaArray[i]){
                                    remainingMoves.splice(k,(j-k));
                                }
                            }
                        }
                    }
                    return remainingMoves;
                }

                /**
                 * Checks if a legal move can be made based on the number of moves remaining, checks for a single move
                 * @param board
                 * @param remainingMoves
                 * @param player
                 * @returns {boolean}
                 */
                function hasLegalMove(board, remainingMoves, player){

                    //if player waiting entry to board, can they enter?
                    if(player === 'W' && board[1][0] ==='W') {

                        for (var i = 0; i < remainingMoves.length; i++) {
                            if (heldBy(board, remainingMoves[i]) !== 'B') {
                                return true;
                            }
                        }
                        return false;
                    }

                    if (player === 'B' && board[26][0] === 'B'){
                        for(var i = 0 ; i<remainingMoves.length; i++){
                            if(heldBy(board, 26 - remainingMoves[i] !== 'W')){
                                return true;
                            }
                        }
                        return false;
                    }

                    //if player can exit the board did they?
                    if(player === 'W' && canExit(board, player)){
                        for(var i = 0; i < remainingMoves.length; i++){
                            for(var j = 19; j <=25; j++){
                                if(board[j][0] === 'W' && j + remainingMoves[i] > 25){
                                    return true;
                                }
                            }
                        }
                    }

                    if(player === 'B' && canExit(board, player)){
                        for(var i = 0; i < remainingMoves.length; i++){
                            for(var j = 2; j <=7; j++){
                                if(board[j][0] === 'B' && j - remainingMoves[i] < 2){
                                    return true;
                                }
                            }
                        }
                    }

                    //All other moves not blocked?
                    if(player === 'W'){
                        for(var i = 1; i <= 25; i++){
                            for(var j = 0; j<remainingMoves.length;j++){
                                if(board[i][0] === 'W'){
                                    if(heldBy(board, i + remainingMoves[j]) !== 'B' &&
                                        heldBy(board, i + remainingMoves[j]) !== undefined){
                                        return true;
                                    }
                                }
                            }
                        }
                    }

                    if(player === 'B'){
                        for(var i = 25; i >= 2; i--){
                            for(var j = 0; j < remainingMoves.length; j++){
                                if(board[i][0] === 'B'){
                                    if(heldBy(board, i - remainingMoves[j]) !== 'W' &&
                                        heldBy(board, i - remainingMoves[j]) !== undefined){
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }

                /**
                 * Checks if a player has all blots on home board.
                 * @param board
                 * @param player
                 * @returns {boolean}
                 */
                function canExit(board, player){
                    //Check if white player blots only on home board. Home board is index
                    var countOnHomeBoard = 0;
                    if(player === 'W'){
                        for(var i = 1; i < 26; i++){
                            for(var j = 0; j <= 15; j++){
                                if(board[i][j] === 'W'){
                                    if(i < 20){
                                        return false;
                                    }else{
                                        countOnHomeBoard++;
                                    }
                                }
                            }
                        }
                    }

                    if(player === 'B'){
                        for(var i = 27; i >= 2; i--){
                            for(var j = 0; j <= 15; j++){
                                if(board[i][j] === 'B'){
                                    if(i > 7){
                                        return false;
                                    }else{
                                        countOnHomeBoard++;
                                    }
                                }
                            }
                        }
                    }

                    if(countOnHomeBoard>0){
                        return true;
                    }
                }


                return {
                    isMoveOk: isMoveOk,
                    createMove: createMove,
                    getInitialBoard: getInitialBoard
                };
            }]);
}());