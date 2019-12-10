const gameBoard = document.querySelector('#game-board')
let boxes = []
let stone = []
let brick = []
let willBrick
let player
let playerBombs = [true, true]
let playerBombIndex = [0, 1]
let direction
let animation = 1
let playerSprite = document.createElement('img')
playerSprite.src = 'sprites/white-sprite/white_down/white-standing-down.png'
let xPos = 1
let yPos = 1
let bombX
let bombY

class Bomb {
    constructor (index, x, y) {
        this.index = index
        this.bombX = x
        this.bombY = y
        this.fire = []
    }

    placeBomb() {
        boxes[this.bombY][this.bombX].classList.add('bomb-black')
        console.log(this.bombX)
    }

    bombRed () {
        console.log(this.bombX)
        boxes[this.bombY][this.bombX].classList.remove('bomb-black')
        boxes[this.bombY][this.bombX].classList.add('bomb-red')
    }
    
    bombBlack () {
        boxes[this.bombY][this.bombX].classList.remove('bomb-red')
        boxes[this.bombY][this.bombX].classList.add('bomb-black')
    }

    bombExplode () {
        boxes[this.bombY][this.bombX].classList.remove('bomb-black')
        this.fire.push(boxes[this.bombY][this.bombX])
        if (stone[this.bombY-1][this.bombX] == false) {
            this.fire.push(boxes[this.bombY-1][this.bombX])
            if (stone[this.bombY-2][this.bombX] == false) {
                this.fire.push(boxes[this.bombY-2][this.bombX])
            }
        } if (stone[this.bombY+1][this.bombX] == false) {
            this.fire.push(boxes[this.bombY+1][this.bombX])
            if (stone[this.bombY+2][this.bombX] == false) {
                this.fire.push(boxes[this.bombY+2][this.bombX])
            }
        } if (stone[this.bombY][this.bombX+1] == false) {
            this.fire.push(boxes[this.bombY][this.bombX+1])
            if (stone[this.bombY][this.bombX+2] == false) {
                this.fire.push(boxes[this.bombY][this.bombX+2])
            }
        } if (stone[this.bombY][this.bombX-1] == false) {
            this.fire.push(boxes[this.bombY][this.bombX-1])
            if (stone[this.bombY][this.bombX-2] == false) {
                this.fire.push(boxes[this.bombY][this.bombX-2])
            }
        }
        this.addFire
        setTimeout(this.removeFire, 800)
        
    }
    
    addFire () {
        for (let f = 0; f < this.fire.length; f++) {
            this.fire.classList.add('fire')
        }
    }

    removeFire () {
        for (let f = 0; f < this.fire.length; f++) {
            this.fire.classList.remove('fire')
        }
    }
}

createBoard()

function createBoard () {
    for (let row = 0; row < 15; row++) {
        let stoneRow = []
        let boxesRow = []
        let bricksRow = []
        for (let col = 0; col < 15; col++) {
            willBrick = Math.ceil(Math.random() * 10)
            let newBox = document.createElement('div')
            newBox.classList.add('box')

            //generate stone
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

            //generate bricks
            if (row > 0 && row < 14 && col > 0 && col < 14) {
                if (willBrick < 10) {
                    if ((row == 1 || row == 13) && col > 3 && col < 11) {
                        newBox.classList.remove('grass')
                        newBox.classList.add('brick')
                        bricksRow.push(true)
                    } else if ((row == 2 || row == 3) && col > 1 && col < 13) {
                        if (!stoneRow[col]) {
                            newBox.classList.remove('grass')
                            newBox.classList.add('brick')
                            bricksRow.push(true)
                        } else {
                            bricksRow.push(false)
                        }
                    } else if ((row == 11 || row == 12) && col > 1 && col < 13) {
                        if (!stoneRow[col]) {
                            newBox.classList.remove('grass')
                            newBox.classList.add('brick')
                            bricksRow.push(true)
                        } else {
                            bricksRow.push(false)
                        }
                    } else if (row > 3 && row < 11 && col > 0 && col < 14) {
                        if (!stoneRow[col]) {
                            newBox.classList.remove('grass')
                            newBox.classList.add('brick')
                            bricksRow.push(true)
                        } else {
                            bricksRow.push(false)
                        }
                    } else {
                        bricksRow.push(false)
                    }
                } else {
                    bricksRow.push(false)
                }
            } else {
                bricksRow.push(false)
            }
            gameBoard.appendChild(newBox)
            boxesRow.push(newBox)
        }
        boxes.push(boxesRow)
        stone.push(stoneRow)
        brick.push(bricksRow)
    }
    player = boxes[yPos][xPos]
    player.appendChild(playerSprite)
}

function movePlayer () {
    if (direction == 'w') {
        direction = 'up'
        if (!stone[yPos-1][xPos] && !brick[yPos-1][xPos]) {
            yPos--
            setAnimatePlayer()
        }
    } else if (direction == 's') {
        direction = 'down'
        if (!stone[yPos+1][xPos] && !brick[yPos+1][xPos]) {
            yPos++
            setAnimatePlayer()
        }
    } else if(direction == 'a') {
        direction = 'left'
        if (!stone[yPos][xPos-1] && !brick[yPos][xPos-1]) {
            xPos--
            setAnimatePlayer()
        }
    } else if (direction == 'd') {
        direction = 'right'
        if (!stone[yPos][xPos+1] && !brick[yPos][xPos+1]) {
            xPos++
            setAnimatePlayer()
        }
    }
    player.removeChild(playerSprite)
    player = boxes[yPos][xPos]
    player.appendChild(playerSprite)
}

function setAnimatePlayer () {
    if (animation == 1) {
        animation = 2
    } else {
        animation = 1
    }
    playerSprite.src = `sprites/white-sprite/white_${direction}/white-walking-${direction}${animation}.png`
}

document.addEventListener('keypress', evt => {
    if (evt.key == 'w' || evt.key == 's' || evt.key == 'd' || evt.key == 'a') {
        direction = evt.key
        movePlayer()
    }
    if (evt.code == 'Space') {
        let newBomb = new Bomb(1, xPos, yPos)
        newBomb.placeBomb()
        setTimeout(newBomb.bombRed, 500)
        setTimeout(newBomb.bombBlack, 1000)
        setTimeout(newBomb.bombRed, 1500)
        setTimeout(newBomb.bombBlack, 2000)
        setTimeout(newBomb.bombExplode, 2500)
    }
})