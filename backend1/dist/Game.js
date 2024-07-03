"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        const turn = this.board.turn() === 'w' ? this.player1 : this.player2;
        if (socket !== turn) {
            return;
        }
        try {
            const result = this.board.move(move);
            if (result === null) {
                return;
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
        const moveMessage = JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        });
        this.player1.send(moveMessage);
        this.player2.send(moveMessage);
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            const gameOverMessage = JSON.stringify({
                type: messages_1.GAME_OVER,
                winner,
                time: new Date().getTime() - this.startTime.getTime()
            });
            this.player1.send(gameOverMessage);
            this.player2.send(gameOverMessage);
        }
    }
}
exports.Game = Game;
