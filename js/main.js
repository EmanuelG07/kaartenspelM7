class Card {
    constructor(rank, suit) {
      this.rank = rank;
      this.suit = suit;
    }
  
    getColor() {
      return (this.suit === "♥" || this.suit === "♦") ? "red" : "black";
    }
  
    render() {
      const div = document.createElement("div");
      div.className = `card ${this.getColor()}`;
      div.innerHTML = `<div>${this.rank}</div><div>${this.suit}</div>`;
      return div;
    }
  }
  
  class Deck {
    constructor() {
      const suits = ["♥", "♠", "♦", "♣"];
      const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
      this.cards = [];
      for (let suit of suits) {
        for (let rank of ranks) {
          this.cards.push(new Card(rank, suit));
        }
      }
      this.shuffle();
    }
  
    shuffle() {
      this.cards.sort(() => Math.random() - 0.5);
    }
  
    draw() {
      return this.cards.pop();
    }
  }
  
  const deck = new Deck();
  const playerHand = [];
  const computerHand = [];
  let discardPile = [];
  let currentSuit = null;
  
  const playerHandDiv = document.getElementById("player-hand");
  const computerCount = document.getElementById("computer-count");
  const discardPileDiv = document.getElementById("discard-pile");
  const drawButton = document.getElementById("draw-card-btn");
  const message = document.getElementById("message");
  
  function startGame() {
    for (let i = 0; i < 7; i++) {
      playerHand.push(deck.draw());
      computerHand.push(deck.draw());
    }
  
    discardPile.push(deck.draw());
    currentSuit = discardPile[discardPile.length - 1].suit;
  
    updateUI();
  }
  
  function updateUI() {
    playerHandDiv.innerHTML = "🧍 Jij:";
    playerHand.forEach((card, index) => {
      const cardEl = card.render();
      cardEl.addEventListener("click", () => playCard(index));
      playerHandDiv.appendChild(cardEl);
    });
  
    computerCount.textContent = `${computerHand.length} kaarten`;
  
    const topCard = discardPile[discardPile.length - 1];
    discardPileDiv.innerHTML = "";
    discardPileDiv.appendChild(topCard.render());
  }
  
  function playCard(index) {
    const card = playerHand[index];
    const top = discardPile[discardPile.length - 1];
  
    if (card.suit === top.suit || card.rank === top.rank) {
      discardPile.push(card);
      currentSuit = card.suit;
      playerHand.splice(index, 1);
      message.textContent = "Goede zet!";
      updateUI();
      setTimeout(computerTurn, 1000);
    } else {
      message.textContent = "Deze kaart kun je niet spelen!";
    }
  }
  
  function drawCard() {
    const card = deck.draw();
    playerHand.push(card);
    message.textContent = "Je hebt een kaart gepakt.";
    updateUI();
    setTimeout(computerTurn, 1000);
  }
  
  function computerTurn() {
    const top = discardPile[discardPile.length - 1];
    const matchIndex = computerHand.findIndex(card => card.suit === top.suit || card.rank === top.rank);
  
    if (matchIndex >= 0) {
      const card = computerHand.splice(matchIndex, 1)[0];
      discardPile.push(card);
      currentSuit = card.suit;
      message.textContent = "Computer speelt een kaart.";
    } else {
      const newCard = deck.draw();
      computerHand.push(newCard);
      message.textContent = "Computer pakt een kaart.";
    }
  
    checkWin();
    updateUI();
  }
  
  function checkWin() {
    if (playerHand.length === 0) {
      alert("Je hebt gewonnen! 🎉");
    } else if (computerHand.length === 0) {
      alert("Computer wint 😢");
    }
  }
  
  drawButton.addEventListener("click", drawCard);
  
  startGame();
  