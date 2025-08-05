const Flashcard = require('../models/flashcardModel')
const mongoose = require('mongoose')

// get all flashcards
const getFlashcards = async (req, res) => {
    const user_id = req.user._id

    const flashcards = await Flashcard.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(flashcards)
}

// get a single flashcard
const getFlashcard = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const flashcard = await Flashcard.findById(id)

    if(!flashcard){
        return res.status(404).json({error: 'No such flashcard'})
    }

    res.status(200).json(flashcard)
}

// create new flashcard
const createFlashcard = async (req, res) => {
    const {term, definition} = req.body
    
    let emptyFields = []

    if(!term){
        emptyFields.push('term')
    }
    if(!definition){
        emptyFields.push('definition')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

    // add doc to db
    try{
        const user_id = req.user._id
        const flashcard = await Flashcard.create({term, definition, user_id})
        res.status(200).json(flashcard)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a flashcard
const deleteFlashcard = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such flashcard'})
    }

    const flashcard = await Flashcard.findOneAndDelete({_id: id})

    if(!flashcard){
        return res.status(400).json({error: 'No such flashcard'})
    }

    res.status(200).json(flashcard)
}

//update a flashcard
const updateFlashcard = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such flashcard'})
    }

    const flashcard = await Flashcard.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!flashcard){
        return res.status(400).json({error: 'No such flashcard'})
    }

    res.status(200).json(flashcard)
}

module.exports = {
    getFlashcards,
    getFlashcard,
    createFlashcard,
    deleteFlashcard,
    updateFlashcard
}