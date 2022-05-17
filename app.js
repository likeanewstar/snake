const startBtn = document.querySelector('.start')
const gameBoard = document.getElementById('game-board')
const boardSize = 17

const gameOverLayer = document.querySelector('.gameover-layer')

const scoreBox = document.querySelector('.score')
let score = 00,
  maxScore = window.localStorage.getItem('maxScore') || undefined

let snakeElement = document.createElement('div')
let appleElement = document.createElement('div')

let snakeBody = [{ x: 1, y: 1 }]
let applePos = { x: 0, y: 0 }

let timer
let snakeSpeed = 200
let direction = 'right' // 시작 시 진행 방향

const yummySound = document.querySelector('.sounds.yum')
const gameoverSound = document.querySelector('.sounds.gameover')

let isGameOver = true

// set board size
setBoard(boardSize)
function setBoard(boardSize) {
  boardSize = `repeat(${boardSize},1fr)`
  gameBoard.style.gridTemplateRows = boardSize
  gameBoard.style.gridTemplateColumns = boardSize
}

// start(restart) game
function draw(gameBoard) {
  if (isGameOver == true) {
    gameOverLayer.classList.add('hide')

    scoreBox.innerText = '00'
    score = '00'
    addNewApple()

    snakeBody = [{ x: 1, y: 1 }]
    snakeBody.forEach(segment => {
      snakeElement.style.gridRowStart = segment.y
      snakeElement.style.gridColumnStart = segment.x
      snakeElement.classList.add('snake')
      gameBoard.appendChild(snakeElement)
    })
    timer = setInterval(interval, snakeSpeed)
    isGameOver = false
  }
}

// ramdom apple position
function addNewApple() {
  let apple = document.querySelector('.apple')
  let appleIndex, appleIndexX, appleIndexY

  if (apple) apple.remove()

  do {
    appleIndexX = Math.floor(Math.random() * boardSize) + 1
    appleIndexY = Math.floor(Math.random() * boardSize) + 1
    applePos = { x: appleIndexX, y: appleIndexY }
  } while (
    snakeBody.some(snake => snake.x == appleIndexX && snake.y == appleIndexY)
  )

  appleElement.style.gridRowStart = applePos.y
  appleElement.style.gridColumnStart = applePos.x
  appleElement.classList.add('apple')
  gameBoard.appendChild(appleElement)
}

// increase score
function incrementScore() {
  score++
  scoreBox.innerText = score.toString().padStart(2, '0')
}

// game over
function gameOver() {
  isGameOver = true
  snakeSpeed = 200
  gameoverSound.currentTime = 0 // media의 play 위치 reset
  gameoverSound.play()
  gameOverLayer.classList.remove('hide')
  clearInterval(timer)
  let snakes = document.querySelectorAll('.snake')
  let apple = document.querySelector('.apple')
  snakes.forEach(snake => snake.parentNode.removeChild(snake))
  apple.remove()
  direction = 'right'
}

// main snake function
function interval() {
  // 하단 forEach 함수에서 snake를 다시 그려주기 위해 기존 snake 블럭 삭제
  let snakes = document.querySelectorAll('.snake')
  if (snakes) {
    snakes.forEach(snake => snake.parentNode.removeChild(snake))
  }

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

  // 벽에 부딪힐 경우 game over
  if (
    nextPos.x > boardSize ||
    nextPos.y < 1 ||
    nextPos.x < 1 ||
    nextPos.y > boardSize
  ) {
    gameOver()
    return false
  }

  snakeBody.unshift(nextPos) // next position에 새로운 블럭 추가
  let tail = snakeBody.pop() // 이동한 만큼 꼬리 블럭 삭제 (사과를 먹을 경우 다시 추가하기 위해 변수에 할당)

  // 🍎 먹을 경우
  if (nextPos.x == applePos.x && nextPos.y == applePos.y) {
    incrementScore()
    snakeSpeed = snakeSpeed * 0.95
    clearInterval(timer)
    timer = setInterval(interval, snakeSpeed)
    yummySound.currentTime = 0 // media의 play 위치 reset
    yummySound.play()
    snakeBody.push(tail) // pop으로 삭제했던 꼬리 블럭 다시 추가
    addNewApple()
  }

  // snakeBody에 담긴 배열대로 전체 snake 블럭 다시 그리기
  snakeBody.forEach(segment => {
    snakeElement = document.createElement('div')
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
  })
} // end of main snake function

// control direction
function control(e) {
  if (e.keyCode === 39) {
    // right
    if (direction !== 'left') direction = 'right'
  } else if (e.keyCode === 38) {
    // top
    if (direction !== 'bottom') direction = 'top'
  } else if (e.keyCode === 37) {
    // left
    if (direction !== 'right') direction = 'left'
  } else if (e.keyCode === 40) {
    // bottom
    if (direction !== 'top') direction = 'bottom'
  }
}

document.addEventListener('keydown', control)
startBtn.addEventListener('click', function () {
  draw(gameBoard)
})
