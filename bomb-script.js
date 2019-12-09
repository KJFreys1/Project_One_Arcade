const gameBoard = document.querySelector('#game-board')
let boxes = []
let stone = []
let player
let direction
let xPos = 1
let yPos = 1

createBoard()

function createBoard () {
    for (let row = 0; row < 15; row++) {
        let stoneRow = []
        let boxesRow = []
        for (let col = 0; col < 15; col++) {
            let newBox = document.createElement('div')
            newBox.classList.add('box')
            if (row == 0 || row == 14) {
                newBox.classList.add('stone')
                stoneRow.push(true)
            } else if (col == 0 || col == 14) {
                newBox.classList.add('stone')
                stoneRow.push(true)
            } else if (row % 2 == 0 && col % 2 == 0) {
                newBox.classList.add('stone')
                stoneRow.push(true)
            } else {
                newBox.classList.add('grass')
                stoneRow.push(false)
            }
            gameBoard.appendChild(newBox)
            boxesRow.push(newBox)
        }
        boxes.push(boxesRow)
        stone.push(stoneRow)
    }
    player = boxes[yPos][xPos]
    player.style.backgroundColor = 'white'
}

document.addEventListener('keydown', evt => {
    if (evt.code == 'KeyW' || evt.code == 'KeyA' || evt.code == 'KeyS' || evt.code == 'KeyD') {
        direction = evt.code
        movePlayer()
    }
})

function movePlayer () {
    boxes[yPos][xPos].style.backgroundColor = 'green'
    if (direction == 'w') {
        if (stone[yPos-1][xPos] == false) {
            yPos--
        }
    } else if (direction == 's') {
        if (stone[yPos+1][xPos] == false) {
            yPos++        }
    } else if(direction == 'a') {
        if (stone[yPos][xPos-1] == false) {
            xPos--
        }
    } else if (direction == 'd') {
        if (stone[yPos][xPos+1] == false) {
            xPos++
        }
    }
    player = boxes[yPos][xPos]
    player.style.backgroundColor = 'white'
}

document.addEventListener('keypress', evt => {
    direction = evt.key
    movePlayer()
})