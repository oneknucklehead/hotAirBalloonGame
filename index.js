const start = document.querySelector('.start')
const startBtn = document.querySelector('.startBtn')
const gameArea = document.querySelector('.gameArea')
const score = document.querySelector('.score')
const buttons = document.querySelector('.buttons')
let coinSound = new Audio('Mario-coin-sound.mp3')
let backgroundSound = new Audio('Art-Of-Silence_V2.mp3')
let req
let requestAnimationFrame = window.requestAnimationFrame
let cancelAnimationFrame = window.cancelAnimationFrame

let sound = document.querySelector('.sound')
let soundOn = false
sound.addEventListener('click', function () {
  soundOn = !soundOn
  if (soundOn) {
    backgroundSound.play()
    sound.innerText = 'Sound: ✔️'
  } else {
    backgroundSound.pause()
    sound.innerText = 'Sound: ❌'
  }
})

let pause = document.querySelector('.pause')
let isPause = false
pause.addEventListener('click', function () {
  isPause = !isPause
  if (isPause) {
    cancelAnimationFrame(req)
    pause.innerText = 'Play'
  } else {
    req = requestAnimationFrame(gamePlay)
    pause.innerText = 'Pause'
  }
})

startBtn.addEventListener('click', gameStarts)

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
}

let player = { speed: 5, score: 1, coins: 0 }
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

//function when arrow keys are pressed
function keyDown(e) {
  e.preventDefault()
  keys[e.key] = true
}

//function when arrow keys are released
function keyUp(e) {
  e.preventDefault()
  keys[e.key] = false
}

//function to start the game
function gameStarts() {
  player.start = true
  start.classList.add('hide')
  gameArea.classList.remove('hide')
  score.classList.remove('hide')
  buttons.classList.remove('hide')
  pause.classList.remove('hide')
  sound.classList.remove('hide')
  gameArea.innerHTML = ''
  player.coins = 0
  req = requestAnimationFrame(gamePlay)

  let balloon = document.createElement('div')
  balloon.setAttribute('class', 'balloon')
  gameArea.appendChild(balloon)
  player.x = balloon.offsetLeft
  player.y = balloon.offsetTop

  for (i = 0; i < 3; i++) {
    let trap = document.createElement('div')
    trap.setAttribute('class', 'trap')
    trap.y = (i + 1) * 300 * -1
    trap.style.top = trap.y + 'px'
    trap.style.width = Math.floor(Math.random() * 40 + 60) + 'px'
    trap.style.left = Math.floor(Math.random() * 450) + 'px'
    gameArea.appendChild(trap)
  }

  for (i = 0; i < 15; i++) {
    let coin = document.createElement('div')
    coin.setAttribute('class', 'coin')
    coin.y = (i + 1) * 270 * -1
    coin.style.top = coin.y + 'px'
    coin.style.left = Math.floor(Math.random() * 450) + 'px'
    gameArea.appendChild(coin)
  }
}
//function when coin and trap at same position
function isCollideCoinAndTrap() {
  let coins = document.querySelectorAll('.coin')
  let traps = document.querySelectorAll('.trap')
  coins.forEach(function (coin) {
    let coinBorders = coin.getBoundingClientRect()
    traps.forEach(function (trap) {
      let trapBorders = trap.getBoundingClientRect()
      let didCollide = !(
        trapBorders.bottom < coinBorders.top ||
        trapBorders.top > coinBorders.bottom ||
        trapBorders.right < coinBorders.left ||
        trapBorders.left > coinBorders.right
      )
      if (didCollide) coin.y -= 50
    })
  })
}
//function when balloon and trap collides
function isCollideTrap(balloon, trap) {
  balloonCorners = balloon.getBoundingClientRect()
  trapCorners = trap.getBoundingClientRect()
  let didCollide = !(
    balloonCorners.bottom < trapCorners.top ||
    balloonCorners.top > trapCorners.bottom ||
    balloonCorners.right < trapCorners.left ||
    balloonCorners.left > trapCorners.right
  )
  return didCollide
}
//function when coins collide
function isCollideCoins(balloon, coin) {
  balloonCorners = balloon.getBoundingClientRect()
  coinCorners = coin.getBoundingClientRect()
  let didCollide = !(
    balloonCorners.bottom < coinCorners.top ||
    balloonCorners.top > coinCorners.bottom ||
    balloonCorners.right < coinCorners.left ||
    balloonCorners.left > coinCorners.right
  )
  return didCollide
}

//function to stop the game
function gameStop() {
  player.start = false
  start.classList.remove('hide')
  gameArea.classList.add('hide')
  score.classList.add('hide')
  pause.classList.add('hide')
  sound.classList.add('hide')
  startBtn.innerHTML =
    '<h1>GAME OVER</h1><br><p>Score: </p>' +
    player.coins +
    '<br><p>Click here to replay</p>'
}

//function for coin collected
function coinCollected() {
  player.coins += 10
  if (soundOn) coinSound.play()
  else coinSound.pause()
}

//function to make traps move
function moveTraps(balloon) {
  let traps = document.querySelectorAll('.trap')

  traps.forEach(function (trap) {
    if (isCollideTrap(balloon, trap)) {
      gameStop()
    }
    if (trap.y >= 900) {
      trap.y -= 950
      trap.style.width = Math.floor(Math.random() * 40 + 60) + 'px'
      trap.style.left = Math.floor(Math.random() * 450) + 'px'
    }
    trap.y += player.speed
    setInterval(function () {
      trap.y += 1
    }, 180000)
    trap.style.top = trap.y + 'px'
  })
}

//function to move coins
function moveCoins(balloon) {
  let coins = document.querySelectorAll('.coin')
  coins.forEach(function (coin) {
    if (isCollideCoins(balloon, coin)) {
      coinCollected()

      coin.classList.add('hide')
    }
    if (coin.y >= 900) {
      coin.y = -950
      coin.classList.remove('hide')
      coin.style.left = Math.floor(Math.random() * 450) + 'px'
    }

    coin.y += player.speed
    setInterval(function () {
      coin.y += 1
    }, 180000)
    coin.style.top = coin.y + 'px'
  })
}

//function to play the game
function gamePlay() {
  if (player.start) {
    let balloon = document.querySelector('.balloon')
    balloon.style.backgroundImage = "url('balloon.png')"

    let movableArea = gameArea.getBoundingClientRect()

    moveTraps(balloon)
    moveCoins(balloon)
    isCollideCoinAndTrap()

    if (keys.ArrowUp && player.y > movableArea.top + 10) {
      player.y -= player.speed
    }
    if (keys.ArrowDown && player.y < movableArea.bottom - 180) {
      player.y += player.speed
    }
    if (keys.ArrowLeft && player.x > 0 && player.x != -1) {
      player.x -= player.speed
      balloon.style.backgroundImage = "url('balloon_left.png')"
    }
    if (keys.ArrowRight && player.x < movableArea.width - 35) {
      player.x += player.speed
      balloon.style.backgroundImage = "url('balloon_right.png')"
    }

    balloon.style.top = player.y + 'px'
    balloon.style.left = player.x + 'px'
    req = requestAnimationFrame(gamePlay)
    score.innerText = 'Coins:' + player.coins
  }
}
