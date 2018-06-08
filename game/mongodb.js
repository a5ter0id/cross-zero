let gameHistory = [];

function Mongodb(arg){
    let me = this;
    let client = require('mongodb').MongoClient;
    let dbo = null;
    let url = arg.url + ":" + arg.port;

    let gameHistory = [];

    client.connect(url, function(err, db) {

        if (err) throw err;

        dbo = db.db("cross-zero");

        console.log("Database created!");

    });

    setTimeout(function storeProcess(){
        if(dbo !== null) {
            while (gameHistory.length > 0) {

                let element = gameHistory.pop();
                dbo.collection("gameHistory").insertOne(element, function(err, res) {
                    if (err) {
                        gameHistory.push(element);
                        console.log("ERROR: Mongodb could not insert new history: " + JSON.stringify(element));
                    }
                    else{
                        console.log("Mongodb inserted new history: " + JSON.stringify(element));
                    }
                });
            }
        }
        setTimeout(storeProcess, 100);
    }, 100);

    me.addGameHistory = function(history){
        if(gameHistory.length < arg.maxBufferSz) {
            gameHistory.push(history);
        }
        else {
            console.log("WARNING: Mongodb history buffer length is achieved the max bound, reject income record");
        }
    };

    me.extractAllHistory = function(callback) {

	    //wait until mongo does not extract records
        let waitForConnection = function(callback) {
            if(dbo !== null) {
                dbo.collection('gameHistory', function(err, collection) {
                    collection.find().toArray(function(err, items) {
                        callback(err, items);
                    });
                });
            }
            else {
                setTimeout(waitForConnection, 100, callback);
            }
        };

        setTimeout(waitForConnection, 100, callback);
    }
}

// direct using mode (if module not required from another module)
if (require.main === module) {

    //to preserve some items in the config file is a good idea
    //in the future it needs to refactor
    let mongodb = new Mongodb({
        url: "mongodb://www.cross-zero.info",
        port: 27017,
        maxBufferSz: 10000
    });

    mongodb.extractAllHistory((items) => {
        console.log(JSON.stringify(items));
    });
}
else {
    module.exports = Mongodb;
}