import { WebSocket } from "ws";
import { Chess } from 'chess.js';
import { INIT_GAME, MOVE, GAME_OVER } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    makeMove(socket: WebSocket, move: { from: string, to: string }) {
        const turn = this.board.turn() === 'w' ? this.player1 : this.player2;

        if (socket !== turn) {
            return;
        }

        try {
            const result = this.board.move(move);
            if (result === null) {
                return;
            }
        } catch (error) {
            console.log(error);
            return;
        }

        const moveMessage = JSON.stringify({
            type: MOVE,
            payload: move,
        });

        this.player1.send(moveMessage);
        this.player2.send(moveMessage);

        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            const gameOverMessage = JSON.stringify({
                type: GAME_OVER,
                winner,
                time: new Date().getTime() - this.startTime.getTime()
            });
            this.player1.send(gameOverMessage);
            this.player2.send(gameOverMessage);
        }
    }
}
