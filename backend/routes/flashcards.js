const express = require('express')
const {
    getFlashcards,
    getFlashcard, 
    createFlashcard,
    deleteFlashcard,
    updateFlashcard 
} = require('../controllers/flashcardController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//require auth for all flashcard routes
router.use(requireAuth)

// GET all flashcards
router.get('/', getFlashcards)

// GET a single flashcard
router.get('/:id', getFlashcard)

// POST a new flashcard
router.post('/', createFlashcard)

// DELETE a new flashcard
router.delete('/:id', deleteFlashcard)

// UPDATE a new flashcard
router.patch('/:id', updateFlashcard)

module.exports = router