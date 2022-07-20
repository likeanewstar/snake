//======================================================================
// @brief Vanilla JS Snake Game
// @author newstar
// @date 2022-06-17
// @version 1.1
//======================================================================

window.addEventListener('DOMContentLoaded', () => {
  //======================================================================
  // 실행문
  //======================================================================
  App.SnakeGame.init({
    startBtnEl: '.start',
    gameBoardEl: '#game-board',
    gameOverLayer: '.gameover-layer',
    boardSize: 17,
    scoreBoxEl: '#score',
    maxScoreBoxEl: '#maxScore',
    snakeSpeed: 200,
    startDirection: 'right', // 시작 시 진행 방향 // 'right' or 'bottom'
    yummySoundEl: '.sounds.yum',
    gameOverSoundEl: '.sounds.gameover',
  })
});

var App = App || {}

//======================================================================
// @brief SnakeGame 함수
//======================================================================
App.SnakeGame = (function () {
  let self

  let snakeElement = document.createElement('div')
  let appleElement = document.createElement('div')

  let snakeBody = [{ x: 1, y: 1 }]
  let applePos = { x: 0, y: 0 }

  let score = 00,
      maxScore = window.localStorage.getItem('maxScore') || undefined

  let timer

  let isGameOver = true

  //======================================================================
  // @brief 변수 할당 함수.
  // @param 사용자가 지정할 el, option 값 등을 인자로 받음
  // @details 객체 내부 함수에서 변수 값에 접근할 수 있도록 하기 위하여 사용
  //======================================================================
  const initVar = (opt) => {
    startBtn = document.querySelector(opt.startBtnEl)
    gameBoard = document.querySelector(opt.gameBoardEl)
    boardSize = opt.boardSize

    gameOverLayer = document.querySelector(opt.gameOverLayer)

    scoreBox = document.querySelector(opt.scoreBoxEl)
    maxScoreBox = document.querySelector(opt.maxScoreBoxEl)

    snakeSpeed = opt.snakeSpeed
    direction = opt.startDirection;

    yummySound = document.querySelector(opt.yummySoundEl)
    gameoverSound = document.querySelector(opt.gameOverSoundEl)
  }

  return {
    //======================================================================
    // @brief 스네이크 게임 초기 함수. 게임보드 세팅, 점수 세팅, 버튼 이벤트 부여 등이 포함되어 있음.
    //======================================================================
    init: function (opt) {
      self = this

      initVar(opt)

      self.setBoardSize(boardSize)
      self.controlDirection()
      self.setMaxScore()

      startBtn.addEventListener('click', function () {
        self.drawStage(gameBoard)
      })
    },

    //======================================================================
    // @brief 보드 사이즈 지정 함수
    // @param 상단에 선언한 변수 boardSize에 담긴 값으로 보드 사이즈를 세팅한다.
    //======================================================================
    setBoardSize: function (boardSize) {
      boardSize = `repeat(${boardSize},1fr)`
      gameBoard.style.gridTemplateRows = boardSize
      gameBoard.style.gridTemplateColumns = boardSize
    },

    //======================================================================
    // @brief 게임 시작 함수. 게임 진행으로 변경된 값 초기화 진행.
    // @param gameBoard 엘리먼트를 파라미터로 받아 snakeElement를 동적으로 추가한다.
    //======================================================================
    drawStage: function (gameBoard) {
      if (isGameOver == true) {
        gameOverLayer.classList.add('hide')

        scoreBox.innerText = '00'
        score = '00'
        self.initApple()

        snakeBody = [{ x: 1, y: 1 }]
        snakeBody.forEach(segment => {
          snakeElement.style.gridRowStart = segment.y
          snakeElement.style.gridColumnStart = segment.x
          snakeElement.classList.add('snake')
          gameBoard.appendChild(snakeElement)
        })
        timer = setInterval(self.onSnake, snakeSpeed)
        isGameOver = false
      }
    },

    //======================================================================
    // @brief 스네이크 메인 동작 함수
    //======================================================================
    onSnake: function () {
      // 기존 snake 블럭 삭제 (하단 forEach 함수에서 전체 snakeBody를 다시 그려줌)
      let snakes = document.querySelectorAll('.snake')
      if (snakes) {
        snakes.forEach(snake => snake.parentNode.removeChild(snake))
      }

      // 방향 값에 따른 포지션 변경
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
        self.gameOver()
        return false
      }

      // 몸통에 부딪힐 경우 game over
      if (
        snakeBody.some(segment => {
          if (self.equalPositions(segment, nextPos)) {
            return true
          }
        })
      ) {
        self.gameOver()
        return false
      }

      snakeBody.unshift(nextPos) // next position에 새로운 블럭 추가
      let tail = snakeBody.pop() // 이동한 만큼 꼬리 블럭 삭제 (사과를 먹을 경우 다시 추가하기 위해 변수에 할당)

      // 뱀이 사과를 먹었을 경우
      if (nextPos.x == applePos.x && nextPos.y == applePos.y) {
        self.incrementScore()
        snakeSpeed = snakeSpeed * 0.95
        clearInterval(timer)
        timer = setInterval(self.onSnake, snakeSpeed)
        yummySound.currentTime = 0 // media의 play 위치 reset
        yummySound.play()
        snakeBody.push(tail) // pop으로 삭제했던 꼬리 블럭 다시 추가
        self.initApple()
      }

      // snakeBody에 담긴 배열대로 전체 snake 블럭 다시 그리기
      snakeBody.forEach(segment => {
        snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement)
      })
    },

    //======================================================================
    // @brief 좌표 체크 함수
    // @return 인자로 받은 두 개의 좌표가 완전히 일치할 경우, true를 반환한다.
    // @param 비교할 좌표 두 개를 객체 형태로 받는다.
    //======================================================================
    equalPositions: function (pos1, pos2) {
      return pos1.x === pos2.x && pos1.y === pos2.y
    },

    //======================================================================
    // @brief 점수 증가 함수
    //======================================================================
    incrementScore: function () {
      score++
      scoreBox.innerText = score.toString().padStart(2, '0')
    },

    //======================================================================
    // @brief 맥스 스코어 초기 세팅 함수.
    //======================================================================
    setMaxScore: function () {
      if (maxScore != null)
        maxScoreBox.innerText = maxScore.toString().padStart(2, '0')
    },

    //======================================================================
    // @brief 게임 오버 함수. 게임 오버 시 초기화 되어야 하는 부분을 관리. 게임 오버 레이어 노출
    //======================================================================
    gameOver: function () {
      isGameOver = true
      snakeSpeed = 200

      maxScore ? null : (maxScore = score)
      score > maxScore ? (maxScore = score) : null
      window.localStorage.setItem('maxScore', maxScore)
      maxScoreBox.innerText = maxScore.toString().padStart(2, '0')

      gameoverSound.currentTime = 0 // media의 play 위치 reset
      gameoverSound.play()
      gameOverLayer.classList.remove('hide')

      clearInterval(timer)

      let snakes = document.querySelectorAll('.snake')
      let apple = document.querySelector('.apple')
      snakes.forEach(snake => snake.parentNode.removeChild(snake))
      apple.remove()

      direction = 'right'
    },

    //======================================================================
    // @brief 사과 위치 세팅 함수. 뱀 & 기존 사과의 좌표와 겹치지 않도록 세팅
    //======================================================================
    initApple: function () {
      let apple = document.querySelector('.apple')
      let appleIndex, appleIndexX, appleIndexY

      if (apple) apple.remove()

      do {
        appleIndexX = Math.floor(Math.random() * boardSize) + 1
        appleIndexY = Math.floor(Math.random() * boardSize) + 1
        applePos = { x: appleIndexX, y: appleIndexY }
      } while (
        snakeBody.some(
          snake => snake.x == appleIndexX && snake.y == appleIndexY
        )
      )

      appleElement.style.gridRowStart = applePos.y
      appleElement.style.gridColumnStart = applePos.x
      appleElement.classList.add('apple')
      gameBoard.appendChild(appleElement)
    },

    //======================================================================
    // @brief 방향 컨트롤 관련 함수. PC에서는 방향키를 누를 경우, 모바일에서는 화면을 스와이프 할 경우 방향 변수를 변경하도록 한다.
    //======================================================================
    controlDirection: function () {
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

      // mobile control direction
      let startX = 0
      let startY = 0
      let delX = 0
      let delY = 0
      let isDrag = false

      function handleMobileTouchStart(e) {
        isDrag = true
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      }
      function handleMobileTouchMove(e) {
        if (isDrag === false) return false
        delX = e.touches[0].clientX - startX
        delY = e.touches[0].clientY - startY
      }
      function handleMobileTouchEnd() {
        if (delX < -50 && direction !== 'right') {
          direction = 'left'
        } else if (delX > 50 && direction !== 'left') {
          direction = 'right'
        } else if (delY < -50 && direction !== 'bottom') {
          direction = 'top'
        } else if (delY > 50 && direction !== 'top') {
          direction = 'bottom'
        }
        isDrag = false
      }

      document.addEventListener('keydown', control)
      gameBoard.addEventListener('touchstart', handleMobileTouchStart)
      gameBoard.addEventListener('touchmove', handleMobileTouchMove)
      gameBoard.addEventListener('touchend', handleMobileTouchEnd)
    },
  }
})();