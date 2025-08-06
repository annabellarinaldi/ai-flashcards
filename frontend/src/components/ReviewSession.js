// frontend/src/components/ReviewSession.js - Truly fixed version
import { useState, useEffect, useCallback } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'
import ReviewCard from './ReviewCard'
import TypedReviewCard from './TypedReviewCard'
import API_URL from '../config/api'

const ReviewSession = ({ onSessionComplete }) => {
    const { user } = useAuthContext()
    const [currentCard, setCurrentCard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reviewMode, setReviewMode] = useState('typed') // 'typed' or 'traditional'
    const [sessionStats, setSessionStats] = useState({
        totalReviewed: 0,
        remaining: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
    })

    // Simple fetch function without sessionStats dependency
    const fetchNextCard = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(`${API_URL}/api/flashcards/review-session`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                if (json.completed) {
                    setCurrentCard(null)
                    return { completed: true }
                } else {
                    setCurrentCard(json.flashcard)
                    setSessionStats(prev => ({
                        ...prev,
                        remaining: json.remaining
                    }))
                    return { completed: false, card: json.flashcard }
                }
            } else {
                setError(json.error || 'Failed to fetch next card')
                return { error: true }
            }
        } catch (error) {
            setError('Network error occurred')
            return { error: true }
        } finally {
            setLoading(false)
        }
    }, [user])

    // Initial card fetch - ONLY depends on user
    useEffect(() => {
        fetchNextCard()
    }, [fetchNextCard])

    const handleReviewComplete = async (reviewResult) => {
        console.log('handleReviewComplete called with:', reviewResult)
        
        // Update session stats
        const wasCorrect = reviewResult.isCorrect !== undefined ? reviewResult.isCorrect : true
        
        setSessionStats(prev => {
            const newStats = {
                totalReviewed: prev.totalReviewed + 1,
                remaining: reviewResult.remaining || 0,
                correctAnswers: prev.correctAnswers + (wasCorrect ? 1 : 0),
                incorrectAnswers: prev.incorrectAnswers + (wasCorrect ? 0 : 1)
            }
            
            // Check if session should complete
            if (reviewResult.completed || reviewResult.remaining === 0) {
                // Use setTimeout to avoid state update during render
                setTimeout(() => {
                    onSessionComplete(newStats)
                }, 0)
            }
            
            return newStats
        })

        // Load next card if available
        if (!reviewResult.completed && reviewResult.remaining > 0) {
            if (reviewResult.nextCard) {
                console.log('Loading next card:', reviewResult.nextCard.term)
                setCurrentCard(reviewResult.nextCard)
            } else {
                // Fetch next card if none provided
                const result = await fetchNextCard()
                if (result?.completed) {
                    // Session completed during fetch
                    setTimeout(() => {
                        onSessionComplete(sessionStats)
                    }, 0)
                }
            }
        }
    }

    const handleError = (errorMessage) => {
        setError(errorMessage)
    }

    const handleEndSession = () => {
        onSessionComplete(sessionStats)
    }

    const toggleReviewMode = () => {
        setReviewMode(prev => prev === 'typed' ? 'traditional' : 'typed')
    }

    if (loading) {
        return (
            <div className="review-session loading">
                <div className="loading-message">
                    <h3>Loading your next flashcard...</h3>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="review-session error">
                <div className="error-message">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={fetchNextCard} className="retry-btn">
                            Try Again
                        </button>
                        <button onClick={handleEndSession} className="end-session-btn">
                            End Session
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!currentCard) {
        return (
            <div className="review-session complete">
                <div className="completion-message">
                    <h3>🎉 Session Complete!</h3>
                    <p>No more cards to review right now.</p>
                    <button onClick={handleEndSession} className="finish-btn">
                        Finish
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="review-session active">
            <div className="session-header">
                <div className="session-progress">
                    <span className="reviewed-count">
                        Reviewed: {sessionStats.totalReviewed}
                    </span>
                    <span className="remaining-count">
                        Remaining: {sessionStats.remaining}
                    </span>
                    {reviewMode === 'typed' && (
                        <span className="accuracy-count">
                            Accuracy: {sessionStats.totalReviewed > 0 ? 
                                Math.round((sessionStats.correctAnswers / sessionStats.totalReviewed) * 100) : 0}%
                        </span>
                    )}
                </div>

                <div className="session-controls">
                    <button 
                        className="mode-toggle-btn"
                        onClick={toggleReviewMode}
                        title={`Switch to ${reviewMode === 'typed' ? 'traditional' : 'typed'} mode`}
                    >
                        {reviewMode === 'typed' ? '⌨️ Typed' : '🎯 Traditional'}
                    </button>
                    
                    <button 
                        className="end-session-btn secondary"
                        onClick={handleEndSession}
                    >
                        End Session
                    </button>
                </div>
            </div>

            {reviewMode === 'typed' ? (
                <TypedReviewCard
                    flashcard={currentCard}
                    onReviewComplete={handleReviewComplete}
                    onError={handleError}
                />
            ) : (
                <ReviewCard
                    flashcard={currentCard}
                    onReviewComplete={handleReviewComplete}
                    onError={handleError}
                />
            )}
        </div>
    )
}

export default ReviewSession