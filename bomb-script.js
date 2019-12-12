const gameBoard = document.querySelector('#game-board')
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

class Bomb {
    constructor (x, y) {
        this.bombX = x
        this.bombY = y
        this.fire = []
        this.fireIndex = 0
    }

    placeBomb () {
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
        this.dead = false
        this.direction = 0
        this.up = true
        this.down = true
        this.left = true
        this.right = true
        this.canMove = false
        this.canBomb = false
        this.bombCount = 1
        this.isStillSafe = true
        this.enemy = boxes[this.yPos][this.xPos]
        this.sprite = document.createElement('img')
        this.sprite.src = `sprites/${this.color}-sprite/${this.color}_down/${this.color}-standing-down.png`
        isSprite[this.yPos][this.xPos] = true
    }

    appendSprite () {
        this.enemy.appendChild(this.sprite)
    }

    randNumber () {
        if (!this.dead) {
            this.canMove = false
            this.up = true
            this.down = true
            this.left = true
            this.right = true
            this.direction = Math.ceil(Math.random() * 4)
            if (!isDanger[this.yPos][this.xPos]) {
                while(!this.canMove) {
                    if (this.direction == 1) {
                        if (stone[this.yPos-1][this.xPos] || brick[this.yPos-1][this.xPos] || isBomb[this.yPos-1][this.xPos] || isSprite[this.yPos-1][this.xPos] || isDanger[this.yPos-1][this.xPos]) {
                            this.direction = Math.ceil(Math.random() * 4)
                            this.up = false
                        } else {
                            this.canMove = true
                        }
                    } else if (this.direction == 2) {
                        if (stone[this.yPos+1][this.xPos] || brick[this.yPos+1][this.xPos] || isBomb[this.yPos+1][this.xPos] || isSprite[this.yPos+1][this.xPos] || isDanger[this.yPos+1][this.xPos]) {
                            this.direction = Math.ceil(Math.random() * 4)
                            this.down = false
                        } else {
                            this.canMove = true
                        }
                    } else if (this.direction == 3) {
                        if (stone[this.yPos][this.xPos-1] || brick[this.yPos][this.xPos-1] || isBomb[this.yPos][this.xPos-1] || isSprite[this.yPos][this.xPos-1] || isDanger[this.yPos][this.xPos-1]) {
                            this.direction = Math.ceil(Math.random() * 4)
                            this.left = false
                        } else {
                            this.canMove = true
                        }
                    } else {
                        if (stone[this.yPos][this.xPos+1] || brick[this.yPos][this.xPos+1] || isBomb[this.yPos][this.xPos+1] || isSprite[this.yPos][this.xPos+1] || isDanger[this.yPos][this.xPos+1]) {
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
            } else {
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
    }

    isTrapped () {
        if (isSprite[this.yPos][this.xPos+1] || isSprite[this.yPos][this.xPos-1] || isSprite[this.yPos+1][this.xPos] || isSprite[this.yPos-1][this.xPos]) {
            if (!this.dead) {
                setTimeout(() => {this.isTrapped()}, 500)
            }
        } else {
            setTimeout(() => {this.randNumber()}, 200)
        }
    }

    moveSprite () {
        isSprite[this.yPos][this.xPos] = false
        if (this.direction == 1) {
            this.yPos--
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
        this.testBomb()
    }

    testBomb () {
        let willBomb = Math.ceil(Math.random() * 4)
        if (willBomb == 4 && this.bombCount > 0) {
            this.simulateExplosion()
        } else {
            if (!playerDead && !this.dead) {
                setTimeout(() => {this.randNumber()}, 500)
            }
        }
    }

    simulateExplosion () {
        dangerIndex.push([this.yPos, this.xPos])
        isDanger[this.yPos][this.xPos] = true
        if (!stone[this.yPos-1][this.xPos]) {
            dangerIndex.push([this.yPos-1, this.xPos])
            isDanger[this.yPos-1][this.xPos] = true
            if (!stone[this.yPos-2][this.xPos] && !brick[this.yPos-1][this.xPos]) {
                dangerIndex.push([this.yPos-2, this.xPos])
                isDanger[this.yPos-2][this.xPos] = true
            }
        } if (!stone[this.yPos+1][this.xPos]) {
            dangerIndex.push([this.yPos+1, this.xPos])
            isDanger[this.yPos+1][this.xPos] = true
            if (!stone[this.yPos+2][this.xPos] && !brick[this.yPos+1][this.xPos]) {
                dangerIndex.push([this.yPos+2, this.xPos])
                isDanger[this.yPos+2][this.xPos] = true
            }
        } if (!stone[this.yPos][this.xPos+1]) {
            dangerIndex.push([this.yPos, this.xPos+1])
            isDanger[this.yPos][this.xPos+1] = true
            if (!stone[this.yPos][this.xPos+2] && !brick[this.yPos][this.xPos+1]) {
                dangerIndex.push([this.yPos, this.xPos+2])
                isDanger[this.yPos][this.xPos+2] = true
            }
        } if (!stone[this.yPos][this.xPos-1]) {
            dangerIndex.push([this.yPos, this.xPos-1])
            isDanger[this.yPos][this.xPos-1] = true
            if (!stone[this.yPos][this.xPos-2] && !brick[this.yPos][this.xPos-1]) {
                dangerIndex.push([this.yPos, this.xPos-2])
                isDanger[this.yPos][this.xPos-2] = true
            }
        }
        dangerContainer.push(dangerIndex)
        dangerIndex = []
        for (let tester = 0; tester < dangerContainer.length; tester++) {
            console.log(dangerContainer[tester])
        }
        this.simulateRoute()
    }

    simulateRoute () {
        let safeRoute = false
        let simCount = 0
        let y1
        let x1
        let y2
        let x2
        let y3 = false
        let x3 = false

        for (let routeOne = 1; routeOne <= 4; routeOne++) {
            if (routeOne == 1) {
                if (stone[this.yPos-1][this.xPos] || brick[this.yPos-1][this.xPos] || isBomb[this.yPos-1][this.xPos] || isSprite[this.yPos-1][this.xPos]) {
                    simCount++
                    console.log(simCount)
                } else {
                    console.log('work')
                    y1 = this.yPos-1
                    x1 = this.xPos
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1-1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 2) {
                            if (stone[y1+1][x1] || brick[y1+1][x1] || isBomb[y1+1][x1] || isSprite[y1+1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1+1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 3) {
                            if (stone[y1][x1-1] || brick[y1][x1-1] || isBomb[y1][x1-1] || isSprite[y1][x1-1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1
                                x2 = x1-1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else { 
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else {
                            if (stone[y1][x1+1] || brick[y1][x1+1] || isBomb[y1][x1+1] || isSprite[y1][x1+1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1
                                x2 = x1+1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        }
                        if (safeRoute) {
                            routeTwo = 5
                        }
                    }
                }
            } else if (routeOne == 2) {
                if (stone[this.yPos+1][this.xPos] || brick[this.yPos+1][this.xPos] || isBomb[this.yPos+1][this.xPos] || isSprite[this.yPos+1][this.xPos]) {
                    simCount++
                    console.log(simCount)
                } else {
                    console.log('work')
                    y1 = this.yPos+1
                    x1 = this.xPos
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1-1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 2) {
                            if (stone[y1+1][x1] || brick[y1+1][x1] || isBomb[y1+1][x1] || isSprite[y1+1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1+1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 3) {
                            if (stone[y1][x1-1] || brick[y1][x1-1] || isBomb[y1][x1-1] || isSprite[y1][x1-1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('safe')
                                y2 = y1
                                x2 = x1-1
                                console.log(y2, x2)
                                console.log(y1, this.yPos)
                                console.log(isDanger[12][13])
                                if (!isDanger[y2][x2]) {
                                    console.log('safe')
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('fail')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else {
                            if (stone[y1][x1+1] || brick[y1][x1+1] || isBomb[y1][x1+1] || isSprite[y1][x1+1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1
                                x2 = x1+1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        }
                        if (safeRoute) {
                            routeTwo = 5
                        }
                    }
                }
            } else if (routeOne == 3) {
                if (stone[this.yPos][this.xPos-1] || brick[this.yPos][this.xPos-1] || isBomb[this.yPos][this.xPos-1] || isSprite[this.yPos][this.xPos-1]) {
                    simCount++
                    console.log(simCount)
                } else {
                    console.log('work')
                    y1 = this.yPos
                    x1 = this.xPos-1
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1-1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 2) {
                            if (stone[y1+1][x1] || brick[y1+1][x1] || isBomb[y1+1][x1] || isSprite[y1+1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1+1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 3) {
                            if (stone[y1][x1-1] || brick[y1][x1-1] || isBomb[y1][x1-1] || isSprite[y1][x1-1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1
                                x2 = x1-1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else {
                            if (stone[y1][x1+1] || brick[y1][x1+1] || isBomb[y1][x1+1] || isSprite[y1][x1+1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1
                                x2 = x1+1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        }
                        if (safeRoute) {
                            routeTwo = 5
                        }
                    }

                }
            } else {
                if (stone[this.yPos][this.xPos+1] || brick[this.yPos][this.xPos+1] || isBomb[this.yPos][this.xPos+1] || isSprite[this.yPos][this.xPos+1]) {
                    simCount++
                    console.log(simCount)
                } else {
                    console.log('work')
                    y1 = this.yPos
                    x1 = this.xPos+1
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1-1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 2) {
                            if (stone[y1+1][x1] || brick[y1+1][x1] || isBomb[y1+1][x1] || isSprite[y1+1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1+1
                                x2 = x1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else if (routeTwo == 3) {
                            if (stone[y1][x1-1] || brick[y1][x1-1] || isBomb[y1][x1-1] || isSprite[y1][x1-1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1
                                x2 = x1-1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        } else {
                            if (stone[y1][x1+1] || brick[y1][x1+1] || isBomb[y1][x1+1] || isSprite[y1][x1+1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                console.log('work')
                                y2 = y1
                                x2 = x1+1
                                if (!isDanger[y2][x2]) {
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2-1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 2) {
                                            if (stone[y2+1][x2] || brick[y2+1][x2] || isBomb[y2+1][x2] || isSprite[y2+1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2+1
                                                x3 = x2
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else if (routeThree == 3) {
                                            if (stone[y2][x2-1] || brick[y2][x2-1] || isBomb[y2][x2-1] || isSprite[y2][x2-1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2-1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        } else {
                                            if (stone[y2][x2+1] || brick[y2][x2+1] || isBomb[y2][x2+1] || isSprite[y2][x2+1]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                console.log('work')
                                                y3 = y2
                                                x3 = x2+1
                                                if(!isDanger[y3][x3]) {
                                                    safeRoute = true
                                                }
                                            }
                                        }
                                        if (safeRoute) {
                                        routeThree = 5
                                        } else {
                                            y3 = false
                                        }
                                    }
                                }
                            }
                        }
                        if (safeRoute) {
                            routeTwo = 5
                        }
                    }
                }
            }
            if (safeRoute) {
                routeOne = 5
            }
        }
        if (safeRoute) {
            console.log('SAFE')
            this.placeBombDown()
            setTimeout(() => this.moveRoute(y1, x1), 500)
            setTimeout(() => this.moveRoute(y2, x2), 1000)
            if (y3 != false) {
                setTimeout(() => this.moveRoute(y3, x3), 1500)
            }
            setTimeout(() => this.setSafe(), 2000)
            setTimeout(() => this.randNumber(), 2000)
            setTimeout(() => this.removeDanger(), 2900)
        } else {
            let dLength = dangerContainer.length - 1
            for (let s = 0; s < dangerContainer[dLength].length; s++) {
                isDanger[dangerContainer[dLength][s][0]][dangerContainer[dLength][s][1]] = false
            }
            dangerContainer.pop()
            console.log('NOT SAFE')
            for (let tester = 0; tester < dangerContainer.length; tester++) {
                console.log(dangerContainer[tester])
            }
            this.randNumber()
        }
    }

    moveRoute(yMove, xMove) {
        if (this.isStillSafe && (stone[yMove][xMove] || brick[yMove][xMove] || isBomb[yMove][xMove] || isSprite[yMove][xMove])) {
            this.isStillSafe = false
        }
        if (this.isStillSafe) {
            isSprite[this.yPos][this.xPos] = false
            this.yPos = yMove
            this.xPos = xMove
            this.enemy.removeChild(this.sprite)
            this.enemy = boxes[this.yPos][this.xPos]
            this.enemy.appendChild(this.sprite)
            isSprite[this.yPos][this.xPos] = true
        }
    }

    setSafe () {
        this.isStillSafe = true
    }

    removeDanger () {
        console.log('remove danger')
        for (let s = 0; s < dangerContainer[0].length; s++) {
            isDanger[dangerContainer[0][s][0]][dangerContainer[0][s][1]] = false
        }
        dangerContainer.shift()
        console.log(dangerContainer)
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
            setTimeout(() => {this.canBombAgain()}, 2850)
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
            enemyOne.dead = true
            enemyOne.isStillSafe = false
            console.log('DEAD')
            console.log(isDanger[enemyOne.yPos][enemyOne.xPos])
            console.log(enemyOne.yPos, enemyOne.xPos)
        }
        if (enemyTwo.yPos == fireY && enemyTwo.xPos == fireX) {
            enemyTwo.dead = true
            enemyTwo.isStillSafe = false
            console.log('DEAD')
            console.log(isDanger[enemyTwo.yPos][enemyTwo.xPos])
            console.log(enemyTwo.yPos, enemyTwo.xPos)
        }
        if (enemyThree.yPos == fireY && enemyThree.xPos == fireX) {
            enemyThree.dead = true
            enemyThree.isStillSafe = false
            console.log('DEAD')
            console.log(isDanger[enemyThree.yPos][enemyThree.xPos])
            console.log(enemyThree.yPos, enemyThree.xPos)
        }
        if (brick[fireY][fireX]) {
            brick[fireY][fireX] = false
            boxes[fireY][fireX].classList.remove('brick')
            boxes[fireY][fireX].classList.add('grass')
        }
        if (enemyOne.dead && enemyTwo.dead && enemyThree.dead) {
            alert('YOU WON!')
        }
    }
    if (playerDead) {
        if (!isDeadAnimation) {
            killPlayer()
            isDeadAnimation = true
        }
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