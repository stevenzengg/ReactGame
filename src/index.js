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
        return( 
            <Square value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} 
            />);
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            step: 0,
            xIsNext: true
        };
    }
    
    handleClick(i) {
        const hist = this.state.history.slice(0, this.state.step+1);
        const currentBoard = hist[this.state.step].squares.slice()
        if(calculateWinner(currentBoard) || currentBoard[i]){
            return;
        }
        currentBoard[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: hist.concat([{
                squares: currentBoard
            }]),
            step: this.state.step + 1,
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(move){
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
        if(winner){
            status = 'Winner: ' + winner;
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = this.state.history.map((step, move) => {
            const desc = 'Go to move #' + move;
            return(
                <li key = {move}>
                    <button
                    onClick = {() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        });
    
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                    squares = {currentBoard}
                    onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
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
