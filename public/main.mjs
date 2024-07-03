import { delay } from './utils/utils.js';
import { hitApiEndpoint } from './utils/apis.js';
import { postErrorMessage } from './utils/messages.js';
import { createWordFromRow, revealLetters } from './utils/transforms.js';

// Build Jerdle Grid
const NUMBER_OF_CELLS = 36;
const body = document.querySelector('body');
const main = document.querySelector('main');
const grid = document.querySelector('section');
const keyboard = document.querySelector('#keyboard');
const keyboardLetters = document.querySelectorAll('.keyboard-letter');
const challengeModeToggle = document.querySelector('#challenge-input');
let row = 1;
let currentActiveRow;

for (let i = 1; i <= NUMBER_OF_CELLS; i++) {
  const cell = document.createElement('div');
  let rowClass;

  if (i >= 1 && i <= 6) {
    rowClass = 'row-1';
  } else if (i >= 7 && i <= 12) {
    rowClass = 'row-2';
  } else if (i >= 13 && i <= 18) {
    rowClass = 'row-3';
  } else if (i >= 19 && i <= 24) {
    rowClass = 'row-4';
  } else if (i >= 25 && i <= 30) {
    rowClass = 'row-5';
  } else {
    rowClass = 'row-6';
  }

  cell.classList.add('cell', `cell-${i}`, rowClass);

  grid.appendChild(cell);
}

// Set the first row as the active row on initial page load.
currentActiveRow = document.querySelectorAll(`.row-${row}`);
currentActiveRow.forEach((cell) => cell.classList.add('active'));
// activeRow = currentActiveRow;

// Determine whether or not to show the keyboard (challenge mode).
function toggleKeyboard() {
  if (challengeModeToggle.checked) {
    keyboard.classList.add('hide');
  } else {
    keyboard.classList.remove('hide');
  }
}

challengeModeToggle.addEventListener('click', toggleKeyboard);

// Write word in current active row.
body.addEventListener('keydown', (e) => {
  const isLetter = /[a-z]/;
  let activeRow = document.querySelectorAll('.active');

  if (isLetter.test(e.key) && e.key.length === 1) {
    const cell = [...activeRow].find(
      (cell) => !cell.hasAttribute('data-filled'),
    );
    if (!cell) return;

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
    main.removeChild(errorMessage);
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const word = createWordFromRow(currentActiveRow);

  if (word.length !== 6) {
    postErrorMessage('Please enter a six-letter word.', main);
    return;
  }

  const { status, message } = await hitApiEndpoint(word, '/check-word');

  if (status === 'error') {
    postErrorMessage(message, main);
    return;
  }

  const clues = await hitApiEndpoint(word, '/submit-word');
  await revealLetters(clues, keyboardLetters, currentActiveRow);
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
