const gameBoard = document.querySelector('#game-board')
const modal = document.querySelector('#modal')
const message = document.querySelector('h2')

let boxes = []
let stone = []
let brick = []
let willBrick
let player
let playerBombs = 2
let isBomb = []
let isSprite = []
let isDanger = []
let dangerIndex = []
let dangerContainer = []
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
let isDeadAnimation = false

createBoard()

function createBoard () {
    for (let row = 0; row < 15; row++) {
        let stoneRow = []
        let boxesRow = []
        let bricksRow = []
        let bombRow = []
        let spriteRow = []
        let dangerRow = []
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
            dangerRow.push(false)
        }
        boxes.push(boxesRow)
        stone.push(stoneRow)
        brick.push(bricksRow)
        isBomb.push(bombRow)
        isSprite.push(spriteRow)
        isDanger.push(dangerRow)
    }
    player = boxes[yPos][xPos]
    player.appendChild(playerSprite)
    isSprite[yPos][xPos] = true
}

let enemyOne = new Enemy('white', 13, 13)
enemyOne.appendSprite()
enemyOne.randNumber()

let enemyTwo = new Enemy('white', 13, 1)
setTimeout(() => enemyTwo.appendSprite(), 10)
setTimeout(() => enemyTwo.randNumber(), 10)

let enemyThree = new Enemy('white', 1, 13)
setTimeout(() => enemyThree.appendSprite(), 20)
setTimeout(() => enemyThree.randNumber(), 20)

function checkForFire () {
    for (let check = 0; check < isFire.length; check++) {
        let fireY = isFire[check][0]
        let fireX = isFire[check][1]
        if (yPos == fireY && xPos == fireX) {
            playerDead = true
        }
        if (enemyOne.yPos == fireY && enemyOne.xPos == fireX) {
            if (!enemyOne.dead) {
                enemyOne.killSprite()
            }
            enemyOne.dead = true
            enemyOne.isStillSafe = false
        }
        if (enemyTwo.yPos == fireY && enemyTwo.xPos == fireX) {
            if (!enemyTwo.dead) {
                enemyTwo.killSprite()
            }
            enemyTwo.dead = true
            enemyTwo.isStillSafe = false
        }
        if (enemyThree.yPos == fireY && enemyThree.xPos == fireX) {
            if (!enemyThree.dead) {
                enemyThree.killSprite()
            }
            enemyThree.dead = true
            enemyThree.isStillSafe = false
        }
        if (brick[fireY][fireX]) {
            brick[fireY][fireX] = false
            boxes[fireY][fireX].classList.remove('brick')
            boxes[fireY][fireX].classList.add('grass')
        }
        if (enemyOne.dead && enemyTwo.dead && enemyThree.dead) {
            showModal()
        }
    }
    if (playerDead) {
        if (!isDeadAnimation) {
            killPlayer()
            isDeadAnimation = true
        }
    }
}

function showModal () {
    modal.style.display = 'block'
    if (playerDead) {
        message.textContent = 'Oh well. Try again?'
    } else {
        message.textContent = 'You win! Congrats!'
    }
}

function killPlayer () {
    if (deathAnimationCount <= 8) {
        player.removeChild(playerSprite)
        playerSprite.src = `sprites/white-sprite/white_death/white-death${deathAnimationCount}.png`
        player.appendChild(playerSprite)
        deathAnimationCount++
        setTimeout(killPlayer, 100)
    } else {
        player.removeChild(playerSprite)
        setTimeout(showModal, 500)
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