import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board:Chess;
    private startTime:Date;

    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.startTime=new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }
        }));
    }

    makeMove(socket:WebSocket,move:{
        from:string,
        to:string,
    }){
        if(socket !== this.player1 && this.board.moves.length%2 === 0){
            return;
        }
        if(socket !== this.player2 && this.board.moves.length%2 === 1){
            return;
        }
        try {
            this.board.move(move); 
        } catch (error) {
            return;
        }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:'GAME_OVER',
                //winner:this.board.turn()==='w'?'player1':'player2',
                winner:this.board.turn()==='w'?'black':'white',
                time:new Date().getTime()-this.startTime.getTime()
            }));
            this.player2.send(JSON.stringify({
                type:'GAME_OVER',
                //winner:this.board.turn()==='w'?'player2':'player1',
                winner:this.board.turn()==='w'?'black':'white',
                time:new Date().getTime()-this.startTime.getTime()
            })); 
        }

        if(this.board.moves.length%2 === 0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move,
            }));
        }
        else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move,
            }));
        }
                    
    }
}