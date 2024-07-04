import { Button } from "../components/Button"
import { ChessBoard } from "../components/Chessboard"

export const Game = () => {
    return <div className="justify-center flex">
        <div className="pt-8 max-w-screen-lg">
            <div className="grid grid-cols-6 gap-4 md:grid-cols-2">
                <div>
                    <ChessBoard />
                </div>
                <div>
                    <Button onClick={() => navigate("/game")}>
                        Play 
                    </Button>
                </div>
            </div>
        </div>
    </div>
}