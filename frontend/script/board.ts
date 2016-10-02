import interact from "interact.js";
import * as n from "./neutrino/neutrino";

namespace board {

    enum PieceType {
        neutrino = 0,
        player1 = 1,
        player2 = 2,
    }

    let game: n.Game;

    class Coordinates {
        constructor(public x: number, public y: number) { }

        static fromSquareElement(square: HTMLElement): Coordinates {
            const coordinates = square.id.split("-");
            return new Coordinates(parseInt(coordinates[0]), parseInt(coordinates[1]));
        }

        toString(): string {
            return "(" + this.x + ", " + this.y + ")";
        }
    }

    let originSquare: HTMLElement;
    let origin = new Coordinates(-1, -1);

    export function setupBoardInteractions() {
        console.log("BAR");
        game = new n.Game(n.neutrinoMoveDecider, n.neutrinoNextStateDecider);
        updateState();

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
        console.log("moving from: " + origin + " to " + targetCoordinates);

        let move = new n.Move(origin.x, origin.y, targetCoordinates.x, targetCoordinates.y);
        let moveResult = game.makeMove(move);
        const pieceType = getPieceTypeFromElement(movedPiece);
        movedPiece.parentElement.removeChild(movedPiece);
        if ( moveResult.success ) {
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
        // todo we might exit this without an explicit return
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