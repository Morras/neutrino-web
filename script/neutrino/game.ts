import {Piece} from "./piece";
import {State} from "./state";

export const PlayerOneHomeRow = 0;
export const PlayerTwoHomeRow = 4;
export const Rows = 5;
export const Columns = 5;

export class Move {
    constructor(public fromX: number, public fromY: number, public toX: number, public toY: number) { }
}

export interface MoveResult {
    success: boolean;
    errorMessage?: string;
}

export interface MoveLegalityDecider {
    (move: Move, game: Game): MoveResult;
}

export interface NextStateDecider {
    (game: Game): State;
}

export class Game {
    private board: Piece[][] = [[], [], [], [], []];
    public state: State;
    private isMoveLegal: MoveLegalityDecider;
    private nextState: NextStateDecider;

    constructor(moveLegalityDecider: MoveLegalityDecider, nextStateDecider: NextStateDecider);
    constructor(moveLegalityDecider: MoveLegalityDecider, nextStateDecider: NextStateDecider, board?: Piece[][], state?: State);

    constructor(moveLegalityDecider: MoveLegalityDecider, nextStateDecider: NextStateDecider, board?: Piece[][], state?: State) {
        this.isMoveLegal = moveLegalityDecider;
        this.nextState = nextStateDecider;
        if (board) {
            this.board = board;
            this.state = state;
        } else {
            this.setupDefaultGame();
            this.state = State.PlayerOneMoveNeutrino;
        }
    }

    getPieceAt(x: number, y: number): Piece {
        return this.board[x][y];
    }

    makeMove(move: Move): MoveResult {
        let moveResult = this.isMoveLegal(move, this);
        if (!moveResult.success) {
            return moveResult;
        }

        let movingPiece = this.getPieceAt(move.fromX, move.fromY);
        this.setPieceAt(move.fromX, move.fromY, Piece.None);
        this.setPieceAt(move.toX, move.toY, movingPiece);

        this.state = this.nextState(this);

        return { success: true };
    }

    private setupDefaultGame() {
        for (let x = 0; x < Rows; x++) {
            for (let y = 0; y < Columns; y++) {
                // Default to an empty piece
                let piece = Piece.None;
                // Player one home row
                if (y === PlayerOneHomeRow) {
                    piece = Piece.Player1;
                    // Player two home row
                } else if (y === PlayerTwoHomeRow) {
                    piece = Piece.Player2;
                    // Neutrino in the middle
                } else if (x === 2 && y === 2) {
                    piece = Piece.Neutrino;
                }
                this.setPieceAt(x, y, piece);
            }
        }
    }

    private setPieceAt(x: number, y: number, piece: Piece) {
        this.board[x][y] = piece;
    }
}