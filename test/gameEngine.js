let assert = require('assert');
let GameBoard = require('../game/engine').GameBoard;

describe('GameEngine', function() {
    describe('checkWinner()', function() {

        it('Winner exists', function() {

            let sz = 5;
            let board = null;
            for(let playerCode = -1; playerCode <= 1; playerCode += 2) {

                for(let y = 0; y < sz; y++) {
                    board = new GameBoard(sz);
                    for(let x = 0; x < sz; x++)board.set(x, y, playerCode);

                    assert.equal(JSON.stringify(board.checkWinner()), JSON.stringify({rez: playerCode, x: null, y: y}));
                }

                for(let x = 0; x < sz; x++) {
                    board = new GameBoard(sz);
                    for(let y = 0; y < sz; y++)board.set(x, y, playerCode);

                    assert.equal(JSON.stringify(board.checkWinner()), JSON.stringify({rez: playerCode, x: x, y: null}));
                }

                board = new GameBoard(sz);
                for(let z = 0; z < sz; z++) {
                    board.set(z, z, playerCode)
                }
                assert.equal(JSON.stringify(board.checkWinner()), JSON.stringify({rez: playerCode, x: -1, y: null}));

                board = new GameBoard(sz);
                for(let z = 0; z < sz; z++) {
                    board.set(sz - 1 - z, z, playerCode);
                }
                assert.equal(JSON.stringify(board.checkWinner()), JSON.stringify({rez: playerCode, x: null, y: -1}));
            }
        });

        it('Winner not exists', function() {

            let sz = 5;
            let board = null;

            for(let playerCode = -1; playerCode <= 1; playerCode++) {

                for(let y = 0; y < sz; y++) {
                    board = new GameBoard(sz);
                    for(let x = 0; x < sz; x++)board.set(x, y, playerCode);

                    board.set(1, y, 0);
                    assert.equal(board.checkWinner().rez, null);
                }

                for(let x = 0; x < sz; x++) {
                    board = new GameBoard(sz);
                    for(let y = 0; y < sz; y++)board.set(x, y, playerCode);

                    board.set(x, sz-1, 0);
                    assert.equal(board.checkWinner().rez, null);
                }

                board = new GameBoard(sz);
                for(let z = 0; z < sz; z++) {
                    board.set(z, z, playerCode);
                }
                board.set(sz - 1, sz - 1, 0);
                assert.equal(board.checkWinner().rez, null);

                board = new GameBoard(sz);
                for(let z = 0; z < sz; z++) {
                    board.set(sz - 1 - z, z, playerCode);
                }
                board.set(sz - 1, 0, 0);
                assert.equal(board.checkWinner().rez, null);
            }
        });
    });

    describe('priorityStep()', function() {

        it('Step to winner exists', function() {

            let sz = 5;
            let board = null;
            let pcId = -1;

            for(let playerCode = -1; playerCode <= 1; playerCode += 2) {
                for(let y = 0; y < sz; y++) {
                    board = new GameBoard(sz);

                    for(let x = 0; x < sz - 1; x++) board.set(x, y, playerCode);
                    assert.equal(JSON.stringify(board.priorityStep(playerCode)), JSON.stringify({rez: pcId, x: sz - 1, y: y}));
                }

                for(let x = 0; x < sz; x++) {
                    board = new GameBoard(sz);
                    for(let y = 1; y < sz; y++)board.set(x, y, playerCode);

                    assert.equal(JSON.stringify(board.priorityStep(playerCode)), JSON.stringify({rez: pcId, x: x, y: 0}));
                }

                board = new GameBoard(sz);
                for(let z = 1; z < sz; z++) {
                    board.set(z, z, playerCode);
                }
                assert.equal(JSON.stringify(board.priorityStep(playerCode)), JSON.stringify({rez: pcId, x: 0, y: 0}));

                board = new GameBoard(sz);
                for(let z = 0; z < sz - 1; z++) {
                    board.set(sz - 1 - z, z, playerCode);
                }
                assert.equal(JSON.stringify(board.priorityStep(playerCode)), JSON.stringify({rez: pcId, x: 0, y: sz - 1}));
            }
        });

    });

    describe('nextStep()', function() {

        it('Step to occupy a middle ceil', function() {

            let sz = 5;
            let board = new GameBoard(sz);
            let pcId = -1;

            assert.equal(JSON.stringify(board.nextStep()), JSON.stringify({rez: pcId, x: 2, y: 2}));
        });

        it('Any step', function() {

            let sz = 5;
            let pcId = -1;

            for(let testCount = 0; testCount < 100; testCount++) {
                let board = new GameBoard(sz);

                for(let x = 0; x < sz; x++)
                    for(let y = 0; y < sz; y++) {
                        board.set(x, y, Math.ceil(Math.random() * 3) - 2);
                    }

                let mapCopy = board.makeCopy();
                let nextStep = board.nextStep();

                assert.equal(nextStep.rez, pcId);
                assert.equal(mapCopy.get(nextStep.x, nextStep.y), 0);
            }
        });
    });
});
