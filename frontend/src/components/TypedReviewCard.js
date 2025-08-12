// frontend/src/components/TypedReviewCard.js - Updated with AI scoring
import { useState, useRef, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'
import API_URL from '../config/api'

const TypedReviewCard = ({ flashcard, onReviewComplete, onError }) => {
    const { user } = useAuthContext()
    const [userAnswer, setUserAnswer] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [reviewResult, setReviewResult] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasCompleted, setHasCompleted] = useState(false)
    const [showManualOverride, setShowManualOverride] = useState(false)
    const inputRef = useRef(null)

    // Reset state when flashcard changes
    useEffect(() => {
        setUserAnswer('')
        setShowResult(false)
        setReviewResult(null)
        setIsSubmitting(false)
        setHasCompleted(false)
        setShowManualOverride(false)
        
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
            
            // Use the new AI scoring endpoint
            const response = await fetch(`${API_URL}/api/flashcards/ai-typed-review/${flashcard._id}`, {
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
                console.log('AI Review result:', result)
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
            
            const response = await fetch(`${API_URL}/api/flashcards/override-quality/${flashcard._id}`, {
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

    const handleShowManualOverride = () => {
        setShowManualOverride(true)
    }

    const getResultMessage = () => {
        if (!reviewResult?.aiScore) return ''
        
        const qualityLabels = {
            0: '❌ Again - Needs immediate review',
            1: '⚠️ Hard - Partially correct',  
            2: '✅ Good - Mostly correct',
            3: '🌟 Easy - Perfect understanding'
        }
        
        return qualityLabels[reviewResult.aiScore.quality] || 'Scored'
    }

    const getResultClass = () => {
        if (!reviewResult?.aiScore) return ''
        const quality = reviewResult.aiScore.quality
        if (quality >= 3) return 'result-excellent'
        if (quality >= 2) return 'result-correct'
        if (quality >= 1) return 'result-partial'
        return 'result-incorrect'
    }

    const getConfidenceColor = () => {
        if (!reviewResult?.aiScore) return '#666'
        const confidence = reviewResult.aiScore.confidence
        if (confidence >= 0.9) return '#28a745'
        if (confidence >= 0.7) return '#ffc107'
        return '#fd7e14'
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
                                        <span className="loading-spinner">🧠</span>
                                        AI is evaluating...
                                    </>
                                ) : (
                                    'Submit Answer'
                                )}
                            </button>
                        </div>

                        <div className="input-hint">
                            Press Enter to submit • AI will automatically score your response
                        </div>
                    </div>
                ) : (
                    // Result phase
                    <div className="result-phase">
                        <div className={`result-header ${getResultClass()}`}>
                            <div className="ai-score-display">
                                <div className="result-message">{getResultMessage()}</div>
                                {reviewResult.aiScore && (
                                    <div className="ai-score-details">
                                        <div className="score-badge">
                                            AI Score: {reviewResult.aiScore.quality}/3
                                        </div>
                                        <div 
                                            className="confidence-indicator"
                                            style={{ color: getConfidenceColor() }}
                                        >
                                            Confidence: {Math.round(reviewResult.aiScore.confidence * 100)}%
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {reviewResult.aiScore && (
                            <div className="ai-reasoning">
                                <div className="reasoning-header">
                                    <span className="ai-icon">🤖</span>
                                    <span>AI Assessment:</span>
                                </div>
                                <div className="reasoning-text">
                                    {reviewResult.aiScore.reasoning}
                                </div>
                                {!reviewResult.aiScore.aiScored && (
                                    <div className="fallback-notice">
                                        <small>⚠️ AI scoring unavailable - used backup method</small>
                                    </div>
                                )}
                            </div>
                        )}

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
                            {!showManualOverride ? (
                                <div className="ai-score-actions">
                                    <div className="score-satisfaction">
                                        <p>Does this AI score seem accurate to you?</p>
                                        <div className="satisfaction-buttons">
                                            <button 
                                                className="agree-btn"
                                                onClick={handleContinue}
                                                disabled={isSubmitting || hasCompleted}
                                            >
                                                ✅ Yes, continue
                                            </button>
                                            <button 
                                                className="disagree-btn"
                                                onClick={handleShowManualOverride}
                                                disabled={isSubmitting || hasCompleted}
                                            >
                                                🤔 No, let me score it
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="manual-override">
                                    <div className="override-header">
                                        <p><strong>Manual Override:</strong> How would you score this?</p>
                                    </div>
                                    <div className="quality-buttons-override">
                                        <button 
                                            className="quality-btn-override again" 
                                            onClick={() => handleQualityOverride(0)}
                                            disabled={isSubmitting || hasCompleted}
                                        >
                                            <div className="quality-label">Again</div>
                                            <div className="quality-desc">Need to review soon</div>
                                        </button>
                                        <button 
                                            className="quality-btn-override hard" 
                                            onClick={() => handleQualityOverride(1)}
                                            disabled={isSubmitting || hasCompleted}
                                        >
                                            <div className="quality-label">Hard</div>
                                            <div className="quality-desc">Challenging to recall</div>
                                        </button>
                                        <button 
                                            className="quality-btn-override good" 
                                            onClick={() => handleQualityOverride(2)}
                                            disabled={isSubmitting || hasCompleted}
                                        >
                                            <div className="quality-label">Good</div>
                                            <div className="quality-desc">Recalled correctly</div>
                                        </button>
                                        <button 
                                            className="quality-btn-override easy" 
                                            onClick={() => handleQualityOverride(3)}
                                            disabled={isSubmitting || hasCompleted}
                                        >
                                            <div className="quality-label">Easy</div>
                                            <div className="quality-desc">Very easy to recall</div>
                                        </button>
                                    </div>
                                    <button 
                                        className="cancel-override-btn"
                                        onClick={() => setShowManualOverride(false)}
                                        disabled={isSubmitting || hasCompleted}
                                    >
                                        Cancel Override
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TypedReviewCard