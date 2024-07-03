export async function checkWordValidity(word) {
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

export async function submitGuessedWord(word) {
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