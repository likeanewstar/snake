const gameBoard = document.getElementById('game-board')
const boardSize = 17
const startBtn = document.querySelector('.start')
let snakeBody = [{ x: 1, y: 1 }]
const snakeElement = document.createElement('div')
let applePosition = { x: 0, y: 0 }
const appleElement = document.createElement('div')

setBoard(boardSize)

function setBoard(boardSize) {
  boardSize = `repeat(${boardSize},1fr)`
  gameBoard.style.gridTemplateRows = boardSize
  gameBoard.style.gridTemplateColumns = boardSize
}

function draw(gameBoard) {
  snakeBody = [{ x: 1, y: 1 }]
  snakeBody.forEach(segment => {
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
  })
  ramdomApple()
}

function ramdomApple() {
  let appleIndexX = Math.floor(Math.random() * boardSize)
  let appleIndexY = Math.floor(Math.random() * boardSize)

  applePosition = { x: appleIndexX, y: appleIndexY }

  appleElement.style.gridRowStart = applePosition.x
  appleElement.style.gridColumnStart = applePosition.y
  appleElement.classList.add('apple')
  gameBoard.appendChild(appleElement)

  console.log(applePosition)
}

function gameOver() {
  alert('Game Over!')
  snakeElement.remove()
}

//assign functions to keycodes
function control(e) {
  if (e.keyCode === 39) {
    // right
    snakeBody.forEach(segment => {
      if (segment.x >= boardSize) {
        gameOver()
        return false
      }
      snakeElement.style.gridColumnStart = ++segment.x
    })
  } else if (e.keyCode === 38) {
    // top
    snakeBody.forEach(segment => {
      if (segment.y <= 1) {
        gameOver()
        return false
      }
      snakeElement.style.gridRowStart = --segment.y
    })
  } else if (e.keyCode === 37) {
    // left
    snakeBody.forEach(segment => {
      if (segment.x <= 1) {
        gameOver()
        return false
      }
      snakeElement.style.gridColumnStart = --segment.x
    })
  } else if (e.keyCode === 40) {
    // bottom
    snakeBody.forEach(segment => {
      if (segment.y >= boardSize) {
        gameOver()
        return false
      }
      snakeElement.style.gridRowStart = ++segment.y
    })
  }
}

document.addEventListener('keyup', control)
startBtn.addEventListener('click', function () {
  draw(gameBoard)
})
