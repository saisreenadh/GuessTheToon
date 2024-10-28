// Game variables
let wins = 0;
let guessLetter = "";
let remainingGuesses = 5;
let randomCartoon = "";
let wrongLetter = [];
let isInWord = false;
let lettersInWord = 0;
let unknownAnswer = [];

// Cartoon list
const cartoons = ["FLINTSTONES", "JETSONS", "FROZEN", "GARFIELD", "BAMBI", "UNDERDOG", "POPEYE"];

// Image mapping
const cartoonImages = {
    "FLINTSTONES": "./assets/images/flintstones.jpg",
    "JETSONS": "./assets/images/jetsons.jpg",
    "FROZEN": "./assets/images/frozen.jpg",
    "GARFIELD": "./assets/images/garfield.jpg",
    "BAMBI": "./assets/images/bambi.jpg",
    "UNDERDOG": "./assets/images/underdog.jpg",
    "POPEYE": "./assets/images/popeye.jpg"
};

// Reset game state
function reset() {
    guessLetter = "";
    remainingGuesses = 5;
    randomCartoon = "";
    isInWord = false;
    lettersInWord = 0;
    wrongLetter = [];
    unknownAnswer = [];
    
    document.querySelector('#imageHere').innerHTML = `<img src="./assets/images/satcartoons.jpg">`;
    playGame();
}

// Start game
function playGame() {
    // Choose a random cartoon
    randomCartoon = cartoons[Math.floor(Math.random() * cartoons.length)];
    console.log(`Cartoon to guess: ${randomCartoon}`);

    // Initialize unknownAnswer with underscores for each letter in randomCartoon
    unknownAnswer = Array.from(randomCartoon, () => "_");
    displayWordState();
    displayGuessesLeft();
    
    document.onkeyup = handleKeyPress;
}

// Display unknown answer (dashes and correct guesses)
function displayWordState() {
    document.querySelector('#word-array').innerHTML = `<p>${unknownAnswer.join(' ')}</p>`;
}

// Display guesses left
function displayGuessesLeft() {
    document.querySelector('#remaining-guesses').innerHTML = `<p>Guesses Left: ${remainingGuesses}</p>`;
}

// Handle key press events
function handleKeyPress(event) {
    guessLetter = event.key.toUpperCase();
    if (!/^[A-Z]$/.test(guessLetter)) return; // ignore non-letter inputs

    isInWord = false;

    // Check if the guessed letter is in the cartoon word
    for (let i = 0; i < randomCartoon.length; i++) {
        if (randomCartoon[i] === guessLetter) {
            unknownAnswer[i] = guessLetter;
            isInWord = true;
            lettersInWord++;
        }
    }

    if (isInWord) {
        displayWordState();
        if (lettersInWord === randomCartoon.length) handleWin();
    } else {
        handleIncorrectGuess();
    }
}

// Handle win scenario
function handleWin() {
    wins++;
    document.querySelector('#win-counter').innerHTML = `<p>Wins: ${wins}</p>`;
    displayImage();
    document.getElementById("clearFields").disabled = false;
}

// Handle incorrect guess
function handleIncorrectGuess() {
    remainingGuesses--;
    wrongLetter.push(guessLetter);
    document.querySelector('#guessedLtrs').innerHTML = `<p>${wrongLetter.join(', ')}</p>`;
    displayGuessesLeft();
    
    if (remainingGuesses <= 0) {
        alert("YOU LOSE !!!");
        reset();
    }
}

// Display winning cartoon image
function displayImage() {
    const imgPath = cartoonImages[randomCartoon];
    document.querySelector('#imageHere').innerHTML = `<img src="${imgPath}" alt="${randomCartoon}">`;
}

// Start the game when the page loads
document.onkeyup = playGame;