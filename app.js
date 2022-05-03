const gameBoard = document.getElementById('game-board')
const boardSize = 17
const startBtn = document.querySelector('.start')
let snakeBody = [{ x: 1, y: 1 }]
const snakeElement = document.createElement('div')
let applePosition = { x: 0, y: 0 }
const appleElement = document.createElement('div')
let direction = 'right'

setBoard(boardSize)

function setBoard(boardSize) {
  boardSize = `repeat(${boardSize},1fr)`
  gameBoard.style.gridTemplateRows = boardSize
  gameBoard.style.gridTemplateColumns = boardSize
}

function draw(gameBoard) {
  randomApple()

  snakeBody = [{ x: 1, y: 1 }]
  snakeBody.forEach(segment => {
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
  })
  let interval = setInterval(timer, 500)
}

function randomApple() {
  let appleIndexX = Math.floor(Math.random() * boardSize)
  let appleIndexY = Math.floor(Math.random() * boardSize)

  applePosition = { x: appleIndexX, y: appleIndexY }

  appleElement.style.gridRowStart = applePosition.x
  appleElement.style.gridColumnStart = applePosition.y
  appleElement.classList.add('apple')
  gameBoard.appendChild(appleElement)
}

function gameOver() {
  alert('Game Over!')
  snakeElement.remove()
  appleElement.remove()
}

function timer() {
  let nextPos = { x: snakeBody[0].x, y: snakeBody[0].y }

  if (direction == 'right') {
    // right
    nextPos.x = nextPos.x + 1
  } else if (direction == 'top') {
    // top
    nextPos.y = nextPos.y - 1
  } else if (direction == 'left') {
    // left
    nextPos.x = nextPos.x - 1
  } else if (direction == 'bottom') {
    // bottom
    nextPos.y = nextPos.y + 1
  }

  snakeBody.unshift(nextPos)
  let tail = snakeBody.pop()

  console.log(snakeBody)

  snakeBody.forEach(segment => {
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
