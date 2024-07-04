export const ChessBoard = () => {
    return (
        <div className="grid grid-cols-8 grid-rows-8">
            {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex justify-center">
                    {Array.from({ length: 8 }, (_, j) => (
                        <div key={j} className="border-2 border-black"></div>
                    ))}
                </div>
            ))}
        </div>
    );
};