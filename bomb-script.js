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