const pcId = -1;
const freeId = 0;
const humanId = 1;
const drawId = 0;

function GameBoard(mapSize) {
    //------------------------------------------------------------------------------------------------------------------
    //private members
    //------------------------------------------------------------------------------------------------------------------
    let me = this;

    //to store game board state
    let arr = [];

    //to store game history, step by step
    let history = [];

    for (let i = 0; i < mapSize; i++) {
        arr[i] = [];
        for (let j = 0; j < mapSize; j++)
            arr[i][j] = freeId;
    }

    let _checkWinner = function() {

        let total = 0;
        // --------------------------------------------------------------------------------
        // scan X row by row
        // --------------------------------------------------------------------------------
        for(let x = 0; x < arr.length; x++){
            total = 0;

            for(let y = 0; y < arr.length; y++)
                total += arr[x][y];

            if(Math.abs(total) === arr.length) {
                return total < 0 ? {rez: pcId, x: x, y: null}: {rez: humanId, x: x, y: null};
            }
        }

        // --------------------------------------------------------------------------------
        // scan Y col by col
        // --------------------------------------------------------------------------------
        for(let y = 0; y < arr.length; y++){
            total = 0;

            for(let x = 0; x < arr.length; x++)
                total += arr[x][y];

            if(Math.abs(total) === arr.length) {
                return total < 0 ? {rez: pcId, x: null, y: y}: {rez: humanId, x: null, y: y};
            }
        }

        // --------------------------------------------------------------------------------
        // scan {1:1} - {len:len}
        // --------------------------------------------------------------------------------
        total = 0;
        for(let id = 0; id < arr.length; id++){
            total += arr[id][id];
        }
        if(Math.abs(total) === arr.length) {
            return total < 0 ? {rez: pcId, x: -1, y: null}: {rez: humanId, x: -1, y: null};
        }

        // --------------------------------------------------------------------------------
        // scan {len:1} - {1:len}
        // --------------------------------------------------------------------------------
        total = 0;
        for(let id = 0; id < arr.length; id++){
            total += arr[arr.length - 1 - id][id];
        }
        if(Math.abs(total) === arr.length) {
            return total < 0 ? {rez: pcId, x: null, y: -1}: {rez: humanId, x: null, y: -1};
        }

        // --------------------------------------------------------------------------------
        // check if draw
        // --------------------------------------------------------------------------------
        let drawCondition = true;
        for(let x = 0; x < arr.length && drawCondition; x++){
            for(let y = 0; y < arr.length && drawCondition; y++)
            {
                //не ничья, если есть хотя бы одна свободная клетка
                drawCondition = arr[x][y] !== freeId;
            }
        }

        if(drawCondition) {
            return {rez: 0, x: null, y: null};
        }

        // --------------------------------------------------------------------------------
        // no winner found
        // --------------------------------------------------------------------------------
        return {rez: null, x: null, y: null};
    };

    let _priorityStep = function(playerId) {

        let total = 0;
        let id = null;

        // --------------------------------------------------------------------------------
        // scan X row by row
        // --------------------------------------------------------------------------------
        for(let x = 0; x < arr.length; x++){
            total = 0;

            for(let y = 0; y < arr.length; y++) {
                total += arr[x][y] === playerId ? 1 : 0;
                if(arr[x][y] !== playerId) id = y;
            }

            if(arr.length - Math.abs(total) === 1 && arr[x][id] === freeId) {
                me.step(x, id, pcId);
                return {rez: pcId, x: x, y: id};
            }
        }

        // --------------------------------------------------------------------------------
        // scan Y col by col
        // --------------------------------------------------------------------------------
        for(let y = 0; y < arr.length; y++){
            total = 0;

            for(let x = 0; x < arr.length; x++) {
                total += arr[x][y] === playerId ? 1 : 0;
                if(arr[x][y] !== playerId) id = x;
            }

            if(arr.length - Math.abs(total) === 1 && arr[id][y] === freeId) {
                me.step(id, y, pcId);
                return {rez: pcId, x: id, y: y};
            }
        }

        // --------------------------------------------------------------------------------
        // scan {1:1} - {len:len}
        // --------------------------------------------------------------------------------
        total = 0;

        for(let z = 0; z < arr.length; z++) {
            total += arr[z][z] === playerId ? 1 : 0;
            if(arr[z][z] !== playerId) id = z;
        }

        if(arr.length - Math.abs(total) === 1 && arr[id][id] === freeId) {
            me.step(id, id, pcId);
            return {rez: pcId, x: id, y: id};
        }

        // --------------------------------------------------------------------------------
        // scan {len:1} - {1:len}
        // --------------------------------------------------------------------------------
        total = 0;

        for(let z = 0; z < arr.length; z++) {
            total += arr[arr.length - 1 - z][z] === playerId ? 1 : 0;
            if(arr[arr.length - 1 - z][z] !== playerId) id = z;
        }

        if(arr.length - Math.abs(total) === 1 && arr[arr.length - 1 - id][id] === 0) {
            me.step(arr.length - 1 - id, id, pcId);
            return {rez: pcId, x: arr.length - 1 - id, y: id};
        }

        // --------------------------------------------------------------------------------
        // no step to win found
        // --------------------------------------------------------------------------------
        return {rez: null, x: null, y: null};
    };

    let _nextStep = function() {

        //try to occupy the middle of game area
        let id = Math.ceil(arr.length / 2) - 1;
        if(arr.length % 2 !== 0 && arr[id][id] === freeId) {
            me.step(id, id, pcId);
            return {rez: pcId, x: id, y: id};
        }

        //random choose not occupied cell
        let step = [];
        for(let x = 0; x < arr.length; x++)
            for(let y = 0; y < arr.length; y++)
                if(arr[x][y] === freeId) {
                    step.push({x: x, y:y});
                }

        id = Math.ceil(Math.random()*step.length - 1);
        me.step(step[id].x, step[id].y, pcId);
        return {rez: pcId, x: step[id].x, y: step[id].y};
    };
    //------------------------------------------------------------------------------------------------------------------
    //public members
    //------------------------------------------------------------------------------------------------------------------
    me.checkWinner = function () {
        return _checkWinner();
    };

    me.priorityStep = function (playerId) {
        return _priorityStep(playerId);
    };

    me.nextStep = function () {
        return _nextStep();
    };

    me.possibleToMove = function (x, y) {
        return x >= 0 && x < arr.length &&
            y >= 0 && y < arr.length &&
            arr[x][y] === freeId;
    };

    me.step = function (x, y, v) {
        history.push({
            x: x,
            y: y,
            value: v
        });
        arr[x][y] = v;
    };

    me.getHistory = function(){
        return history;
    };

    //------------------------------------------------------------------------------------------------------------------
    //for unit test only
    //------------------------------------------------------------------------------------------------------------------
    me.set = function(x, y, v) {
        arr[x][y] = v;
    };

    me.get = function (x, y) {
        return arr[x][y];
    };

    me.getSize = function(){
        return arr.length;
    };

    me.makeCopy = function(){

        let copied = new GameBoard(me.getSize());
        for(let x = 0; x < me.getSize(); x++)
            for(let y = 0; y < me.getSize(); y++)
                copied.set(x, y, me.get(x,y));

        return copied;
    }
    //------------------------------------------------------------------------------------------------------------------
}
module.exports.GameBoard = GameBoard;

