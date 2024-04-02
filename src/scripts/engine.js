const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points")
  },
  cardsSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type")
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards")
  },
  actions: {
    button: document.getElementById("next-duel")
  }
}

const pathImagens = "/src/assets/icons/"

const cardData = [
  {
    id: 0,
    name: "Dragão Bianco de orros assuis",
    type: "Papel",
    img: `${pathImagens}dragon.png`,
    WinOf: [1],
    LoseOf: [2]
  },
  {
    id: 1,
    name: "Mago Negro",
    type: "Pedra",
    img: `${pathImagens}magician.png`,
    WinOf: [2],
    LoseOf: [0]
  },
  {
    id: 2,
    name: "Exodia",
    type: "Tesoura",
    img: `${pathImagens}exodia.png`,
    WinOf: [0],
    LoseOf: [1]
  }
]

async function getRandomCardId() {
  const randleIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randleIndex].id
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img")
  cardImage.setAttribute("height", "100px")
  cardImage.setAttribute("src", "/src/assets/icons/card-back.png")
  cardImage.setAttribute("data-id", idCard)
  cardImage.classList.add("card")

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard)
    })

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"))
    })
  }
  return cardImage
}

async function showHiddenCardFieldsImages(value) {

  if (value) {
    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"
  } else {
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
  }
}

async function drawCardsInfilesd(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img
  state.fieldCards.computer.src = cardData[computerCardId].img
}

async function hiddenCardsDetails() {
  state.cardsSprites.avatar.src = ""
  state.cardsSprites.name.innerText = ""
  state.cardsSprites.type.innerText = ""
}

async function setCardsField(cardId) {
  await removeAllCardsImages()

  let computerCardId = await getRandomCardId()

  await showHiddenCardFieldsImages(true)
  await hiddenCardsDetails()
  await drawCardsInfilesd(cardId, computerCardId)

  let duelResults = await checkDuelResults(cardId, computerCardId)

  await updateScore()
  await drawButton(duelResults)
}

async function updateScore() {
  state.score.scoreBox.innerText = `Vitórias: ${state.score.playerScore} - Derrotas: ${state.score.computerScore}`
}

async function drawButton(text) {
  state.actions.button.innerText = text
  state.actions.button.style.display = "block"
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Empate"
  let playerCard = cardData[playerCardId]

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "Ganhou"
    await playAudio("win")
    state.score.playerScore++
  }

  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "Perdeu"
    await playAudio("lose")
    state.score.computerScore++
  }

  return duelResults
}

async function removeAllCardsImages() {
  let { computerBox, player1Box } = state.playerSides
  let imgElements = computerBox.querySelectorAll("img")
  imgElements.forEach((img) => img.remove())

  imgElements = player1Box.querySelectorAll("img")
  imgElements.forEach((img) => img.remove())

}

async function drawSelectCard(index) {
  state.cardsSprites.avatar.src = cardData[index].img
  state.cardsSprites.name.innerText = cardData[index].name
  state.cardsSprites.type.innerText = "Atributo: " + cardData[index].type
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId()
    const cardImage = await createCardImage(randomIdCard, fieldSide)

    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel() {
  state.cardsSprites.avatar.src = ""
  state.actions.button.style.display = "none"

  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"

  init()
}

async function playAudio(status) {
  const audio = new Audio(`/src/assets/audios/${status}.wav`)
  audio.play()
}

function init() {

  showHiddenCardFieldsImages(false)

  drawCards(5, state.playerSides.player1)
  drawCards(5, state.playerSides.computer)

  const bgm = document.getElementById("bgm")
  bgm.play()
  bgm.volume = 0.2
}

init()
