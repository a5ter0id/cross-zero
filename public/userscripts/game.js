/**
 * Created by FireHomePc on 05.06.2018.
 */
const mapSize = 3;
const emptyCell = "   ";

function setupGameMap(action) {
    for(let x = 1; x <= mapSize; x++)
        for(let y = 1; y <= mapSize; y++) {
            action("#sb" + x + y);
        }
}

$(document).ready(function(){
    if(document.getElementById('gameMap') !== null)
        $(function(){
            //-----------------------------------------------------------------------
            //Create game area according to mapSize
            //-----------------------------------------------------------------------
            let gameMap = document.getElementById("gameMap");
            setupGameMap((element) => {

                let button = document.createElement("input");
                button.type = "button";
                button.value = emptyCell;
                button.className = "mapField";
                button.id = element.replace('#','');
                button.disabled = false;
                gameMap.appendChild(button);

                if(element[element.length-1].toString() === mapSize.toString()){
                    gameMap.appendChild(document.createElement("br"));
                }
            });

            let gameControl = document.getElementById("gameControl");
            let button = document.createElement("input");
            button.type = "button";
            button.value = "Новая игра";
            button.className = "btnNewGame";
            button.id = "newGame";
            button.onclick = function newGame(){
                setupGameMap((element) => {
                    $(element).val(emptyCell).prop('disabled', false).css("background-color",
                        document.getElementById('newGame').style.background);
                });
                $("#label").text("Ваш ход");
                $('#newGame').prop('disabled', true);
                socket.connect();
            };
            button.disabled = true;
            gameControl.appendChild(button);

            //-----------------------------------------------------------------------
            //Connect to server and retrive game id
            //-----------------------------------------------------------------------
            let gameId = null;
            let socket = io.connect();

            socket.on('newId', function(data) {
                gameId = data;
                console.log("gameId: " + gameId);

                setupGameMap((element) => {
                    $(element).val(emptyCell).prop('disabled', false);
                });
            });

            socket.on('connect', function(data) {
                socket.emit('getId', mapSize);
            });

            //-----------------------------------------------------------------------
            //Playing against the computer
            //-----------------------------------------------------------------------
            setupGameMap(function setClickFunction(element){
                $(element).click(function(e){
                    console.log("client - next move");

                    e.preventDefault();
                    $(element).val("X").prop('disabled', true);
                    $("#label").text("Ход комьютера");

                    setupGameMap(function pauseGame(element){
                        if($(element).val() === emptyCell)
                            $(element).prop('disabled', true);
                    });

                    socket.emit('human', JSON.stringify({
                        id: gameId,
                        x: +element.replace('#sb','')[0]-1,
                        y: +element.replace('#sb','')[1]-1,
                    }));
                });
            });

            socket.on('computer', function(data) {
                console.log("message from server: " + data);

                try {
                    let state = JSON.parse(data);

                    if(state.result === "Error") {
                        console.log("Server could not understand client query, " + state.info);
                    }
                    else {
                        //if step of computer exists
                        if(state.step !== null) {
                            $("#sb" + (+state.step.x + 1) + "" + (+state.step.y + 1)).val("0").prop('disabled', true);
                        }

                        switch(state.result){
                            case "GameProgress":
                                setupGameMap(function resumeGame(element){
                                    if($(element).val() === emptyCell)
                                        $(element).prop('disabled', false);

                                    $("#label").text("Ваш ход");
                                });
                                break;
                            case "GameOver":
                                let stateGame = state.status;

                                if(stateGame.rez === 0) {
                                    setupGameMap((element) => {
                                        $(element).css("background-color", "gray");
                                    });
                                }

                                if(stateGame.x === null && stateGame.y === -1) {
                                    setupGameMap((element) => {
                                        let x = +element.replace('#sb','')[0];
                                        let y = +element.replace('#sb','')[1];

                                        if(mapSize - x + 1 === y)
                                            $(element).css("background-color", stateGame.rez === -1 ? "DarkRed" : "lime");
                                    });
                                }

                                if(stateGame.x === -1 && stateGame.y === null) {

                                    setupGameMap((element) => {
                                        let x = +element.replace('#sb','')[0];
                                        let y = +element.replace('#sb','')[1];

                                        if(x === y)
                                            $(element).css("background-color", stateGame.rez === -1 ? "DarkRed" : "lime");
                                    });
                                }

                                if(stateGame.x !== null) {

                                    setupGameMap((element) => {
                                        let x = +element.replace('#sb','')[0]-1;

                                        if(x === stateGame.x)
                                            $(element).css("background-color", stateGame.rez === -1 ? "DarkRed" : "lime");
                                    });
                                }

                                if(stateGame.y !== null) {

                                    setupGameMap((element) => {
                                        let y = +element.replace('#sb','')[1]-1;

                                        if(y === stateGame.y)
                                            $(element).css("background-color", stateGame.rez === -1 ? "DarkRed" : "lime");
                                    });
                                }

                                switch (stateGame.rez){
                                    case -1:
                                        $("#label").text("Увы, победа компьютера");
                                        break;
                                    case 0:
                                        $("#label").text("Ничья");
                                        break;
                                    case 1:
                                        $("#label").text("Поздравляем, вы победили!");
                                        break;
                                }

                                $('#newGame').prop('disabled', false);
                                socket.disconnect();

                                break;
                            default:
                                console.log("Incorrect game status: " + state.result);
                                break;
                        }
                    }
                }
                catch (err) {
                    console.log("Incorrect data from server, failed with error: " + err);
                }
            });
        });
});
