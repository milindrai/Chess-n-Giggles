import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

interface ChessBoardProps {
    chess: any;
    setBoard: (board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]) => void;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}

export const ChessBoard = ({ chess, board, socket, setBoard }: ChessBoardProps) => {
    const [from, setFrom] = useState<null | Square>(null);
    const [to, setTo] = useState<null | Square>(null);

    const handleSquareClick = (squareRepresentation: Square) => {
        if (!from) {
            setFrom(squareRepresentation);
        } else {
            socket.send(JSON.stringify({
                type: MOVE,
                payload: {
                    move:{
                        from: from,
                        to: squareRepresentation
                    }
                }
            }));

            chess.move({
                from: from,
                to: squareRepresentation
            });
            setBoard(chess.board());
            setFrom(null);
        }
    };

    return (
        <div className="text-white-200">
            {board.map((row, i) => (
                <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        return (
                            <div
                                key={j}
                                onClick={() => handleSquareClick(squareRepresentation)}
                                className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-green-100'}`}
                            >
                                <div className="w-full flex justify-center">
                                    <div className="h-full flex-col flex justify-center">
                                        {square ? square.type : ""}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
