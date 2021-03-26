import React, {Component} from 'react'
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra.js'

import './PathfindingVisualizer.css'
import { randomMaze } from '../mazeGenerators/randomMaze.js';
import { verticalMaze } from '../mazeGenerators/verticalMaze';


const initialNum = getInitialNum(window.innerWidth, window.innerHeight);
const initialNum_rows = initialNum[0]; 
const initialNum_col = initialNum[1];

const startFinishNode = getStartFinishNode(initialNum_rows, initialNum_col);
const startNodeRow = startFinishNode[0];
const startNodeCol = startFinishNode[1];
const finishNodeRow = startFinishNode[2];
const finishNodeCol = startFinishNode[3];

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;


export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            width: window.innerWidth,
            height: window.innerHeight,
            visualizingAlgorithmState : false,
            mazeGeneratorState : false,
            numRows : initialNum_rows,
            numColumns : initialNum_col,
            algoSpeed: 10,
            mazeSpeed: 10,
        };
    }

    updateDimensions = () => {
        this.setState({
            width : window.innerHeight,
            height: window.innerHeight,
        });
    };

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false})
    }

    animateDijkstra(visitedNodeInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodeInOrder.length; i++) {
            if (i === visitedNodeInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodeInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    `node node-visited`;
                //this.setState({grid: newGrid});
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    `node node-shortest-path`;
                //this.setState({grid: newGrid});
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        if (this.state.visualizingAlgorithmState || this.state.mazeGeneratorState) {
            return;
        }
        this.setState({
            visualizingAlgorithmState : true,
        });
        setTimeout(() => {
            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const visitedNodeInOrder = dijkstra(grid, startNode, finishNode);
            const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            //const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            this.animateDijkstra(visitedNodeInOrder, nodesInShortestPathOrder);
        }, 10);
    }

    animateMaze(walls) {
        for (let i = 0; i <= walls.length; i++) {
            if (i === walls.length) {
                setTimeout(() => {
                    this.resetGrid();
                    let newGrid = getNewGridWithMaze(this.state.grid, walls);
                    this.setState({
                        grid : newGrid,
                        mazeGeneratorState : false
                    });
                }, i * this.state.mazeSpeed);
                return;
            }
            let wall = walls[i];
            let node = this.state.grid[wall[0]][wall[1]];
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-wall"
            }, i * this.state.mazeSpeed);
        }
    };

    generateRandomMaze() {
        if (this.state.visualizingAlgorithmState || this.state.mazeGeneratorState) {
            return;
        }
        this.setState({
            mazeGeneratorState : true
        });
        setTimeout(() => {
            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const walls = randomMaze(grid, startNode, finishNode);
            this.animateMaze(walls);
        }, this.state.mazeSpeed);
    }

    generateVerticalMaze() {
        if (this.state.visualizingAlgorithmState || this.state.mazeGeneratorState) {
            return;
        }
        this.setState({
            generatingMaze: true,
        });
        setTimeout(() => {
            const { grid } = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const walls = verticalMaze(grid, startNode, finishNode);
            this.animateMaze(walls);            
        }, this.state.mazeSpeed);
    }

    resetGrid() {
        if (this.state.visualizingAlgorithmState || this.state.mazeGeneratorState) {
            return;
        }
        for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[0].length; col++) {
                if (!((row === START_NODE_ROW && col === START_NODE_COL) || (row === FINISH_NODE_ROW && col === FINISH_NODE_COL))) {
                    document.getElementById(`node-${row}-${col}`).className = "node";
                }
            }
        }
        const newGrid = getInitialGrid(this.state.numRows, this.state.numColumns);
        this.setState({
            grid : newGrid,
            visualizingAlgorithmState: false,
            mazeGeneratorState: false,
        });
    }

    clearPath() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
        }
        for (let row = 0; row < this.state.grid.length; row++) {
            for (let col = 0; col < this.state.grid[0].length; col++) {
                if ( document.getElementById(`node-${row}-${col}`).className === "node node-shortest-path") {
                    document.getElementById(`node-${row}-${col}`).className = "node";
                }
            }
        }
        const newGrid = getGridWithoutPath(this.state.grid);
        this.setState({
            grid: newGrid,
            visualizingAlgorithm: false,
            generatingMaze: false,
        });
      }

    render() {
        const {grid, mouseIsPressed} = this.state;
        console.log(grid);

        return (
            <>
                <button onClick = {() => this.generateVerticalMaze()}>
                    VERTICAL MAZE
                </button>
                <button onClick = {() => this.resetGrid()}>
                    Reset Board
                </button>
                <button onClick = {() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>
                <div className = "grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key = {rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isWall, isFinish, isStart, isVisited} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            isFinish ={isFinish}
                                            isStart={isStart}
                                            isVisited={isVisited}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            col={col}
                                            row={row} 
                                            numRows={this.state.height}
                                            numCols={this.state.width}
                                        ></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

function getInitialNum (width, height) {
    let numColumns;
    if (width > 1500) {
        numColumns = Math.floor(width / 25);
    }
    else if (width > 1250) {
        numColumns = Math.floor(width / 22.5);
    }
    else if (width > 1000) {
        numColumns = Math.floor(width / 20);
    }
    else if (width > 750) {
        numColumns = Math.floor(width / 17.5);
    }
    else if (width > 500) {
        numColumns = Math.floor(width / 15);
    }
    else if (width > 250) {
        numColumns = Math.floor(width / 12.5);
    }
    else if (width > 0) {
        numColumns = Math.floor(width / 10);
    }

    let cellWidth = Math.floor(width / numColumns);
    let numRows = Math.floor(height / cellWidth);
    return [numRows, cellWidth];
}

function getRandomNums(num) {
    let randomNums1 = [];
    let temp = 2;
    for (let i = 5; i < num / 2; i += 2) {
        randomNums1.push(temp);
        temp += 2;
    }
    let randomNums2 = [];
    temp = -2;
    for (let i = num / 2; i < num - 5; i += 2) {
        randomNums2.push(temp);
        temp -= 2;
    }
    return [randomNums1, randomNums2];
  }

function getStartFinishNode(numRows, numColumns) {
    let randomNums,
    x,
    y,
    startNodeRow,
    startNodeCol,
    finishNodeRow,
    finishNodeCol;

    if (numRows < numColumns) {
        randomNums = getRandomNums(numRows);
        x = Math.floor(numRows / 2);
        y = Math.floor(numColumns / 4);
        if (x % 2 !== 0) x -= 1;
        if (y % 2 !== 0) y += 1;
        startNodeRow =
        x + randomNums[1][Math.floor(Math.random() * randomNums[1].length)];
        startNodeCol = y + [-6, -4, -2, 0][Math.floor(Math.random() * 4)];
        finishNodeRow =
        x + randomNums[0][Math.floor(Math.random() * randomNums[0].length)];
        finishNodeCol =
        numColumns - y + [0, 2, 4, 6][Math.floor(Math.random() * 4)];
    } 
    else {
        randomNums = getRandomNums(numColumns);
        x = Math.floor(numRows / 4);
        y = Math.floor(numColumns / 2);
        if (x % 2 !== 0) {
            x -= 1;
        }
        if (y % 2 !== 0) {
            y += 1;
        }

        startNodeRow = x + [-6, -4, -2, 0][Math.floor(Math.random() * 4)];
        startNodeCol = y + randomNums[1][Math.floor(Math.random() * randomNums[1].length)];
        finishNodeRow = numRows - x + [0, 2, 4, 6][Math.floor(Math.random() * 4)];
        finishNodeCol = y + randomNums[0][Math.floor(Math.random() * randomNums[0].length)];
    }
    return [startNodeRow, startNodeCol, finishNodeRow, finishNodeCol];
    
}

const getNewGridWithMaze = (grid, walls) => {
    let newGrid = grid.slice();
    for (let wall in walls) {
        let node = grid[wall[0]][wall[1]];
        let newNode = {
            ...node,
            isWall: true,
        };
        newGrid[wall[0]][wall[1]] = newNode;
    }
    return newGrid;
}

const getGridWithoutPath = (grid) => {
    let newGrid = grid.slice();
    for (let row of grid) {
        for (let node of row) {
            let newNode = {
                ...node,
                distance: Infinity,
                totalDistance: Infinity,
                isVisited: false,
                isShortest: false,
                previousNode: null,
            };
            newGrid[node.row][node.col] = newNode;
        }
    }
    return newGrid;
}