import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'

const ReviewCard = ({ flashcard, onReviewComplete, onError }) => {
    const { user } = useAuthContext()
    const [showAnswer, setShowAnswer] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleShowAnswer = () => {
        setShowAnswer(true)
    }

    const handleQualityRating = async (quality) => {
        console.log('🎯 Quality button clicked:', quality)
        if (!user || isSubmitting) return

        try {
            setIsSubmitting(true)
            
            const response = await fetch(`/api/flashcards/review/${flashcard._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ quality })
            })

            const json = await response.json()

            if (response.ok) {
                // Pass the result back to parent component
                onReviewComplete(json)
            } else {
                onError(json.error || 'Failed to submit review')
            }
        } catch (error) {
            onError('Network error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const qualityButtons = [
        { 
            quality: 0, 
            label: 'Again', 
            description: 'Completely forgot',
            className: 'again-btn'
        },
        { 
            quality: 1, 
            label: 'Hard', 
            description: 'Remembered with difficulty',
            className: 'hard-btn'
        },
        { 
            quality: 2, 
            label: 'Good', 
            description: 'Remembered correctly',
            className: 'good-btn'
        },
        { 
            quality: 3, 
            label: 'Easy', 
            description: 'Remembered easily',
            className: 'easy-btn'
        }
    ]

    return (
        <div className="review-card">
            <div className="card-content">
                {!showAnswer ? (
                    // Show question side
                    <div className="question-side">
                        <div className="card-header">
                            <span className="card-label">Term:</span>
                        </div>
                        <div className="card-term">
                            {flashcard.term}
                        </div>
                        <div className="card-actions">
                            <button 
                                className="show-answer-btn"
                                onClick={handleShowAnswer}
                            >
                                Show Definition
                            </button>
                        </div>
                        <div className="instruction">
                            Think of the definition, then click to reveal the answer
                        </div>
                    </div>
                ) : (
                    // Show answer side with rating buttons
                    <div className="answer-side">
                        <div className="card-question">
                            <div className="card-header">
                                <span className="card-label">Term:</span>
                            </div>
                            <div className="card-term-small">
                                {flashcard.term}
                            </div>
                        </div>
                        
                        <div className="card-answer">
                            <div className="card-header">
                                <span className="card-label">Definition:</span>
                            </div>
                            <div className="card-definition">
                                {flashcard.definition}
                            </div>
                        </div>

                        <div className="rating-section">
                            <h4>How well did you remember this?</h4>
                            <div className="quality-buttons">
                                {qualityButtons.map(({ quality, label, description, className }) => (
                                    <button
                                        key={quality}
                                        className={`quality-btn ${className} ${isSubmitting ? 'disabled' : ''}`}
                                        onClick={() => handleQualityRating(quality)}
                                        disabled={isSubmitting}
                                    >
                                        <span className="quality-label">{label}</span>
                                        <span className="quality-description">{description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewCard