import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />);
    }

    render() {
        const board = () => {
            let list = [];
            for (let i = 0; i < 3; i++) {
                list.push(
                    <div className="board-row">
                        {rows(i)}
                    </div>);
            }
            return list;
        }

        const rows = i => {
            let list = [];
            for (let j = 0; j < 3; j++) {
                list.push(this.renderSquare(i * 3 + j));
            }
            return list;
        }

        return (
            <div>
                {board()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            step: 0,
            move: [[0, 0]],
            ascending: false,
            xIsNext: true
        };
    }

    handleClick(i) {
        const hist = this.state.history.slice(0, this.state.step + 1);
        const currentBoard = hist[this.state.step].squares.slice()
        if (calculateWinner(currentBoard) || currentBoard[i]) {
            return;
        }
        currentBoard[i] = this.state.xIsNext ? 'X' : 'O';
        const move = this.state.move.slice(0, this.state.step + 1);;
        this.setState({
            history: hist.concat([{
                squares: currentBoard
            }]),
            step: this.state.step + 1,
            move: move.concat([[Math.ceil((i + 1) / 3), (i + 1) % 3 ? (i + 1) % 3 : 3]]),
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(move) {
        this.setState({
            step: move,
            xIsNext: move % 2 === 0 ? true : false
        });
    }

    render() {
        const hist = this.state.history;
        const currentBoard = hist[this.state.step].squares;
        const winner = calculateWinner(currentBoard);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = hist.map((step, move) => {
            let mover = (this.state.ascending ? this.state.history.length-1-move : move)
            const desc = 'Go to move #' + mover;
            return (
                <li key={mover}>
                    <button
                        onClick={() => this.jumpTo(mover)}
                        style={this.state.step === move ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
                        {desc}
                    </button>
                    <text>
                        {`${mover % 2 === 0 ? 'O' : 'X'} on (col, row) (${this.state.move[mover][0]}, ${this.state.move[mover][1]})`}
                    </text>
                </li>
            )
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentBoard}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => { this.setState({ascending: !this.state.ascending}) }}>
                        {this.state.ascending ? 'Ascending' : 'Descending'}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
