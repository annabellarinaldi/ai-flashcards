// frontend/src/components/ReviewDashboard.js - Complete Fixed Version
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'

const ReviewDashboard = ({ onStartReview }) => {
    const { user } = useAuthContext()
    const [dueCount, setDueCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch due count when component mounts
    useEffect(() => {
        const fetchDueCount = async () => {
            if (!user) return

            try {
                setLoading(true)
                const response = await fetch('/api/flashcards/due-count', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                
                const json = await response.json()
                
                if (response.ok) {
                    setDueCount(json.count)
                } else {
                    setError(json.error)
                }
            } catch (error) {
                setError('Failed to fetch due cards')
            } finally {
                setLoading(false)
            }
        }

        fetchDueCount()
    }, [user])

    const handleStartReview = () => {
        if (dueCount > 0 && onStartReview) {
            onStartReview()
        }
    }

    if (loading) {
        return <div className="review-dashboard loading">Loading...</div>
    }

    return (
        <div className="review-dashboard">
            <div className="review-summary">
                <h2>📚 Study Session</h2>
                
                {error && (
                    <div className="error">{error}</div>
                )}
                
                {dueCount > 0 ? (
                    <div className="due-cards">
                        <div className="due-count">
                            <span className="count-number">{dueCount}</span>
                            <span className="count-text">
                                flashcard{dueCount !== 1 ? 's' : ''} ready to review
                            </span>
                        </div>
                        
                        <button 
                            className="start-review-btn"
                            onClick={handleStartReview}
                        >
                            Start Review Session
                        </button>
                        
                        <p className="review-info">
                            Stay consistent with your reviews to maximize retention!
                        </p>
                    </div>
                ) : (
                    <div className="no-cards">
                        <div className="celebration">🎉</div>
                        <h3>All caught up!</h3>
                        <p>No flashcards are due for review right now.</p>
                        <p>Come back tomorrow to stay on track with your learning.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewDashboard