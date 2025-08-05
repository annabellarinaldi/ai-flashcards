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
    }
}, { timestamps: true })

module.exports = mongoose.model('Flashcard', flashcardSchema)