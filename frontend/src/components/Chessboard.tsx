import { Color, PieceSymbol, Square } from "chess.js";

export const ChessBoard = ({ board }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
}) => {
    return <div className="text-white-200">
            {board.map((row, i) => {
                return <div key={i} className="flex justify-center">
                    {row.map((square, j) => {
                        return <div key={j} className="w-12 h-12 flex justify-center items-center">
                            {square ? square.type : ""}
                        </div>;
                    })}
                </div>;
            })}
    </div>
}