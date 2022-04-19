const gameBoard = document.getElementById('game-board')
const startBtn = document.querySelector('.start')
const snakeBody = [{ x: 1, y: 1 }]
const snakeElement = document.createElement('div')

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
      snakeElement.style.gridColumnStart = segment.x++ + 1
    })
  } else if (e.keyCode === 38) {
    // top
    snakeBody.forEach(segment => {
      snakeElement.style.gridRowStart = segment.y-- - 1
    })
  } else if (e.keyCode === 37) {
    // left
    snakeBody.forEach(segment => {
      snakeElement.style.gridColumnStart = segment.x-- - 1
    })
  } else if (e.keyCode === 40) {
    // bottom
    snakeBody.forEach(segment => {
      snakeElement.style.gridRowStart = segment.y++ + 1
    })
  }
}

document.addEventListener('keyup', control)
startBtn.addEventListener('click', function () {
  draw(gameBoard)
})
