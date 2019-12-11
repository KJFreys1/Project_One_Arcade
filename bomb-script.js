const gameBoard = document.querySelector('#game-board')
let boxes = []
let stone = []
let brick = []
let willBrick
let player
let playerBombs = 2
let isBomb = []
let isSprite = []
let bombIndex = []
let direction = 'down'
let animation = 1
let playerSprite = document.createElement('img')
playerSprite.src = 'sprites/white-sprite/white_down/white-standing-down.png'
let xPos = 1
let yPos = 1
let isFire = []
let playerDead = false
let deathAnimationCount = 1

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
        if (!stone[this.bombY-1][this.bombX]) {
            isFire.push([this.bombY-1, this.bombX])
            this.fire.push(boxes[this.bombY-1][this.bombX])
            this.fireIndex++
            if (!stone[this.bombY-2][this.bombX] && !brick[this.bombY-1][this.bombX]) {
                isFire.push([this.bombY-2, this.bombX])
                this.fire.push(boxes[this.bombY-2][this.bombX])
                this.fireIndex++
            }
        } if (!stone[this.bombY+1][this.bombX]) {
            isFire.push([this.bombY+1, this.bombX])
            this.fire.push(boxes[this.bombY+1][this.bombX])
            this.fireIndex++
            if (!stone[this.bombY+2][this.bombX] && !brick[this.bombY+1][this.bombX]) {
                isFire.push([this.bombY+2, this.bombX])
                this.fire.push(boxes[this.bombY+2][this.bombX])
                this.fireIndex++
            }
        } if (!stone[this.bombY][this.bombX+1]) {
            isFire.push([this.bombY, this.bombX+1])
            this.fire.push(boxes[this.bombY][this.bombX+1])
            this.fireIndex++
            if (!stone[this.bombY][this.bombX+2] && !brick[this.bombY][this.bombX+1]) {
                isFire.push([this.bombY, this.bombX+2])
                this.fire.push(boxes[this.bombY][this.bombX+2])
                this.fireIndex++
            }
        } if (!stone[this.bombY][this.bombX-1]) {
            isFire.push([this.bombY, this.bombX-1])
            this.fire.push(boxes[this.bombY][this.bombX-1])
            this.fireIndex++
            if (!stone[this.bombY][this.bombX-2] && !brick[this.bombY][this.bombX-1]) {
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
        checkForFire()
        for (let q = 0; q < this.fireIndex; q++) {
            isFire.shift()
        }
        isBomb[bombIndex[0][0]][bombIndex[0][1]] = false
        bombIndex.shift()
    }
}

class Enemy {
    constructor (color, y, x) {
        this.color = color
        this.yPos = y
        this.xPos = x
        this.direction = 0
        this.up = true
        this.down = true
        this.left = true
        this.right = true
        this.canMove = false
        this.canBomb = false
        this.bombCount = 2
        this.enemy = boxes[this.yPos][this.xPos]
        this.sprite = document.createElement('img')
        this.sprite.src = `sprites/${this.color}-sprite/${this.color}_down/${this.color}-standing-down.png`
        isSprite[this.yPos][this.xPos] = true
    }

    appendSprite () {
        this.enemy.appendChild(this.sprite)
    }

    randNumber () {
        this.canMove = false
        this.up = true
        this.down = true
        this.left = true
        this.right = true
        this.direction = Math.ceil(Math.random() * 4)
        while(!this.canMove) {
            if (this.direction == 1) {
                if (stone[this.yPos-1][this.xPos] || brick[this.yPos-1][this.xPos] || isBomb[this.yPos-1][this.xPos] || isSprite[this.yPos-1][this.xPos]) {
                    this.direction = Math.ceil(Math.random() * 4)
                    this.up = false
                } else {
                    this.canMove = true
                }
            } else if (this.direction == 2) {
                if (stone[this.yPos+1][this.xPos] || brick[this.yPos+1][this.xPos] || isBomb[this.yPos+1][this.xPos] || isSprite[this.yPos+1][this.xPos]) {
                    this.direction = Math.ceil(Math.random() * 4)
                    this.down = false
                } else {
                    this.canMove = true
                }
            } else if (this.direction == 3) {
                if (stone[this.yPos][this.xPos-1] || brick[this.yPos][this.xPos-1] || isBomb[this.yPos][this.xPos-1] || isSprite[this.yPos][this.xPos-1]) {
                    this.direction = Math.ceil(Math.random() * 4)
                    this.left = false
                } else {
                    this.canMove = true
                }
            } else {
                if (stone[this.yPos][this.xPos+1] || brick[this.yPos][this.xPos+1] || isBomb[this.yPos][this.xPos+1] || isSprite[this.yPos][this.xPos+1]) {
                    this.direction = Math.ceil(Math.random() * 4)
                    this.right = false
                } else {
                    this.canMove = true
                }
            }
            if (!this.right && !this.left && !this.down && !this.up) {
                this.canMove = true
            }
        }
        if (!this.right && !this.left && !this.down && !this.up) {
            this.isTrapped()
        } else {
            this.right = true
            this.left = true
            this.down = true
            this.up = true
            this.moveSprite()
        }
    }

    isTrapped () {
        if (isSprite[this.yPos][this.xPos+1] || isSprite[this.yPos][this.xPos-1] || isSprite[this.yPos+1][this.xPos] || isSprite[this.yPos-1][this.xPos]) {
            setTimeout(() => {enemyOne.isTrapped()}, 500)
        } else {
            setTimeout(() => {enemyOne.randNumber()}, 200)
        }
    }

