const gameBoard = document.querySelector('#game-board')
let boxesRow = []
let boxes = []
let stone = []
let player
let playerIndex = 16

createBoard()

function createBoard () {
    for (let row = 0; row < 15; row++) {
        boxesRow = []
        for (let col = 0; col < 15; col++) {
            let newBox = document.createElement('div')
            newBox.classList.add('box')
            if (row == 0 || row == 14) {
                newBox.classList.add('stone')
                stone.push([row, col])
            } else if (col == 0 || col == 14) {
                newBox.classList.add('stone')
                stone.push([row, col])
            } else if (row % 2 == 0 && col % 2 == 0) {
                newBox.classList.add('stone')
                stone.push([row, col])
            } else {
                newBox.classList.add('grass')
            }
            gameBoard.appendChild(newBox)
            boxesRow.push(newBox)
        }
        boxes.push(boxesRow)
    }
}
player = boxes[1][1]
player.style.backgroundColor = 'white'

document.addEventListener('keydown', evt => {
    if (evt.code == 'KeyW' || evt.code == 'KeyA' || evt.code == 'KeyS' || evt.code == 'KeyD') {
        direction = evt.code
        movePlayer()
    }
})

function movePlayer () {

}