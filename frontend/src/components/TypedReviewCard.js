// frontend/src/components/TypedReviewCard.js - Fixed version
import { useState, useRef, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'

const TypedReviewCard = ({ flashcard, onReviewComplete, onError }) => {
    const { user } = useAuthContext()
    const [userAnswer, setUserAnswer] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [reviewResult, setReviewResult] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasCompleted, setHasCompleted] = useState(false) // Prevent multiple completions
    const inputRef = useRef(null)

    // Reset state when flashcard changes
    useEffect(() => {
        setUserAnswer('')
        setShowResult(false)
        setReviewResult(null)
        setIsSubmitting(false)
        setHasCompleted(false)
        
        // Focus input after short delay
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 100)
    }, [flashcard._id])

    const handleSubmitAnswer = async () => {
        if (!user || isSubmitting || !userAnswer.trim() || hasCompleted) return

        try {
            setIsSubmitting(true)
            
            const response = await fetch(`/api/flashcards/typed-review/${flashcard._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ userAnswer: userAnswer.trim() })
            })

            const result = await response.json()

            if (response.ok) {
                setReviewResult(result)
                setShowResult(true)
                console.log('Review result:', result)
            } else {
                onError(result.error || 'Failed to submit answer')
            }

        } catch (error) {
            console.error('Submit answer error:', error)
            onError('Network error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !showResult && !isSubmitting) {
            e.preventDefault()
            handleSubmitAnswer()
        }
    }

    const handleQualityOverride = async (quality) => {
        if (isSubmitting || hasCompleted) return

        try {
            setIsSubmitting(true)
            
            const response = await fetch(`/api/flashcards/override-quality/${flashcard._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ quality })
            })

            const result = await response.json()

            if (response.ok) {
                console.log('Quality override result:', result)
                setHasCompleted(true)
                // Move to next card immediately
                onReviewComplete(result)
            } else {
                onError(result.error || 'Failed to update quality')
            }

        } catch (error) {
            console.error('Quality override error:', error)
            onError('Network error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleContinue = () => {
        if (reviewResult && !hasCompleted) {
            setHasCompleted(true)
            onReviewComplete(reviewResult)
        }
    }

    const getResultMessage = () => {
        if (!reviewResult) return ''
        
        if (reviewResult.isCorrect) {
            return '✅ Correct!'
        } else {
            return '❌ Incorrect'
        }
    }

    const getResultClass = () => {
        if (!reviewResult) return ''
        return reviewResult.isCorrect ? 'result-correct' : 'result-incorrect'
    }

    // Determine what to ask based on review type
    const getQuestion = () => {
        if (flashcard.reviewType === 'recognition') {
            return {
                prompt: 'What is the definition of:',
                question: flashcard.term,
                correctAnswer: flashcard.definition
            }
        } else {
            return {
                prompt: 'What term matches this definition:',
                question: flashcard.definition,
                correctAnswer: flashcard.term
            }
        }
    }

    const questionData = getQuestion()

    return (
        <div className="typed-review-card">
            <div className="card-content">
                {!showResult ? (
                    // Question phase
                    <div className="question-phase">
                        <div className="question-section">
                            <div className="question-prompt">{questionData.prompt}</div>
                            <div className="question-text">{questionData.question}</div>
                        </div>

                        <div className="answer-section">
                            <label htmlFor="answer-input">Your Answer:</label>
                            <input
                                id="answer-input"
                                ref={inputRef}
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your answer here..."
                                disabled={isSubmitting}
                                className="answer-input"
                            />
                            
                            <button
                                className="submit-answer-btn"
                                onClick={handleSubmitAnswer}
                                disabled={isSubmitting || !userAnswer.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading-spinner">⏳</span>
                                        Checking...
                                    </>
                                ) : (
                                    'Submit Answer'
                                )}
                            </button>
                        </div>

                        <div className="input-hint">
                            Press Enter to submit your answer
                        </div>
                    </div>
                ) : (
                    // Result phase
                    <div className="result-phase">
                        <div className={`result-header ${getResultClass()}`}>
                            <div className="result-icon">
                                {reviewResult.isCorrect ? '🎉' : '📚'}
                            </div>
                            <div className="result-message">{getResultMessage()}</div>
                        </div>

                        <div className="answer-comparison">
                            <div className="user-answer">
                                <label>Your Answer:</label>
                                <div className={`answer-text ${reviewResult.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {reviewResult.userAnswer}
                                </div>
                            </div>

                            <div className="correct-answer">
                                <label>Correct Answer:</label>
                                <div className="answer-text correct">
                                    {reviewResult.correctAnswer}
                                </div>
                            </div>
                        </div>

                        {reviewResult.feedback && (
                            <div className="performance-stats">
                                <div className="stat">
                                    <span className="stat-label">Accuracy:</span>
                                    <span className="stat-value">{reviewResult.feedback.accuracy}%</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Total Reviews:</span>
                                    <span className="stat-value">{reviewResult.feedback.totalReviews}</span>
                                </div>
                            </div>
                        )}

                        <div className="result-actions">
                            <div className="quality-override">
                                <p>How difficult was this for you? (Optional)</p>
                                <div className="quality-buttons-small">
                                    <button 
                                        className="quality-btn-small again" 
                                        onClick={() => handleQualityOverride(0)}
                                        disabled={isSubmitting || hasCompleted}
                                    >
                                        Again
                                    </button>
                                    <button 
                                        className="quality-btn-small hard" 
                                        onClick={() => handleQualityOverride(1)}
                                        disabled={isSubmitting || hasCompleted}
                                    >
                                        Hard
                                    </button>
                                    <button 
                                        className="quality-btn-small good" 
                                        onClick={() => handleQualityOverride(2)}
                                        disabled={isSubmitting || hasCompleted}
                                    >
                                        Good
                                    </button>
                                    <button 
                                        className="quality-btn-small easy" 
                                        onClick={() => handleQualityOverride(3)}
                                        disabled={isSubmitting || hasCompleted}
                                    >
                                        Easy
                                    </button>
                                </div>
                            </div>

                            <button 
                                className="continue-btn"
                                onClick={handleContinue}
                                disabled={isSubmitting || hasCompleted}
                            >
                                {isSubmitting ? 'Processing...' : 'Continue →'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TypedReviewCard