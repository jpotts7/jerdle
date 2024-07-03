import express from 'express';

const router = express.Router();

async function isValidWord(word) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );
  const { message: errorMessage } = await response.json();

  return errorMessage
    ? { status: 'error', message: 'Not an accepted word. Try again.' }
    : { status: 'success' };
}

router.post('/', (req, res) => {
  if (!req.body.word) {
    return res.status(500).send('No word was provided.');
  }

  isValidWord(req.body.word).then((status) => res.status(201).json(status));
});

export default router;
