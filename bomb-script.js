const gameBoard = document.querySelector('#game-board')
let boxes = []
let stone = []
let brick = []
let willBrick
let player
let playerBombs = [true, true]
let direction = 'down'
let animation = 1
let playerSprite = document.createElement('img')
playerSprite.src = 'sprites/white-sprite/white_down/white-standing-down.png'
let xPos = 1
let yPos = 1
let bombX
let bombY
let isFire = []
let playerDead = false

class Bomb {
    constructor (x, y) {
        this.bombX = x
        this.bombY = y
        this.fire = []
        this.fireIndex = 0
    }

    placeBomb() {
        boxes[this.bombY][this.bombX].classList.add('bomb-black')
    }

    bombRed () {
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
        isFire.push([this.bombY, this.bombX])
        this.fireIndex++
        if (stone[this.bombY-1][this.bombX] == false) {
            isFire.push([this.bombY-1, this.bombX])
            this.fire.push(boxes[this.bombY-1][this.bombX])
            this.fireIndex++
            if (stone[this.bombY-2][this.bombX] == false) {
                isFire.push([this.bombY-2, this.bombX])
                this.fire.push(boxes[this.bombY-2][this.bombX])
                this.fireIndex++
            }
        } if (stone[this.bombY+1][this.bombX] == false) {
            isFire.push([this.bombY+1, this.bombX])
            this.fire.push(boxes[this.bombY+1][this.bombX])
            this.fireIndex++
            if (stone[this.bombY+2][this.bombX] == false) {
                isFire.push([this.bombY+2, this.bombX])
                this.fire.push(boxes[this.bombY+2][this.bombX])
                this.fireIndex++
            }
        } if (stone[this.bombY][this.bombX+1] == false) {
            isFire.push([this.bombY, this.bombX+1])
            this.fire.push(boxes[this.bombY][this.bombX+1])
            this.fireIndex++
            if (stone[this.bombY][this.bombX+2] == false) {
                isFire.push([this.bombY, this.bombX+2])
                this.fire.push(boxes[this.bombY][this.bombX+2])
                this.fireIndex++
            }
        } if (stone[this.bombY][this.bombX-1] == false) {
            isFire.push([this.bombY, this.bombX-1])
            this.fire.push(boxes[this.bombY][this.bombX-1])
            this.fireIndex++
            if (stone[this.bombY][this.bombX-2] == false) {
                isFire.push([this.bombY, this.bombX-2])
                this.fire.push(boxes[this.bombY][this.bombX-2])
                this.fireIndex++
            }
        }
    }
    
    addFire () {
        for (let f = 0; f < this.fire.length; f++) {
            this.fire[f].classList.add('fire')
        }
        checkForFire()
    }

    removeFire () {
        for (let f = 0; f < this.fire.length; f++) {
            this.fire[f].classList.remove('fire')
        }
        playerBombs.push(true)
        playerBombs.shift()
        for (let q = 0; q < this.fireIndex; q++) {
            isFire.shift()
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

function checkForFire () {
    for (let check = 0; check < isFire.length; check++) {
        if (yPos == isFire[check][0] && xPos == isFire[check][1]) {
            playerDead = true
        }
    }
    if (playerDead == true) {
        console.log('dead')
    }
}

function movePlayer () {
    if (!playerDead) {
        if (direction == 'w') {
            direction = 'up'
            if (!stone[yPos-1][xPos] && !brick[yPos-1][xPos]) {
                yPos--
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        } else if (direction == 's') {
            direction = 'down'
            if (!stone[yPos+1][xPos] && !brick[yPos+1][xPos]) {
                yPos++
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        } else if(direction == 'a') {
            direction = 'left'
            if (!stone[yPos][xPos-1] && !brick[yPos][xPos-1]) {
                xPos--
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        } else if (direction == 'd') {
            direction = 'right'
            if (!stone[yPos][xPos+1] && !brick[yPos][xPos+1]) {
                xPos++
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        }
        player.removeChild(playerSprite)
        player = boxes[yPos][xPos]
        player.appendChild(playerSprite)
    }
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
        let canBomb = false
        for (let c = 0; c < playerBombs.length; c++) {
            if (playerBombs[c]) {
                canBomb = true
                playerBombs.shift()
                playerBombs.push(false)
                c = playerBombs.length
            }
        }
        if (canBomb == true) {
            player.removeChild(playerSprite)
            playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            player.appendChild(playerSprite)
            let newBomb = new Bomb(xPos, yPos)
            newBomb.placeBomb()
            setTimeout(function () {newBomb.bombRed()}, 500)
            setTimeout(function () {newBomb.bombBlack()}, 1000)
            setTimeout(function () {newBomb.bombRed()}, 1500)
            setTimeout(function () {newBomb.bombBlack()}, 2000)
            setTimeout(function () {newBomb.bombExplode()}, 2500)
            setTimeout(function () {newBomb.addFire()}, 2500)
            setTimeout(function () {newBomb.removeFire()}, 3200)
        }
    }
})