import { WebSocket } from 'ws';
import { Game } from "./Game";
import {
  GAME_OVER,
  INIT_GAME,
  JOIN_GAME,
  MOVE,
  OPPONENT_DISCONNECTED,
  JOIN_ROOM,
  GAME_JOINED,
  GAME_NOT_FOUND,
  GAME_ALERT,
  GAME_ADDED,
  GAME_ENDED,
} from './messages';




export class GameManager{
    private games:Game[]; // array of games
    private pendingUser:WebSocket | null ; // array of users waiting to be matched
    private users:WebSocket[]; // array of users in the game

    constructor(){
        this.games = [];
        this.pendingUser=null;
        this.users=[]; 
    }

    addUser(socket :WebSocket ){
        this.users.push(socket);
        this.addHandler(socket)
    }

    removeUser(socket:WebSocket){
        this.users=this.users.filter(user=>user !==socket);
    }

    private addHandler(user: User) {
        user.socket.on('message', async (data) => {
          const message = JSON.parse(data.toString());
          if (message.type === INIT_GAME) {
            if (this.pendingGameId) {
              const game = this.games.find((x) => x.gameId === this.pendingGameId);
              if (!game) {
                console.error('Pending game not found?');
                return;
              }
              if (user.userId === game.player1UserId) {
                SocketManager.getInstance().broadcast(
                  game.gameId,
                  JSON.stringify({
                    type: GAME_ALERT,
                    payload: {
                      message: 'Trying to Connect with yourself?',
                    },
                  }),
                );
                return;
              }
              SocketManager.getInstance().addUser(user, game.gameId);
              await game?.updateSecondPlayer(user.userId);
              this.pendingGameId = null;
            } else {
              const game = new Game(user.userId, null);
              this.games.push(game);
              this.pendingGameId = game.gameId;
              SocketManager.getInstance().addUser(user, game.gameId);
              SocketManager.getInstance().broadcast(
                game.gameId,
                JSON.stringify({
                  type: GAME_ADDED,
                }),
              );
            }
          }
}