    moveSprite () {
        isSprite[this.yPos][this.xPos] = false
        if (this.direction == 1) {
            this.yPos--
            // this.placeBombDown()
        } else if (this.direction == 2) {
            this.yPos++
        } else if (this.direction == 3) {
            this.xPos--
        } else {
            this.xPos++
        }
        isSprite[this.yPos][this.xPos] = true
        this.enemy.removeChild(this.sprite)
        this.enemy = boxes[this.yPos][this.xPos]
        this.enemy.appendChild(this.sprite)
        if (!playerDead) {
            setTimeout(function () {enemyOne.randNumber()}, 500)
        }
    }

    placeBombDown () {
        this.canBomb = false
        if (this.bombCount > 0 && !isBomb[this.yPos][this.xPos]) {
            this.canBomb = true
        }
        if (this.canBomb) {
            this.bombCount--
            bombIndex.push([this.yPos, this.xPos])
            isBomb[this.yPos][this.xPos] = true
            let newBomb = new Bomb(this.xPos, this.yPos)
            newBomb.placeBomb()
            setTimeout(() => {newBomb.bombRed()}, 500)
            setTimeout(() => {newBomb.bombBlack()}, 1000)
            setTimeout(() => {newBomb.bombRed()}, 1500)
            setTimeout(() => {newBomb.bombBlack()}, 2000)
            setTimeout(() => {newBomb.bombExplode()}, 2500)
            setTimeout(() => {newBomb.addFire()}, 2500)
            setTimeout(() => {newBomb.removeFire()}, 2850)
            setTimeout(() => {enemyOne.canBombAgain()}, 2850)
        }
    }

    canBombAgain () {
        this.bombCount++
    }
}

createBoard()

function createBoard () {
    for (let row = 0; row < 15; row++) {
        let stoneRow = []
        let boxesRow = []
        let bricksRow = []
        let bombRow = []
        let spriteRow = []
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
            bombRow.push(false)
            spriteRow.push(false)
        }
        boxes.push(boxesRow)
        stone.push(stoneRow)
        brick.push(bricksRow)
        isBomb.push(bombRow)
        isSprite.push(spriteRow)
    }
    player = boxes[yPos][xPos]
    player.appendChild(playerSprite)
    isSprite[yPos][xPos] = true
}

let enemyOne = new Enemy('white', 13, 13)
enemyOne.appendSprite()
enemyOne.randNumber()

function checkForFire () {
    for (let check = 0; check < isFire.length; check++) {
        let fireY = isFire[check][0]
        let fireX = isFire[check][1]
        if (yPos == fireY && xPos == fireX) {
            playerDead = true
        }
        if (brick[fireY][fireX]) {
            brick[fireY][fireX] = false
            boxes[fireY][fireX].classList.remove('brick')
            boxes[fireY][fireX].classList.add('grass')
        }
    }
    if (playerDead == true) {
        killPlayer()
    }
}

function killPlayer () {
    if (deathAnimationCount <= 8) {
        player.removeChild(playerSprite)
        playerSprite.src = `sprites/white-sprite/white_death/white-death${deathAnimationCount}.png`
        player.appendChild(playerSprite)
        deathAnimationCount++
        setTimeout(killPlayer, 200)
    } else {
        player.removeChild(playerSprite)
    }
}

function movePlayer () {
    if (!playerDead) {
        isSprite[yPos][xPos] = false
        if (direction == 'w') {
            direction = 'up'
            if (!stone[yPos-1][xPos] && !brick[yPos-1][xPos] && !isBomb[yPos-1][xPos] && !isSprite[yPos-1][xPos]) {
                yPos--
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        } else if (direction == 's') {
            direction = 'down'
            if (!stone[yPos+1][xPos] && !brick[yPos+1][xPos] && !isBomb[yPos+1][xPos] && !isSprite[yPos+1][xPos]) {
                yPos++
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        } else if(direction == 'a') {
            direction = 'left'
            if (!stone[yPos][xPos-1] && !brick[yPos][xPos-1] && !isBomb[yPos][xPos-1] && !isSprite[yPos][xPos-1]) {
                xPos--
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        } else if (direction == 'd') {
            direction = 'right'
            if (!stone[yPos][xPos+1] && !brick[yPos][xPos+1] && !isBomb[yPos][xPos+1] && !isSprite[yPos][xPos+1]) {
                xPos++
                setAnimatePlayer()
            } else {
                playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            }
        }
        isSprite[yPos][xPos] = true
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

function allowBomb () {
    playerBombs++
}

document.addEventListener('keypress', evt => {
    if (evt.key == 'w' || evt.key == 's' || evt.key == 'd' || evt.key == 'a') {
        direction = evt.key
        movePlayer()
    }
    if (evt.code == 'Space') {
        let canBomb = false
        if (playerBombs > 0 && !isBomb[yPos][xPos]) {
            canBomb = true
        }
        if (canBomb == true) {
            playerBombs--
            bombIndex.push([yPos, xPos])
            isBomb[yPos][xPos] = true
            player.removeChild(playerSprite)
            playerSprite.src = `sprites/white-sprite/white_${direction}/white-standing-${direction}.png`
            player.appendChild(playerSprite)
            let newBomb = new Bomb(xPos, yPos)
            newBomb.placeBomb()
            setTimeout(() => {newBomb.bombRed()}, 500)
            setTimeout(() => {newBomb.bombBlack()}, 1000)
            setTimeout(() => {newBomb.bombRed()}, 1500)
            setTimeout(() => {newBomb.bombBlack()}, 2000)
            setTimeout(() => {newBomb.bombExplode()}, 2500)
            setTimeout(() => {newBomb.addFire()}, 2500)
            setTimeout(() => {newBomb.removeFire()}, 2850)
            setTimeout(allowBomb, 2850)
        }
    }
})