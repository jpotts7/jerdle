import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const TODAYS_WORD = process.env.WORD_OF_THE_DAY;

router.post('/', (req, res) => {
  if (!req.body.word) {
    return res.status(500).send('No word was submitted.');
  }

  const answer = TODAYS_WORD.split('');
  const guessLetters = req.body.word.toLowerCase().split('');

  function containsLetter(guessedLetter) {
    return answer.find((letter) => letter === guessedLetter);
  }

  const guessLettersStatus = guessLetters.map((letter, i) => {
    if (guessLetters[i] === answer[i]) {
      return {
        color: '#88ac88',
        letter: guessLetters[i],
      };
    } else if (containsLetter(letter)) {
      return {
        color: '#f9cb9c',
        letter: guessLetters[i],
      };
    } else {
      return {
        color: '#b7ada0',
        letter: guessLetters[i],
      };
    }
  });

  res.status(201).json(guessLettersStatus);
});

export default router;
