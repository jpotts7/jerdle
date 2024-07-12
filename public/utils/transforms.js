import { delay } from './utils.js';

export function createWordFromRow(currentActiveRow) {
  let letterArray = [];

  currentActiveRow.forEach((cell) => {
    cell.dataset.filled && letterArray.push(cell.innerText);
  });

  return letterArray.join('');
}

export async function revealLetters(
  clues,
  keyboardLetters,
  currentActiveRow,
  challengeModeToggle,
) {
  for (let i = 0; i < currentActiveRow.length; i++) {
    const cell = currentActiveRow[i];
    await delay(400);
    cell.classList.add('reveal');
    cell.style.backgroundColor = clues[i].color;
    cell.classList.remove('active');
  }

  clues.forEach((clue) => {
    const targetedKeyboardLetter = [...keyboardLetters].find(
      (letter) => letter.innerText.toLowerCase() === clue.letter,
    );
    targetedKeyboardLetter.style.backgroundColor = !challengeModeToggle.checked
      ? clue.color
      : 'none';
  });
}
