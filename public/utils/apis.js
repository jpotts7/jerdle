export async function hitApiEndpoint(word, endpoint) {
  try {
    const response = await fetch(endpoint, {
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
