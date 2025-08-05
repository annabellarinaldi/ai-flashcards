// backend/utils/srsAlgorithm.js - SM-2 Algorithm Implementation
const Flashcard = require('../models/flashcardModel')

/**
 * Calculate next review based on SM-2 algorithm
 * @param {number} quality - User rating (0=Again, 1=Hard, 2=Good, 3=Easy)
 * @param {number} interval - Current interval in days
 * @param {number} easeFactor - Current ease factor
 * @param {number} repetitions - Number of successful repetitions
 * @returns {object} Updated SRS values
 */
const calculateNextReview = (quality, interval, easeFactor, repetitions) => {
    let newInterval = interval
    let newEaseFactor = easeFactor
    let newRepetitions = repetitions

    // Quality 0 (Again) - Reset progress
    if (quality === 0) {
        newRepetitions = 0
        newInterval = 1
        newEaseFactor = Math.max(1.3, easeFactor - 0.2)
    }
    // Quality 1 (Hard) - Repeat sooner
    else if (quality === 1) {
        newRepetitions = 0
        newInterval = Math.max(1, Math.ceil(interval * 1.2))
        newEaseFactor = Math.max(1.3, easeFactor - 0.15)
    }
    // Quality 2 (Good) - Standard progression
    else if (quality === 2) {
        newRepetitions = repetitions + 1
        
        if (newRepetitions === 1) {
            newInterval = 1
        } else if (newRepetitions === 2) {
            newInterval = 6
        } else {
            newInterval = Math.ceil(interval * easeFactor)
        }
    }
    // Quality 3 (Easy) - Longer interval
    else if (quality === 3) {
        newRepetitions = repetitions + 1
        
        if (newRepetitions === 1) {
            newInterval = 4
        } else if (newRepetitions === 2) {
            newInterval = 6
        } else {
            newInterval = Math.ceil(interval * easeFactor * 1.3)
        }
        
        newEaseFactor = Math.min(2.5, easeFactor + 0.15)
    }

    // Calculate due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + newInterval)

    return {
        interval: newInterval,
        easeFactor: newEaseFactor,
        repetitions: newRepetitions,
        dueDate: dueDate,
        lastReviewed: new Date()
    }
}

/**
 * Update flashcard with new SRS values
 * @param {string} flashcardId - MongoDB ObjectId
 * @param {number} quality - User rating (0-3)
 * @returns {object} Updated flashcard
 */
const updateFlashcard = async (flashcardId, quality) => {
    try {
        const flashcard = await Flashcard.findById(flashcardId)
        if (!flashcard) {
            throw new Error('Flashcard not found')
        }

        const updates = calculateNextReview(
            quality,
            flashcard.interval,
            flashcard.easeFactor,
            flashcard.repetitions
        )

        const updatedFlashcard = await Flashcard.findByIdAndUpdate(
            flashcardId,
            updates,
            { new: true }
        )

        return updatedFlashcard
    } catch (error) {
        throw error
    }
}

/**
 * Get flashcards due for review
 * @param {string} userId - User ID
 * @returns {array} Flashcards due today or overdue
 */
const getDueFlashcards = async (userId) => {
    try {
        const today = new Date()
        today.setHours(23, 59, 59, 999) // End of today
        
        const dueFlashcards = await Flashcard.find({
            user_id: userId,
            dueDate: { $lte: today }
        }).sort({ dueDate: 1 }) // Oldest due first

        return dueFlashcards
    } catch (error) {
        throw error
    }
}

/**
 * Get count of due flashcards
 * @param {string} userId - User ID
 * @returns {number} Count of due flashcards
 */
const getDueCount = async (userId) => {
    try {
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        
        const count = await Flashcard.countDocuments({
            user_id: userId,
            dueDate: { $lte: today }
        })

        return count
    } catch (error) {
        throw error
    }
}

module.exports = {
    calculateNextReview,
    updateFlashcard,
    getDueFlashcards,
    getDueCount
}