function Engine() {
    let me = this;
    let gameArray = [];

    me.createGame = function(mapSize) {
        return gameArray.push({
            id: gameArray.length,
            board: new GameBoard(mapSize)
        }) - 1;
    };

    me.gameExists = function(id) {
        return id >= 0 && id < gameArray.length;
    };

    me.getGameHistory = function(id) {
        return me.gameExists(id) ?
            {
                history: gameArray[id].board.getHistory(),
                result: gameArray[id].board.checkWinner(),
                dtReport: new Date()
            }:
            null;
    };

    me.possibleToMove = function (id, x, y) {
        return gameArray[id].board.possibleToMove(x, y);
    };

    me.stepIsCorrect = function(humanStep) {
        return humanStep !== undefined &&
            humanStep.id !== undefined &&
            me.gameExists(humanStep.id) &&
            me.possibleToMove(humanStep.id, humanStep.x, humanStep.y);
    };

    me.humanMakeMove = function(humanStep) {
        gameArray[humanStep.id].board.step(humanStep.x, humanStep.y, humanId);
    };

    me.getBoardState = function(status, step) {

        //possible results:
        //  -1  - pc win
        //   0  - draw
        //   1  - human win
        // null - game in progress, no result still

        if(status.rez === pcId){
            return {
                result: "GameOver",
                info: "Computer win",
                status: status,
                step: step
            };
        }

        if(status.rez === drawId) {
            return {
                result: "GameOver",
                info: "Human vs Computer = Draw",
                status: status,
                step: step
            };
        }

        if(status.rez === humanId) {
            return {
                result: "GameOver",
                info: "Human win",
                status: status,
                step: step
            };
        }

        if(status.rez !== null) {
            return {
                result: "Error",
                info: "Incorrect board state",
                status: status,
                step: step
            };
        }

        return null;
    };

    me.makeQuery = function(query) {

        if(!me.stepIsCorrect(query)) {
            return {
                result: "Error",
                info: "Incorrect query",
                status: null,
                step: null
            };
        }

        me.humanMakeMove(query);

        let status = gameArray[query.id].board.checkWinner();
        let boardState = me.getBoardState(status, null);
        if(boardState) return boardState;

        //try to win
        let step = gameArray[query.id].board.priorityStep(pcId);

        //prevent do not lose
        if(step.rez === null)
            step = gameArray[query.id].board.priorityStep(humanId);

        //next step
        if(step.rez === null)
            step = gameArray[query.id].board.nextStep();

        //scan for end of game
        status = gameArray[query.id].board.checkWinner();
        boardState = me.getBoardState(status, step);

        //return result (win/draw/game progress)
        return boardState || {
            result: "GameProgress",
            info: "PC makes retaliatory move",
            status: status,
            step: step
        };
    };
}

module.exports.Engine = Engine;
