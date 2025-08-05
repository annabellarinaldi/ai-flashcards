const mongoose = require('mongoose')

const Schema = mongoose.Schema

const flashcardSchema = new Schema({
    term: {
        type: String,
        required: true
    },
    definition: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    // SRS (Spaced Repetition System) fields
    interval: {
        type: Number,
        default: 1 // Days until next review
    },
    easeFactor: {
        type: Number,
        default: 2.5 // SM-2 algorithm ease factor
    },
    repetitions: {
        type: Number,
        default: 0 // Number of successful reviews
    },
    dueDate: {
        type: Date,
        default: Date.now // Next review date
    },
    lastReviewed: {
        type: Date,
        default: null // Track when last reviewed
    }
}, { timestamps: true })

module.exports = mongoose.model('Flashcard', flashcardSchema)