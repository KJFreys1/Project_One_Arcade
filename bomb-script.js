const gameBoard = document.querySelector('#game-board')
let boxes = []
let stone = []
let player
let direction
let xPos = 1
let yPos = 1
let bombX
let bombY

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
    
}
let img = document.createElement('img')
img.src = 'sprites/white-sprite/white_down/white_standing1.png'
player.appendChild(img)

document.addEventListener('keydown', evt => {
    if (evt.code == 'KeyW' || evt.code == 'KeyA' || evt.code == 'KeyS' || evt.code == 'KeyD') {
        direction = evt.code
        movePlayer()
    }
})

function movePlayer () {
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
    player.removeChild(img)
    player = boxes[yPos][xPos]
    player.appendChild(img)
}

document.addEventListener('keypress', evt => {
    if (evt.key == 'w' || evt.key == 's' || evt.key == 'd' || evt.key == 'a') {
        direction = evt.key
        movePlayer()
    }
    if (evt.code == 'Space') {
        placeBomb()
    }
})

function placeBomb () {
    bombX = xPos
    bombY = yPos
    boxes[bombY][bombX].classList.add('bomb-black')
    setTimeout(bombRed, 500)
    setTimeout(bombBlack, 1000)
    setTimeout(bombRed, 1500)
    setTimeout(bombBlack, 2000)
    setTimeout(bombExplode, 2500)
}

function bombRed () {
    boxes[bombY][bombX].classList.remove('bomb-black')
    boxes[bombY][bombX].classList.add('bomb-red')
}

function bombBlack () {
    boxes[bombY][bombX].classList.remove('bomb-red')
    boxes[bombY][bombX].classList.add('bomb-black')
}

function bombExplode () {
    boxes[bombY][bombX].classList.remove('bomb-black')
    boxes[bombY][bombX].classList.add('fire')
    if (stone[bombY-1][bombX] == false) {
        boxes[bombY-1][bombX].classList.add('fire')
        if (stone[bombY-2][bombX] == false) {
            boxes[bombY-2][bombX].classList.add('fire')
        }
    } if (stone[bombY+1][bombX] == false) {
        boxes[bombY+1][bombX].classList.add('fire')
        if (stone[bombY+2][bombX] == false) {
            boxes[bombY+2][bombX].classList.add('fire')
        }
    } if (stone[bombY][bombX+1] == false) {
        boxes[bombY][bombX+1].classList.add('fire')
        if (stone[bombY][bombX+2] == false) {
            boxes[bombY][bombX+2].classList.add('fire')
        }
    } if (stone[bombY][bombX-1] == false) {
        boxes[bombY][bombX-1].classList.add('fire')
        if (stone[bombY][bombX-2] == false) {
            boxes[bombY][bombX-2].classList.add('fire')
        }
    }
    setTimeout(removeFire, 800)
}

function removeFire (y, x) {
    let fire = document.querySelectorAll('.fire')
    for (let j = 0; j < fire.length; j++) {
        fire[j].classList.remove('fire')
    }
}