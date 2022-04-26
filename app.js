const gameBoard = document.getElementById('game-board')
const boardSize = 20
const startBtn = document.querySelector('.start')
const snakeBody = [{ x: 1, y: 1 }]
const snakeElement = document.createElement('div')

setBoard(boardSize)

function setBoard(boardSize) {
  boardSize = `repeat(${boardSize},1fr)`
  gameBoard.style.gridTemplateRows = boardSize
  gameBoard.style.gridTemplateColumns = boardSize
}

function draw(gameBoard) {
  snakeBody.forEach(segment => {
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
  })
}

//assign functions to keycodes
function control(e) {
  if (e.keyCode === 39) {
    // right
    snakeBody.forEach(segment => {
      console.log(`${segment.x} / ${segment.y}`)
      snakeElement.style.gridColumnStart = ++segment.x
    })
  } else if (e.keyCode === 38) {
    // top
    snakeBody.forEach(segment => {
      console.log(`${segment.x} / ${segment.y}`)
      snakeElement.style.gridRowStart = --segment.y
    })
  } else if (e.keyCode === 37) {
    // left
    snakeBody.forEach(segment => {
      console.log(`${segment.x} / ${segment.y}`)
      snakeElement.style.gridColumnStart = --segment.x
    })
  } else if (e.keyCode === 40) {
    // bottom
    snakeBody.forEach(segment => {
      console.log(`${segment.x} / ${segment.y}`)
      snakeElement.style.gridRowStart = ++segment.y
    })
  }
}

document.addEventListener('keyup', control)
startBtn.addEventListener('click', function () {
  draw(gameBoard)
})
