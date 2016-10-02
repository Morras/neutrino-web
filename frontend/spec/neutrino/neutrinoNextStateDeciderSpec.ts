import {Game, Piece, Move, State, neutrinoNextStateDecider} from "../../script/neutrino/neutrino";

describe("neutrinoNextStateDecider", () => {

    function createEmptyBoard(): Piece[][] {
        let board: Piece[][] = [[], [], [], [], []];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                board[x][y] = Piece.None;
            }
        }
        return board;
    }

    let mockMoveLegalityDecider = function (m: Move, g: Game) {
        return { success: true };
    };

    describe("Player wins if the neutrino is on opponents home row", () => {
        let states = [State.PlayerOneMoveNeutrino, State.PlayerOneMovePiece, State.PlayerTwoMoveNeutrino, State.PlayerTwoMovePiece];

        states.forEach((state) => {
            it("Neutrino on player one home row, going from state " + state, () => {
                let board = createEmptyBoard();
                board[0][0] = Piece.Neutrino;
                let game = new Game(mockMoveLegalityDecider, neutrinoNextStateDecider, board, state);

                let newState = neutrinoNextStateDecider(game);

                expect(newState).toBe(State.PlayerTwoWin);
            });
        });

        states.forEach((state) => {
            it("Neutrino on player two home row, going from state " + state, () => {
                let board = createEmptyBoard();
                board[0][4] = Piece.Neutrino;
                let game = new Game(mockMoveLegalityDecider, neutrinoNextStateDecider, board, state);

                let newState = neutrinoNextStateDecider(game);

                expect(newState).toBe(State.PlayerOneWin);
            });
        });
    });

    describe("If there is no winner, the state cycle to the next state", () => {
        let states = [
            { current: State.PlayerOneMoveNeutrino, next: State.PlayerOneMovePiece },
            { current: State.PlayerOneMovePiece, next: State.PlayerTwoMoveNeutrino },
            { current: State.PlayerTwoMoveNeutrino, next: State.PlayerTwoMovePiece },
            { current: State.PlayerTwoMovePiece, next: State.PlayerOneMoveNeutrino }
        ];

        states.forEach((statePair) => {
            it("State after " + statePair.current + " should be " + statePair.next, () => {
                let board = createEmptyBoard();
                board[2][2] = Piece.Neutrino;
                let game = new Game(mockMoveLegalityDecider, neutrinoNextStateDecider, board, statePair.current);

                let newState = neutrinoNextStateDecider(game);

                expect(newState).toBe(statePair.next);
            });
        })
    });

    describe("If you cannot move the neutrino, you loose", () => {
        it("Should make you loose if you are trapped up against the left wall", () => {
            let board = createEmptyBoard();
            board[0][0] = Piece.Player1;
            board[1][0] = Piece.Player1;

            board[0][2] = Piece.Player2;
            board[1][2] = Piece.Player2;

            board[1][1] = Piece.Player2;

            board[0][1] = Piece.Neutrino;

            let game = new Game(mockMoveLegalityDecider, neutrinoNextStateDecider, board, State.PlayerOneMovePiece);

            let nextState = neutrinoNextStateDecider(game);

            expect(nextState).toBe(State.PlayerOneWin);
        });

        it("Should make you loose if you are trapped up against the right wall", () => {
            let board = createEmptyBoard();
            board[3][0] = Piece.Player1;
            board[4][0] = Piece.Player1;

            board[3][2] = Piece.Player2;
            board[4][2] = Piece.Player2;

            board[3][1] = Piece.Player2;

            board[4][1] = Piece.Neutrino;

            let game = new Game(mockMoveLegalityDecider, neutrinoNextStateDecider, board, State.PlayerTwoMovePiece);

            let nextState = neutrinoNextStateDecider(game);

            expect(nextState).toBe(State.PlayerTwoWin);
        });

        it("Should make you loose if you are trapped in the open", () => {
            let board = createEmptyBoard();
            board[2][2] = Piece.Player1;
            board[3][2] = Piece.Player1;
            board[4][2] = Piece.Player1;

            board[2][4] = Piece.Player2;
            board[3][4] = Piece.Player2;
            board[4][4] = Piece.Player2;

            board[2][3] = Piece.Player2;
            board[4][3] = Piece.Player1

            board[3][3] = Piece.Neutrino;

            let game = new Game(mockMoveLegalityDecider, neutrinoNextStateDecider, board, State.PlayerTwoMovePiece);

            let nextState = neutrinoNextStateDecider(game);

            expect(nextState).toBe(State.PlayerTwoWin);
        });
    });
});
