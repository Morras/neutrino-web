
import {Game, Piece, Move, State} from "../../script/neutrino/neutrino";

describe("Game", () => {

    let trueMoveLegalityDecider = function (m: Move, g: Game) {
        return { success: true };
    };

    let falseMoveLegalityDecider = function (m: Move, g: Game) {
        return { success: false, errorMessage: "Descriptive move error message" };
    };

    let identityStateDecider = function (g: Game) {
        return g.state;
    };

    let changeStateDecider = function (g: Game) {
        return State.PlayerTwoMoveNeutrino;
    };

    it("Should be possible to create a new game with the default layout", () => {
        let game = new Game(trueMoveLegalityDecider, identityStateDecider);

        // Check player one home row
        expect(game.getPieceAt(0, 0)).toBe(Piece.Player1);
        expect(game.getPieceAt(1, 0)).toBe(Piece.Player1);
        expect(game.getPieceAt(2, 0)).toBe(Piece.Player1);
        expect(game.getPieceAt(3, 0)).toBe(Piece.Player1);
        expect(game.getPieceAt(4, 0)).toBe(Piece.Player1);

        // Check player two home row
        expect(game.getPieceAt(0, 4)).toBe(Piece.Player2);
        expect(game.getPieceAt(1, 4)).toBe(Piece.Player2);
        expect(game.getPieceAt(2, 4)).toBe(Piece.Player2);
        expect(game.getPieceAt(3, 4)).toBe(Piece.Player2);
        expect(game.getPieceAt(4, 4)).toBe(Piece.Player2);

        // Check neutrino position
        expect(game.getPieceAt(2, 2)).toBe(Piece.Neutrino);

        // Check all the empty spaces
        expect(game.getPieceAt(0, 1)).toBe(Piece.None);
        expect(game.getPieceAt(1, 1)).toBe(Piece.None);
        expect(game.getPieceAt(2, 1)).toBe(Piece.None);
        expect(game.getPieceAt(3, 1)).toBe(Piece.None);
        expect(game.getPieceAt(4, 1)).toBe(Piece.None);

        expect(game.getPieceAt(0, 2)).toBe(Piece.None);
        expect(game.getPieceAt(1, 2)).toBe(Piece.None);

        expect(game.getPieceAt(3, 2)).toBe(Piece.None);
        expect(game.getPieceAt(4, 2)).toBe(Piece.None);

        expect(game.getPieceAt(0, 3)).toBe(Piece.None);
        expect(game.getPieceAt(1, 3)).toBe(Piece.None);
        expect(game.getPieceAt(2, 3)).toBe(Piece.None);
        expect(game.getPieceAt(3, 3)).toBe(Piece.None);
        expect(game.getPieceAt(4, 3)).toBe(Piece.None);

        expect(game.state).toBe(State.PlayerOneMoveNeutrino);
    });

    describe("When making a legal move", () => {
        it("Should return true", () => {
            let game = new Game(trueMoveLegalityDecider, identityStateDecider);
            let move = new Move(2, 2, 2, 4);

            let moveResult = game.makeMove(move);

            expect(moveResult.success).toBe(true);
        });

        it("Should move the piece (Neutrino)", () => {
            let game = new Game(trueMoveLegalityDecider, identityStateDecider);
            let move = new Move(2, 2, 2, 4);

            game.makeMove(move);

            expect(game.getPieceAt(2, 2)).toBe(Piece.None);
            expect(game.getPieceAt(2, 4)).toBe(Piece.Neutrino);
        });

        it("Should move the piece (Player1)", () => {
            let game = new Game(trueMoveLegalityDecider, identityStateDecider);
            let move = new Move(0, 0, 0, 4);

            game.makeMove(move);

            expect(game.getPieceAt(0, 0)).toBe(Piece.None);
            expect(game.getPieceAt(0, 4)).toBe(Piece.Player1);
        });
    });

    describe("When making an illegal move", () => {
        it("Should return false when making an illegal move", () => {
            let game = new Game(falseMoveLegalityDecider, identityStateDecider);
            let move = new Move(3, 3, 3, 3);

            let moveResult = game.makeMove(move);

            expect(moveResult.success).toBe(false);
        });

        it("Should return and error message when making an illegal move", () => {
            let game = new Game(falseMoveLegalityDecider, identityStateDecider);
            let move = new Move(3, 3, 3, 3);

            let moveResult = game.makeMove(move);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toEqual("Descriptive move error message");
        });
    });

    it("Should advance the game state when making a legal move", () => {
        let game = new Game(trueMoveLegalityDecider, changeStateDecider);
        let originalState = game.state;
        let move = new Move(2, 2, 2, 4);

        let moveResult = game.makeMove(move);

        expect(game.state).not.toBe(originalState);
        expect(game.state).toBe(State.PlayerTwoMoveNeutrino);
    });

    it("Should not advance the game state when making a illegal move", () => {
        let game = new Game(falseMoveLegalityDecider, changeStateDecider);
        let originalState = game.state;
        let move = new Move(2, 2, 2, 4);

        let moveResult = game.makeMove(move);

        expect(game.state).not.toBe(State.PlayerTwoMoveNeutrino);
        expect(game.state).toBe(originalState);
    });

    // Getting into winning states, done with unit testing of the state decider

    // In the end do some end-to-end tests, but perhaps with the gui?
});