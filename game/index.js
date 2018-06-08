let Engine = require('./engine').Engine;
let engine = new Engine();

let Mongodb = require('./mongodb');
let mongodb = new Mongodb({
    url: "mongodb://www.cross-zero.info",
    port: 27017,
    maxBufferSz: 10000
});

let chat = function(client) {
    console.log('Client connected...');

    client.on('getId', function (mapSize) {
        let gameId = engine.createGame(mapSize);

        console.log('newGameId: ' + gameId);
        client.emit('newId', gameId);
    });

    client.on('human', function (data) {
        let query;

        try {
            console.log('New data from client: ' + data);

            query = JSON.parse(data);
            let state = engine.makeQuery(query);

            if (state.result === "GameOver") {
                let history = engine.getGameHistory(query.id);
                console.log("game over with: " + JSON.stringify(history));
                mongodb.addGameHistory(history);
            }

            let message = JSON.stringify(state);
            console.log(message);

            setTimeout(() => {
                client.emit('computer', message);
            }, 100);
        }
        catch (err) {
            let state = {
                result: "Error",
                info: 'incorrect query from client: ' + query + ', trying to parse JSON made an error: ' + err,
                status: null,
                step: null
            };

            let message = JSON.stringify(state);
            console.log(message);
            client.emit('computer', message);
        }
    });

    client.on('getHistory', function () {
        mongodb.extractAllHistory((err, history) => {
            if(err) {
                client.emit('history', "ERROR: mongodb unavailable now, err: " + err);
            }
            else {
                client.emit('history', JSON.stringify(history));
            }
        });
    });
};

module.exports = function(server) {
    let io = require('socket.io')(server);
    io.on('connection', chat);
    return io;
};