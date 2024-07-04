import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());


    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case "init_game":
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("Game started");
                    break;
                case "move":
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made");
                    break;
                case "game_over":
                    console.log("Game over");
                    break;
                default:
                    console.log("Unknown message type");
            }
        };
    }, [socket, chess]);

    if (!socket) {
        return <div>
            <h1>Connecting to server...</h1>
        </div>;
    }
    return <div className="justify-center flex">
        <div className="pt-8 max-w-screen-lg">
            <div className="grid grid-cols-6 gap-4 md:grid-cols-2">
                <div>
                    <ChessBoard board={board} />
                </div>
                <div>
                    <Button onClick={() => {
                        socket.send(JSON.stringify({
                            type: "init_game",
                        }));
                    }}>
                        Play
                    </Button>
                </div>
            </div>
        </div>
    </div>;
};