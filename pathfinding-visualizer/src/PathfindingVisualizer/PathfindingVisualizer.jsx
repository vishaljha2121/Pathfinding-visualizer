import React, {Component} from 'react'
import Node from './Node/Node';
import {dijkstra} from '../algorithms/dijkstra.js'

import './PathfindingVisualizer.css'

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false
        };
    }

    componentDidMount() {
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

    animateDijkstra(visitedNodeInOrder) {
        for (let i = 0; i < visitedNodeInOrder.length; i++) {
            setTimeout(() => {
                const node = visitedNodeInOrder[i];
                const newGrid = this.state.grid.slice();
                const newNode = {
                    ...node,
                    isVisited: true,
                };
                newGrid[node.row][node.col] = newNode;
                this.setState({grid: newGrid});
            }, 10 * i);
        }
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodeInOrder = dijkstra(grid, startNode, finishNode);
        //const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodeInOrder);
    }

    render() {
        const {grid} = this.state;
        console.log(grid);

        return (
            <>
                <button onClick = {() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>
                <div className = "grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key = {rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {isFinish, isStart, isVisited} = node;
                                    return (
                                        <Node>
                                            key={nodeIdx}
                                            isFinish ={isFinish}
                                            isStart={isStart}
                                            isVisited={isVisited}
                                        </Node>
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
}