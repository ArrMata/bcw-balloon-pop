
// #region GAME LOGIC AND DATA

let clickCount = 0
let highestPopCount = 0
let currentPopCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxSize = 300
let gameLength = 10000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}
let currentColor = "blue"
let possibleColors = ["pink", "red", "green", "blue"]

function startGame() {
    document.getElementById('menu-controls').classList.add('hidden')
    document.getElementById('scoreboard').classList.add('hidden')
    document.getElementById('game-controls').classList.remove('hidden')
    startClock()
    setTimeout(stopGame, gameLength)
}

function startClock() {
    timeRemaining = gameLength
    drawClock()
    clockId = setInterval(drawClock, 1000)
}

function stopClock() {
    clearInterval(clockId)
}

function drawClock() {
    let countdownElement = document.getElementById('countdown')
    countdownElement.innerText = timeRemaining / 1000
    timeRemaining -= 1000
}

function inflate() {
    clickCount++
    height += inflationRate
    width += inflationRate
    checkBallonPop()
    draw()
}

function checkBallonPop() {
    if(height >= maxSize) {
        let balloonElement = document.getElementById('balloon')
        balloonElement.classList.remove(currentColor)
        getRandomColor()
        balloonElement.classList.add(currentColor)
        height = 20
        width = 0
        currentPopCount++
        document.getElementById('pop-sound').play()
    }
}

function getRandomColor() {
    let i = Math.floor(Math.random() * possibleColors.length)
    currentColor = possibleColors[i]
}

function draw() {
    let balloonElement = document.getElementById("balloon")
    let clickElement = document.getElementById("click-count")
    let popCountElement = document.getElementById("pop-count")
    let highPopCountElement = document.getElementById("high-pop-count")
    let playerNameElement = document.getElementById("player-name")

    balloonElement.style.height = height + "px"
    balloonElement.style.width = width + "px"

    clickElement.innerText = clickCount
    popCountElement.innerText = currentPopCount
    highPopCountElement.innerText = currentPlayer.topScore
    playerNameElement.innerText = currentPlayer.name
}

function stopGame() {
    document.getElementById('menu-controls').classList.remove('hidden')
    document.getElementById('scoreboard').classList.remove('hidden')
    document.getElementById('game-controls').classList.add('hidden')

    clickCount = 0
    height = 120
    width = 100
    if (currentPopCount > currentPlayer.topScore) {
        currentPlayer.topScore = currentPopCount
        savePlayers()
    }
    currentPopCount = 0

    drawClock()
    stopClock()
    draw()
    drawScoreboard()
}

// #endregion

let players = []
loadPlayers()

function setPlayer (event) {
    event.preventDefault()
    let form = event.target
    let playerName = form.playerName.value
    currentPlayer = players.find(player => player.name === playerName)

    if (!currentPlayer) {
        currentPlayer = { name : playerName, topScore: 0 }
        players.push(currentPlayer)
        savePlayers(currentPlayer)
    }

    form.reset()
    document.getElementById('game').classList.remove('hidden')
    form.classList.add('hidden')
    draw()
    drawScoreboard()
}

function changePlayer() {
    document.getElementById('player-form').classList.remove('hidden')
    document.getElementById('game').classList.add('hidden')
}

function savePlayers() {
    window.localStorage.setItem('players', JSON.stringify(players))
}

function loadPlayers() {
    let playersData = JSON.parse(localStorage.getItem('players'))
    if (playersData) {
        players = playersData
    }
}

function drawScoreboard(){
    let template = ""
    
    players.sort((p1 , p2) => p2.topScore - p1.topScore)

    players.forEach(player => {
        template += `
        <div class="d-flex space-between"> 
            <span>
                <i class="fa-regular fa-user"></i>
                ${player.name}
            </span>
            <span>score: ${player.topScore}</span>
        </div> `
    })

    document.getElementById("players").innerHTML = template
}

drawScoreboard()