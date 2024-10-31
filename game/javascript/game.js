console.log("game.js loaded"); // Check if script loads

// Game variables
let wins = 0;
let guessLetter = "";
let remainingGuesses = 5;
let randomCartoon = "";
let wrongLetter = [];
let isInWord = false;
let lettersInWord = 0;
let unknownAnswer = [];

// Fetch AI-generated cartoon data from backend
async function getCartoonData() {
    try {
        const response = await fetch('http://localhost:3000/get-cartoon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Failed to fetch cartoon data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching cartoon data:", error);
        alert("Unable to retrieve cartoon data.");
    }
}

// Start game
async function playGame() {
    const cartoon = await getCartoonData();
    if (!cartoon || !cartoon.title) {
        alert("Failed to retrieve cartoon data. Please try again later.");
        return;
    }

    randomCartoon = cartoon.title.toUpperCase();
    console.log(`Cartoon to guess: ${randomCartoon}`);
    unknownAnswer = Array.from(randomCartoon, () => "_");
    displayWordState();
    displayGuessesLeft();
    document.querySelector('#hint').innerHTML = `<p>Hint: ${cartoon.hint}</p>`;
    document.addEventListener("keyup", handleKeyPress); // Ensure listener attaches
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
    if (!/^[A-Z]$/.test(guessLetter)) return; // Ignore non-letter inputs

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

// Reset game state
function reset() {
    guessLetter = "";
    remainingGuesses = 5;
    randomCartoon = "";
    isInWord = false;
    lettersInWord = 0;
    wrongLetter = [];
    unknownAnswer = [];
    playGame();
}

window.onload = playGame;