import {Game, Rows, Columns, PlayerOneHomeRow, PlayerTwoHomeRow} from "./game";
import {Piece} from "./piece";
import {State} from "./state";

export function neutrinoNextStateDecider(game: Game): State {
    let neutrino = neutrinoCoordinates(game);

    if (neutrino.y === PlayerOneHomeRow) {
        return State.PlayerTwoWin;
    }

    if (neutrino.y === PlayerTwoHomeRow) {
        return State.PlayerOneWin;
    }

    if (isTheNeutrinoSurrounded(game)) {
        if (game.state === State.PlayerOneMovePiece) {
            return State.PlayerOneWin;
        } else if (game.state === State.PlayerTwoMovePiece) {
            return State.PlayerTwoWin;
        }
    }

    return (game.state + 1) % 4;
}

function neutrinoCoordinates(game: Game): { x: number, y: number } {
    for (let x = 0; x < Columns; x++) {
        for (let y = 0; y < Rows; y++) {
            if (game.getPieceAt(x, y) === Piece.Neutrino) {
                return { x, y };
            }
        }
    }

    throw "Missing neutrino in game";
}

function isTheNeutrinoSurrounded(game: Game): boolean {
    let neutrinoPosition = findNeutrinoPosition(game);

    for (let deltaX = -1; deltaX < 2; deltaX++) {
        for (let deltaY = -1; deltaY < 2; deltaY++) {
            let x = neutrinoPosition.x + deltaX;
            let y = neutrinoPosition.y + deltaY;
            if (x < 0 || x >= Columns || y < 0 || y >= Rows) {
                continue;
            } else if (game.getPieceAt(x, y) === Piece.None) {
                return false;
            }
        }
    }

    return true;
}

function findNeutrinoPosition(game: Game): { x: number, y: number } {
    for (let x = 0; x < Columns; x++) {
        for (let y = 0; y < Rows; y++) {
            if (game.getPieceAt(x, y) === Piece.Neutrino) {
                return { x, y };
            }
        }
    }
    throw "The game does not contain a neutrino";
}
