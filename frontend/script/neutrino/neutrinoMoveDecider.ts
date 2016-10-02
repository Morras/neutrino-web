import { Move, MoveResult, Game, Rows, Columns, PlayerOneHomeRow, PlayerTwoHomeRow } from "./game";
import { ErrorMessages } from "./errorMessages";
import { Piece } from "./piece";
import { State } from "./state";

export function neutrinoMoveDecider(move: Move, game: Game): MoveResult {
    if (moveIsOutsideTheBoard(move)) {
        return createNegativeMoveResult(ErrorMessages.moveIsOutsideTheBoard);
    }

    let state = game.state;
    let piece = game.getPieceAt(move.fromX, move.fromY);

    if (sourceSquareIsEmpty(game, move)) {
        return createNegativeMoveResult(ErrorMessages.noPieceMoved);
    }

    if (!mayPieceBeMovedInState(piece, state)) {
        return createNegativeMoveResult(ErrorMessages.wrongPieceMoved);
    }

    if (!moveIsAStraightLine(move)) {
        return createNegativeMoveResult(ErrorMessages.moveIsNotAStraightLine);
    }

    if (targetSquareIsOccupied(game, move)) {
        return createNegativeMoveResult(ErrorMessages.squareOccupied);
    }

    if (moveRecreatesHomeRow(move, game)) {
        return createNegativeMoveResult(ErrorMessages.homeRowRebuild);
    }

    if (moveJumpsOverAnotherPiece(move, game)) {
        return createNegativeMoveResult(ErrorMessages.cannotJumpPiece);
    }

    if (!moveStopsAtObstacle(move, game)) {
        return createNegativeMoveResult(ErrorMessages.mustMoveToObstacle);
    }

    return { success: true };
}

function moveIsOutsideTheBoard(move: Move) {
    return isCoordinatePartOutsideTheBoard(move.fromX) ||
        isCoordinatePartOutsideTheBoard(move.fromY) ||
        isCoordinatePartOutsideTheBoard(move.toX) ||
        isCoordinatePartOutsideTheBoard(move.toY);
}

// Taking advantage of the fact that the board is square so Rows == Colums
function isCoordinatePartOutsideTheBoard(n: number) {
    return n >= Rows || n < 0;
}

function sourceSquareIsEmpty(game: Game, move: Move) {
    return game.getPieceAt(move.fromX, move.fromY) === Piece.None;
}

function mayPieceBeMovedInState(piece: Piece, state: State) {
    if (piece === Piece.Player1 && state === State.PlayerOneMovePiece) {
        return true;
    }
    if (piece === Piece.Player2 && state === State.PlayerTwoMovePiece) {
        return true;
    }
    if (piece === Piece.Neutrino && (state === State.PlayerOneMoveNeutrino || state === State.PlayerTwoMoveNeutrino)) {
        return true;
    }
    return false;
}

function moveIsAStraightLine(move: Move): boolean {
    let deltaX = move.toX - move.fromX;
    let deltaY = move.toY - move.fromY;

    if (deltaY === 0 || deltaX === 0) {
        return true;
    }

    if (Math.abs(deltaX) === Math.abs(deltaY)) {
        return true;
    }

    return false;
}

function moveRecreatesHomeRow(move: Move, game: Game) {
    let piece = game.getPieceAt(move.fromX, move.fromY);
    if (move.toY === 0 && piece === Piece.Player1) {
        let ownPiecesOnHomeRow = getPiecesOfTypeOnRow(Piece.Player1, PlayerOneHomeRow, game);
        if (ownPiecesOnHomeRow === 4) {
            return true;
        }
    } else if (move.toY === 4 && piece === Piece.Player2) {
        let ownPiecesOnHomeRow = getPiecesOfTypeOnRow(Piece.Player2, PlayerTwoHomeRow, game);
        if (ownPiecesOnHomeRow === 4) {
            return true;
        }
    }
}

function stepFromMove(move: Move): { xStep: number, yStep: number, numberOfSteps: number } {
    let deltaX = move.toX - move.fromX;
    let deltaY = move.toY - move.fromY;

    let xStep = 0;
    let yStep = 0;

    // Set steps to -1 or 1 depending on direction, or leave at 0 if no change
    if (deltaX !== 0) {
        xStep = deltaX / Math.abs(deltaX);
    }
    if (deltaY !== 0) {
        yStep = deltaY / Math.abs(deltaY);
    }

    let numberOfSteps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    return { xStep: xStep, yStep: yStep, numberOfSteps: numberOfSteps };
}

function moveJumpsOverAnotherPiece(move: Move, game: Game) {
    let steps = stepFromMove(move);
    let xStep = steps.xStep;
    let yStep = steps.yStep;
    let numberOfSteps = steps.numberOfSteps;

    for (let step = 1; step < numberOfSteps; step++) {
        let x = move.fromX + (step * xStep);
        let y = move.fromY + (step * yStep);
        let pieceOnStep = game.getPieceAt(x, y);
        if (pieceOnStep !== Piece.None) {
            return true;
        }
    }
    return false;
}

function moveStopsAtObstacle(move: Move, game: Game) {
    let steps = stepFromMove(move);
    let nextX = move.toX + steps.xStep;
    let nextY = move.toY + steps.yStep;

    //End of board is an obstacle
    if (nextX < 0 || nextX > 4 || nextY < 0 || nextY > 4) {
        return true;
    }

    return game.getPieceAt(nextX, nextY) !== Piece.None;
}

function targetSquareIsOccupied(game: Game, move: Move) {
    return game.getPieceAt(move.toX, move.toY) !== Piece.None;
}

function getPiecesOfTypeOnRow(piece: Piece, row: number, game: Game) {
    let pieceOnRow = 0;
    for (let x = 0; x < Columns; x++) {
        if (game.getPieceAt(x, row) === piece) {
            pieceOnRow++;
        }
    }
    return pieceOnRow;
}

function createNegativeMoveResult(errorMessage: string): MoveResult {
    return { success: false, errorMessage: errorMessage };
}