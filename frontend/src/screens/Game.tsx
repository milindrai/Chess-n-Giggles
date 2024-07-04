import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const MOVE = "move";


export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case "init_game":
                    setChess(new Chess());
                    setBoard(chess.board());
                    break;
                case "move":
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    break;
                case "game_over":
                    break;
            }
        }
    }, [socket]);

    if (!socket) {
        return <div>
            <h1>Connecting to server...</h1>
        </div>;
    }

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex flex flex-col justify-center">
                        <ChessBoard chess= {chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                    <div className="col-span-2 bg-green-200 w-full">
                        <div className="pt-16">
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
            </div>
        </div>
    );
};
