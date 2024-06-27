// Build Jerdle Grid
const NUMBER_OF_CELLS = 36;
const body = document.querySelector('body');
const grid = document.querySelector('section');
const keyboard = document.querySelector('#keyboard');
const keyboardLetters = document.querySelectorAll('.keyboard-letter');
const challengeModeToggle = document.querySelector('#challenge-input');
let row = 1;
let currentActiveRow;

for (let i = 1; i <= NUMBER_OF_CELLS; i++) {
  const cell = document.createElement('div');

  if (i >= 1 && i <= 6) {
    cell.classList.add('cell', `cell-${i}`, 'row-1');
  } else if (i >= 7 && i <= 12) {
    cell.classList.add('cell', `cell-${i}`, 'row-2');
  } else if (i >= 13 && i <= 18) {
    cell.classList.add('cell', `cell-${i}`, 'row-3');
  } else if (i >= 19 && i <= 24) {
    cell.classList.add('cell', `cell-${i}`, 'row-4');
  } else if (i >= 25 && i <= 30) {
    cell.classList.add('cell', `cell-${i}`, 'row-5');
  } else {
    cell.classList.add('cell', `cell-${i}`, 'row-6');
  }

  grid.appendChild(cell);
}

// Set the first row as the active row on initial page load.
currentActiveRow = document.querySelectorAll(`.row-${row}`);
currentActiveRow.forEach((cell) => cell.classList.add('active'));
// activeRow = currentActiveRow;

// Determine whether or not to show the keyboard (challenge mode).
challengeModeToggle.addEventListener('change', () => {
  if (challengeModeToggle.checked) {
    keyboard.classList.add('hide');
  } else {
    keyboard.classList.remove('hide');
  }
});

// Write word in current row.
body.addEventListener('keydown', (e) => {
  const isLetter = /[a-z]/;
  let activeRow = document.querySelectorAll('.active');

  if (isLetter.test(e.key) && e.key.length === 1) {
    const cell = [...activeRow].find(
      (cell) => !cell.hasAttribute('data-filled'),
    );
    if (cell === undefined) return;

    cell.textContent = e.key;
    cell.setAttribute('data-filled', true);
  }

  if (e.key === 'Backspace' || e.key === 'Delete') {
    const cell = [...activeRow].findLast((cell) =>
      cell.hasAttribute('data-filled'),
    );
    if (cell === undefined) return;

    cell.textContent = '';
    cell.removeAttribute('data-filled');
  }

  const button = document.querySelector('button');
  const allFilled = [...activeRow].every((cell) =>
    cell.hasAttribute('data-filled'),
  );

  allFilled ? button.focus() : button.blur();
});

function postErrorMessage(message) {
  const staleErrorMessage = document.querySelector('.error');
  if (!!staleErrorMessage) {
    document.body.removeChild(staleErrorMessage);
  }

  const newErrorMessage = document.createElement('p');
  newErrorMessage.classList.add('error');
  newErrorMessage.textContent = message;
  document.body.appendChild(newErrorMessage);
}

async function checkWordValidity(word) {
  try {
    const response = await fetch('/check-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
    const wordStatus = await response.json();
    return wordStatus;
  } catch (err) {
    console.error(err);
    postErrorMessage(err.message);
  }
}

async function submitGuessedWord(word) {
  try {
    const response = await fetch('/submit-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
    const clues = await response.json();
    return clues;
  } catch (err) {
    console.log(err);
    postErrorMessage(err.message);
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function revealLetters(clues) {
  for (let i = 0; i < currentActiveRow.length; i++) {
    const cell = currentActiveRow[i];
    await delay(300);
    cell.style.backgroundColor = clues[i].color;
    cell.classList.remove('active');
  }

  clues.forEach((clue) => {
    const targetedKeyboardLetter = [...keyboardLetters].find(
      (letter) => letter.innerText.toLowerCase() === clue.letter,
    );
    targetedKeyboardLetter.style.backgroundColor = clue.color;
  });
}

function prepNextRow(clues) {
  if (clues.every((clue) => clue.color === 'var(--green)')) {
    // Use a postSuccessMessage function instead.
    postErrorMessage('You guessed it!');
    return;
  }

  row++;

  const nextActiveRow = document.querySelectorAll(`.row-${row}`);

  if (nextActiveRow.length === 0) {
    postErrorMessage('You lost! :(');
    return;
  }

  nextActiveRow.forEach((cell) => cell.classList.add('active'));

  currentActiveRow = nextActiveRow;

  const errorMessage = document.querySelector('.error');

  if (errorMessage) {
    document.body.removeChild(errorMessage);
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  let letterArray = [];

  currentActiveRow.forEach((cell) => {
    cell.dataset.filled && letterArray.push(cell.innerText);
  });

  if (letterArray.length !== 6) {
    postErrorMessage('Please enter a six-letter word.');
    return;
  }

  const word = letterArray.join('');

  const { status, message } = await checkWordValidity(word);

  if (status === 'error') {
    postErrorMessage(message);
    return;
  }

  const clues = await submitGuessedWord(word);
  await revealLetters(clues);
  await delay(300);
  prepNextRow(clues);
}

function handleKeyDown(e) {
  if (e.key === 'Enter') {
    button.classList.add('pressed');
    setTimeout(function () {
      button.classList.remove('pressed');
    }, 100);
    handleSubmit(e);
  }
}

// Submit Functionality
const button = document.querySelector('button');
button.addEventListener('click', handleSubmit);
button.addEventListener('keydown', handleKeyDown);
