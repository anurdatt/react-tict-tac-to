import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={"square " + props.className} onClick={()=> props.onClick()} >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    let class_name = "";
    if (this.props.winLine.length > 0 && this.props.winLine.filter(a=>a===i).length > 0) {
      class_name = "win-line";
    }
    return <Square value={this.props.squares[i]} className={class_name} onClick={() => this.props.onClick(i)} />;
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).value || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      let class_name = (move === this.state.stepNumber ? "selected-move" : "");
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={class_name}>{desc}</button>
        </li>
      );
    });

    const result = calculateWinner(current.squares);
    console.log(JSON.stringify(result));
    let status;

    if (result.value && result.value.length === 1) {
      status = 'Winner:' + result.value;
    }
    else if (result.value === "DRAW") {
      status = 'Result: Game Draw';
    }
    else {
      status = 'Next Player:' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winLine={result.win_line}
            onClick={i => this.handleClick(i)}
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

function calculateWinner(squares) {
  let response = {value: null, win_line: []}
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  //console.log('In Board::calculateWinner() - squares = ' + JSON.stringify(squares));

  for (let i=0; i <lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      response.win_line = lines[i];
      response.value=squares[a];
      return response;
    }
  }

  if (squares.filter((a) => a == null).length === 0) {
    response.value="DRAW";
    return response;
  }

  return response;
}

ReactDom.render(<Game />, document.getElementById('root'));
