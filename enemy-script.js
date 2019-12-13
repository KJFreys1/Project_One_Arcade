class Enemy {
    constructor (color, y, x) {
        this.color = color
        this.yPos = y
        this.xPos = x
        this.animationCounter = 1
        this.deathAnimationCount = 1
        this.direction = 'down'
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

    animateSprite () {
        if (this.animationCounter == 1) {
            this.sprite.src = `sprites/${this.color}-sprite/${this.color}_${this.direction}/${this.color}-walking-${this.direction}${this.animationCounter}.png`
            this.animationCounter = 2
        } else {
            this.sprite.src = `sprites/${this.color}-sprite/${this.color}_${this.direction}/${this.color}-walking-${this.direction}${this.animationCounter}.png`
            this.animationCounter = 1
        }
    }

    killSprite () {
        if (this.deathAnimationCount <= 8) {
            this.enemy.removeChild(this.sprite)
            this.sprite.src = `sprites/${this.color}-sprite/${this.color}_death/${this.color}-death${this.deathAnimationCount}.png`
            this.enemy.appendChild(this.sprite)
            this.deathAnimationCount++
            setTimeout(() => this.killSprite(), 100)
        } else {
            this.enemy.removeChild(this.sprite)
            isSprite[this.yPos][this.xPos] = false
        }
    }

    moveSprite () {
        isSprite[this.yPos][this.xPos] = false
        if (this.direction == 1) {
            this.yPos--
            this.direction = 'up'
        } else if (this.direction == 2) {
            this.yPos++
            this.direction = 'down'
        } else if (this.direction == 3) {
            this.xPos--
            this.direction = 'left'
        } else {
            this.xPos++
            this.direction = 'right'
        }
        this.animateSprite()
        isSprite[this.yPos][this.xPos] = true
        this.enemy.removeChild(this.sprite)
        this.enemy = boxes[this.yPos][this.xPos]
        this.enemy.appendChild(this.sprite)
        if (brick[this.yPos-1][this.xPos] || brick[this.yPos+1][this.xPos] || brick[this.yPos][this.xPos-1] || brick[this.yPos][this.xPos+1]) {
            this.testBomb()
        } else {
            setTimeout(() => this.randNumber(), 500)
        }
    }

    testBomb () {
        let willBomb = Math.ceil(Math.random() * 2)
        if (willBomb == 2 && this.bombCount > 0) {
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
                    
                    y1 = this.yPos-1
                    x1 = this.xPos
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                
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
                    
                    y1 = this.yPos+1
                    x1 = this.xPos
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                
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
                                
                                y2 = y1
                                x2 = x1-1
                                console.log(y2, x2)
                                console.log(y1, this.yPos)
                                console.log(isDanger[12][13])
                                if (!isDanger[y2][x2]) {
                                    
                                    safeRoute = true
                                } else {
                                    for (let routeThree = 1; routeThree <= 4; routeThree++) {
                                        if (routeThree == 1) {
                                            if (stone[y2-1][x2] || brick[y2-1][x2] || isBomb[y2-1][x2] || isSprite[y2-1][x2]) {
                                                simCount++
                                                console.log(simCount)
                                            } else {
                                                
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
                    
                    y1 = this.yPos
                    x1 = this.xPos-1
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                
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
                    
                    y1 = this.yPos
                    x1 = this.xPos+1
                    for (let routeTwo = 1; routeTwo <= 4; routeTwo++) {
                        if (routeTwo == 1) {
                            if (stone[y1-1][x1] || brick[y1-1][x1] || isBomb[y1-1][x1] || isSprite[y1-1][x1]) {
                                simCount++
                                console.log(simCount)
                            } else {
                                
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
            
            for (let tester = 0; tester < dangerContainer.length; tester++) {
                
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
            if (this.yPos > yMove) {
                this.direction = 'up'
            } if (this.yPos < yMove) {
                this.direction = 'down'
            } if (this.xPos > xMove) {
                this.direction = 'left'
            } if (this.xPos < xMove) {
                this.direction = 'right'
            }
            this.animateSprite()
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
        for (let s = 0; s < dangerContainer[0].length; s++) {
            isDanger[dangerContainer[0][s][0]][dangerContainer[0][s][1]] = false
        }
        dangerContainer.shift()
        
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