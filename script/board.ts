import * as n from "./neutrino/neutrino";
import interact from "interact.js";

namespace board {

    enum PieceType {
        neutrino = 0,
        player1 = 1,
        player2 = 2,
    }

    function pieceTypeFromPiece(piece: n.Piece): PieceType {
        switch (piece) {
            case n.Piece.Neutrino:
                return PieceType.neutrino;
            case n.Piece.Player1:
                return PieceType.player1;
            case n.Piece.Player2:
                return PieceType.player2;
            default:
                return -1;
        }
    }

    let game: n.Game;

    class Coordinates {
        constructor(public x: number, public y: number) { }

        static fromSquareElement(square: HTMLElement): Coordinates {
            const coordinates = square.id.split("-");
            return new Coordinates(parseInt(coordinates[0]), parseInt(coordinates[1]));
        }

        static elementFromCoordinates(c: Coordinates) {
            return document.getElementById(c.x + "-" + c.y);
        }

        toString(): string {
            return "(" + this.x + ", " + this.y + ")";
        }
    }

    let originSquare: HTMLElement;
    let origin = new Coordinates(-1, -1);

    function redrawBoard(game: n.Game) {
        for (let x = 0; x < n.Columns; x++) {
            for (let y = 0; y < n.Columns; y++) {
                let boardSquare = Coordinates.elementFromCoordinates(new Coordinates(x, y));
                boardSquare.innerHTML = "";
                let piece = game.getPieceAt(x, y);
                if (piece !== n.Piece.None) {
                    let pieceType = pieceTypeFromPiece(piece);
                    let pieceElement = createPiece(pieceType)
                    boardSquare.appendChild(pieceElement);
                }
            }
        }
    }

    export function setupBoardInteractions() {
        game = new n.Game(n.neutrinoMoveDecider, n.neutrinoNextStateDecider);
        redrawBoard(game);
        updateState();
        displayErrorMessage("");

        interact("#board")
            .dropzone({
                // only accept elements matching this CSS selector
                accept: ".piece",
                // Require a 51% element overlap for a drop to be possible
                overlap: 0.51,
            });

        interact(".square")
            .dropzone({
                ondrop: onDrop,
            });


        interact(".piece")
            .draggable({
                inertia: false,
                restrict: {
                    restriction: "#board",
                    elementRect: { left: 0, top: 0, right: 1, bottom: 1 } // Do not allow any part of the piece to go outside the board
                },
                autoScroll: true,
                onstart: onStart,
                onmove: dragMoveListener
            });

        document.getElementById("resetButton").onclick = setupBoardInteractions;
    }

    function onDrop(event: Interact.InteractEvent) {
        const targetSquare = event.target;
        const movedPiece = event.relatedTarget;

        const targetCoordinates = Coordinates.fromSquareElement(targetSquare);

        let move = new n.Move(origin.x, origin.y, targetCoordinates.x, targetCoordinates.y);
        let moveResult = game.makeMove(move);
        const pieceType = getPieceTypeFromElement(movedPiece);
        movedPiece.parentElement.removeChild(movedPiece);
        if (moveResult.success) {
            targetSquare.appendChild(createPiece(pieceType));
            clearErrorMessage();
        } else {
            originSquare.appendChild(createPiece(pieceType));
            displayErrorMessage(moveResult.errorMessage);
        }
        updateState();
    }

    function clearErrorMessage() {
        displayErrorMessage("");
    }

    function displayErrorMessage(message: string) {
        document.getElementById("errorMessage").textContent = message;
    }

    function updateState() {
        let state = game.state;
        let stateMessage: string;
        switch (state) {
            case n.State.PlayerOneMoveNeutrino:
                stateMessage = "Player one, move the neutrino";
                break;
            case n.State.PlayerOneMovePiece:
                stateMessage = "Player one, move one of your pieces";
                break;
            case n.State.PlayerTwoMoveNeutrino:
                stateMessage = "Player two, move the neutrino";
                break;
            case n.State.PlayerTwoMovePiece:
                stateMessage = "Player two, move one of your pieces";
                break;
            case n.State.PlayerOneWin:
                stateMessage = "Player one wins!";
                break;
            case n.State.PlayerTwoWin:
                stateMessage = "Player two wins!";
                break;
        }
        document.getElementById("state").textContent = stateMessage;
    }

    function getPieceTypeFromElement(element: HTMLElement): PieceType {
        for (let pt in PieceType) {
            if (element.classList.contains("player" + pt)) {
                return parseInt(pt);
            }
        }
        // todo we might exit this without an explicit return, same thing happens in function around line 12 where we also return -1
        return -1;
    }

    function createPiece(piece: PieceType): HTMLElement {
        const newPiece = document.createElement("div");
        newPiece.classList.add("piece");
        newPiece.classList.add("player" + piece);
        return newPiece;
    }

    function onStart(event: Interact.InteractEvent) {
        originSquare = event.target.parentElement;
        origin = Coordinates.fromSquareElement(originSquare);
    }

    // Redrawing the dragged element
    // Taken from http://interactjs.io/
    function dragMoveListener(event: Interact.InteractEvent) {
        const target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
            y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            "translate(" + x + "px, " + y + "px)";

        // update the posiion attributes
        target.setAttribute("data-x", x.toString());
        target.setAttribute("data-y", y.toString());
    }
}

board.setupBoardInteractions();