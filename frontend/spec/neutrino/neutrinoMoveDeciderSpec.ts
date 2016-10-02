
import {Game, Piece, Move, State, neutrinoMoveDecider, ErrorMessages} from "../../script/neutrino/neutrino";

describe("NeutrinoMoveDecider", () => {

    function stateDeciderMock(game: Game): State {
        return game.state;
    }

    function createEmptyBoard(): Piece[][] {
        let board: Piece[][] = [[], [], [], [], []];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                board[x][y] = Piece.None;
            }
        }
        return board;
    }

    it("Should not be possible to move player ones piece when it is not player ones turn", () => {
        let board = createEmptyBoard();
        board[1][1] = Piece.Player1;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.wrongPieceMoved);
    });

    it("Should not be possible to move player twos piece when it is not player twos turn", () => {
        let board = createEmptyBoard();
        board[1][1] = Piece.Player2;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.wrongPieceMoved);
    });

    it("Should not be possible to move the neutrino when it is not a players turn to move it", () => {
        let board = createEmptyBoard();
        board[1][1] = Piece.Neutrino;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.wrongPieceMoved);
    });

    it("Should be possible to move player ones piece if it is that players turn", () => {
        let board = createEmptyBoard();
        board[1][1] = Piece.Player1;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(true);
    });

    it("Should be possible to move player ones piece if it is that players turn", () => {
        let board = createEmptyBoard();
        board[1][1] = Piece.Player1;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(true);
    });

    it("Should be possible to move player twos piece if it is that players turn", () => {
        let board = createEmptyBoard();
        board[1][1] = Piece.Player2;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(true);
    });

    it("Should be possible to move the neutrino piece if it is a players turn to do so", () => {
        let board = createEmptyBoard();
        board[1][1] = Piece.Neutrino;
        let state = State.PlayerTwoMoveNeutrino;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(true);
    });

    it("Should not be possible for player one to get all five pieces back to the home row", () => {
        let board = createEmptyBoard();
        board[0][0] = Piece.Player1;
        board[1][0] = Piece.Player1;
        board[2][0] = Piece.Player1;
        board[3][0] = Piece.Player1;
        board[4][4] = Piece.Player1;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(4, 4, 4, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.homeRowRebuild);
    });

    it("Should not be possible for player two to get all five pieces back to the home row", () => {
        let board = createEmptyBoard();
        board[0][4] = Piece.Player2;
        board[1][4] = Piece.Player2;
        board[2][3] = Piece.Player2;
        board[3][4] = Piece.Player2;
        board[4][4] = Piece.Player2;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(2, 3, 2, 4);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.homeRowRebuild);
    });

    it("Should be possible for player one to fill up the home row if one of the pieces are player twos", () => {
        let board = createEmptyBoard();
        board[0][0] = Piece.Player1;
        board[1][0] = Piece.Player2;
        board[2][0] = Piece.Player1;
        board[3][0] = Piece.Player1;
        board[4][4] = Piece.Player1;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(4, 4, 4, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(true);
        expect(moveResult.errorMessage).toBeUndefined();
    });

    it("Should be possible for player two to fill up the home row if one of the pieces are player ones", () => {
        let board = createEmptyBoard();
        board[0][4] = Piece.Player2;
        board[1][4] = Piece.Player1;
        board[2][3] = Piece.Player2;
        board[3][4] = Piece.Player2;
        board[4][4] = Piece.Player2;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(2, 3, 2, 4);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(true);
    });

    it("Should not be possible to move a piece to a square the is occupied by another piece", () => {
        let board = createEmptyBoard();
        board[0][0] = Piece.Player1;
        board[1][1] = Piece.Player2;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(1, 1, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.squareOccupied);
    });

    it("Should not be possible to make a move from an empty square", () => {
        let game = new Game(neutrinoMoveDecider, stateDeciderMock);

        let move = new Move(2, 3, 2, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.noPieceMoved);
    });

    describe("Should only be possible to move in a straight line", () => {
        let illegalMoves = [
            { move: new Move(4, 4, 2, 0), direction: "north-north-west" },
            { move: new Move(1, 2, 2, 0), direction: "north-north-east" },
            { move: new Move(0, 1, 3, 0), direction: "east-north-east" },
            { move: new Move(0, 1, 4, 2), direction: "east-south-east" },
            { move: new Move(3, 0, 4, 3), direction: "south-south-east" },
            { move: new Move(4, 0, 1, 4), direction: "south-south-west" },
            { move: new Move(2, 2, 0, 3), direction: "west-south-west" },
            { move: new Move(1, 4, 0, 1), direction: "west-north-west" },
        ];
        illegalMoves.forEach(element => {
            it("towards " + element.direction, () => {
                let move = element.move;
                let board = createEmptyBoard();
                board[move.fromX][move.fromY] = Piece.Player1;
                let state = State.PlayerOneMovePiece;
                let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

                let moveResult = neutrinoMoveDecider(move, game);

                expect(moveResult.success).toBe(false);
                expect(moveResult.errorMessage).toBe(ErrorMessages.moveIsNotAStraightLine);
            });
        });
    });

    it("should not be possible to move zero squares", () => {
        let board = createEmptyBoard();
        board[3][3] = Piece.Player1;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(3, 3, 3, 3);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.squareOccupied);
    });

    describe("Should not be possible to move to outside the board", () => {
        let illegalMoves = [
            { move: new Move(1, 1, -1, 1), direction: "west" },
            { move: new Move(1, 1, 1, -1), direction: "north" },
            { move: new Move(1, 1, 5, 1), direction: "east" },
            { move: new Move(1, 1, 1, 5), direction: "south" },
        ];

        illegalMoves.forEach(element => {
            it("to the " + element.direction, () => {
                let move = element.move;
                let board = createEmptyBoard();
                board[move.fromX][move.fromY] = Piece.Player1;
                let state = State.PlayerOneMovePiece;
                let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

                let moveResult = neutrinoMoveDecider(move, game);

                expect(moveResult.success).toBe(false);
                expect(moveResult.errorMessage).toBe(ErrorMessages.moveIsOutsideTheBoard);
            });
        });
    });

    describe("Should not break the game to try and move from outside the board", () => {
        let illegalMoves = [
            { move: new Move(-1, 2, 2, 2), direction: "west" },
            { move: new Move(2, -1, 2, 2), direction: "north" },
            { move: new Move(5, 2, 2, 2), direction: "east" },
            { move: new Move(2, 5, 2, 2), direction: "south" },
        ];

        illegalMoves.forEach(element => {
            it("from the " + element.direction, () => {
                let move = element.move;
                let game = new Game(neutrinoMoveDecider, stateDeciderMock);

                let moveResult = neutrinoMoveDecider(move, game);

                expect(moveResult.success).toBe(false);
                expect(moveResult.errorMessage).toBe(ErrorMessages.moveIsOutsideTheBoard);
            });
        });
    });

    it("Should not be possible to jump over a piece when going straight vertically", () => {
        let board = createEmptyBoard();
        board[3][2] = Piece.Player1;
        board[3][1] = Piece.Player1;
        let state = State.PlayerOneMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(3, 2, 3, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.cannotJumpPiece);
    });

    it("Should not be possible to jump over a piece when going straight horizontally", () => {
        let board = createEmptyBoard();
        board[4][2] = Piece.Player2;
        board[2][2] = Piece.Neutrino;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(4, 2, 0, 2);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.cannotJumpPiece);
    });

    it("Should not be possible to jump over a piece when going diagonally", () => {
        let board = createEmptyBoard();
        board[3][3] = Piece.Player2;
        board[1][1] = Piece.Player1;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock, board, state);

        let move = new Move(3, 3, 0, 0);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(false);
        expect(moveResult.errorMessage).toBe(ErrorMessages.cannotJumpPiece);
    });

    describe("Should not be possible to stop a move before the piece hit something", () => {

        function setupGame(x: number, y: number): Game {
            let board = createEmptyBoard();
            board[x][y] = Piece.Player1;
            let state = State.PlayerOneMovePiece;
            return new Game(neutrinoMoveDecider, stateDeciderMock, board, state);
        }

        it("towards North West", () => {
            let game = setupGame(4, 4);
            let move = new Move(4, 4, 1, 1);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });

        it("towards North", () => {
            let game = setupGame(4, 4);
            let move = new Move(4, 4, 4, 1);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });

        it("towards North East", () => {
            let game = setupGame(2, 3);
            let move = new Move(2, 3, 3, 2);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });

        it("towards East", () => {
            let game = setupGame(0, 4);
            let move = new Move(0, 4, 2, 4);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });

        it("towards South East", () => {
            let game = setupGame(1, 0);
            let move = new Move(1, 0, 3, 2);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });

        it("towards South", () => {
            let game = setupGame(3, 2);
            let move = new Move(3, 2, 3, 3);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });

        it("towards South West", () => {
            let game = setupGame(3, 2);
            let move = new Move(3, 2, 2, 3);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });

        it("towards  West", () => {
            let game = setupGame(3, 1);
            let move = new Move(3, 1, 1, 1);
            let moveResult = neutrinoMoveDecider(move, game);

            expect(moveResult.success).toBe(false);
            expect(moveResult.errorMessage).toBe(ErrorMessages.mustMoveToObstacle);
         });
    });

    it("Should be possible to stop at another piece", () => {
        let board = createEmptyBoard();
        board[3][3] = Piece.Player2;
        board[1][1] = Piece.Player1;
        let state = State.PlayerTwoMovePiece;
        let game = new Game(neutrinoMoveDecider, stateDeciderMock,  board, state);

        let move = new Move(3, 3, 2, 2);
        let moveResult = neutrinoMoveDecider(move, game);

        expect(moveResult.success).toBe(true);
    });
});