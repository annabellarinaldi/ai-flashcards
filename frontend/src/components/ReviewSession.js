// frontend/src/components/ReviewSession.js - Complete Fixed Version
import { useState, useEffect, useCallback } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'
import ReviewCard from './ReviewCard'

const ReviewSession = ({ onSessionComplete }) => {
    const { user } = useAuthContext()
    const [currentCard, setCurrentCard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sessionStats, setSessionStats] = useState({
        totalReviewed: 0,
        remaining: 0
    })

    // Use useCallback to avoid useEffect dependency warning
    const fetchNextCard = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch('/api/flashcards/review-session', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                if (json.completed) {
                    // No more cards to review
                    onSessionComplete(sessionStats)
                } else {
                    setCurrentCard(json.flashcard)
                    setSessionStats(prev => ({
                        ...prev,
                        remaining: json.remaining
                    }))
                }
            } else {
                setError(json.error || 'Failed to fetch next card')
            }
        } catch (error) {
            setError('Network error occurred')
        } finally {
            setLoading(false)
        }
    }, [user, onSessionComplete])

    // Fetch the first card when session starts
    useEffect(() => {
        fetchNextCard()
    }, [fetchNextCard])

    const handleReviewComplete = (reviewResult) => {
        // Update session stats
        setSessionStats(prev => ({
            totalReviewed: prev.totalReviewed + 1,
            remaining: reviewResult.remaining
        }))

        // Check if session is complete
        if (reviewResult.completed) {
            onSessionComplete({
                totalReviewed: sessionStats.totalReviewed + 1,
                remaining: 0
            })
        } else {
            // Load next card
            if (reviewResult.nextCard) {
                setCurrentCard(reviewResult.nextCard)
            } else {
                fetchNextCard()
            }
        }
    }

    const handleError = (errorMessage) => {
        setError(errorMessage)
    }

    const handleEndSession = () => {
        onSessionComplete(sessionStats)
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
                </div>
                <button 
                    className="end-session-btn secondary"
                    onClick={handleEndSession}
                >
                    End Session
                </button>
            </div>

            <ReviewCard
                flashcard={currentCard}
                onReviewComplete={handleReviewComplete}
                onError={handleError}
            />
        </div>
    )
}

export default ReviewSession