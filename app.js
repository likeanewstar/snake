const gameBoard = document.getElementById('game-board')
const boardSize = 17
const startBtn = document.querySelector('.start')

let snakeElement = document.createElement('div')
const appleElement = document.createElement('div')

let snakeBody = [{ x: 1, y: 1 }]
let applePos = { x: 0, y: 0 }

let timer
let direction = 'right' // 시작 시 진행 방향

setBoard(boardSize)
function setBoard(boardSize) {
  boardSize = `repeat(${boardSize},1fr)`
  gameBoard.style.gridTemplateRows = boardSize
  gameBoard.style.gridTemplateColumns = boardSize
}

// 게임 시작
function draw(gameBoard) {
  randomApple()

  snakeBody = [{ x: 1, y: 1 }]
  snakeBody.forEach(segment => {
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
  })
  timer = setInterval(interval, 200)
}

function randomApple() {
  let apple = document.querySelector('.apple')
  if (apple) apple.remove()

  let appleIndexX = Math.floor(Math.random() * boardSize) + 1
  let appleIndexY = Math.floor(Math.random() * boardSize) + 1

  if (appleIndexX == 1 && appleIndexY == 1) {
    randomApple()
  }

  applePos = { x: appleIndexX, y: appleIndexY }

  appleElement.style.gridRowStart = applePos.y
  appleElement.style.gridColumnStart = applePos.x
  appleElement.classList.add('apple')
  gameBoard.appendChild(appleElement)
}

function gameOver() {
  alert('Game Over!')
  clearInterval(timer)
  let snakes = document.querySelectorAll('.snake')
  let apple = document.querySelector('.apple')
  snakes.forEach(snake => snake.parentNode.removeChild(snake))
  apple.remove()
  direction = 'right'
}

function interval() {
  let snakes = document.querySelectorAll('.snake')
  if (snakes) {
    snakes.forEach(snake => snake.parentNode.removeChild(snake))
  }

  let nextPos = { x: snakeBody[0].x, y: snakeBody[0].y }

  if (direction == 'right') {
    // right
    nextPos.x = nextPos.x + 1
    if (nextPos.x > boardSize) {
      gameOver()
      return false
    }
  } else if (direction == 'top') {
    // top
    nextPos.y = nextPos.y - 1
    if (nextPos.y < 1) {
      gameOver()
      return false
    }
  } else if (direction == 'left') {
    // left
    nextPos.x = nextPos.x - 1
    if (nextPos.x < 1) {
      gameOver()
      return false
    }
  } else if (direction == 'bottom') {
    // bottom
    nextPos.y = nextPos.y + 1
    if (nextPos.y > boardSize) {
      gameOver()
      return false
    }
  }

  snakeBody.unshift(nextPos)
  let tail = snakeBody.pop()

  // 사과 먹을 경우
  if (nextPos.x == applePos.x && nextPos.y == applePos.y) {
    console.log('🍎')
    snakeBody.push(tail)
    randomApple()
  }

  snakeBody.forEach(segment => {
    snakeElement = document.createElement('div')
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
  })
}

function control(e) {
  if (e.keyCode === 39) {
    // right
    direction = 'right'
  } else if (e.keyCode === 38) {
    // top
    direction = 'top'
  } else if (e.keyCode === 37) {
    // left
    direction = 'left'
  } else if (e.keyCode === 40) {
    // bottom
    direction = 'bottom'
  }
}

document.addEventListener('keydown', control)
startBtn.addEventListener('click', function () {
  draw(gameBoard)
})
