import { useEffect, useState } from "react";
import { useFlashcardsContext } from "../hooks/useFlashcardsContext"
import { useAuthContext } from '../hooks/useAuthContexts'

//components
import FlashcardDetails from '../components/FlashcardDetails'
import FlashcardForm from '../components/FlashcardForm'
import ReviewDashboard from '../components/ReviewDashboard'
import ReviewSession from '../components/ReviewSession'

const Home = () => {
    const {flashcards, dispatch} = useFlashcardsContext()
    const {user} = useAuthContext()
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'review', 'manage'
    const [sessionComplete, setSessionComplete] = useState(false)

    useEffect(() => {
        const fetchFlashcards = async () => {
            const response = await fetch('/api/flashcards', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_FLASHCARDS', payload: json})
            }
        }

        if (user) {
            fetchFlashcards() 
        }
    }, [dispatch, user])

    const handleStartReview = () => {
        setCurrentView('review')
        setSessionComplete(false)
    }

    const handleSessionComplete = (stats) => {
        setSessionComplete(true)
        setCurrentView('dashboard')
        // Could add a completion modal here with stats
        console.log('Session completed:', stats)
    }

    const handleViewChange = (view) => {
        setCurrentView(view)
    }

    return (
        <div className="home">
            {/* Navigation Tabs */}
            <div className="view-navigation">
                <button 
                    className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => handleViewChange('dashboard')}
                >
                    📚 Study
                </button>
                <button 
                    className={`nav-btn ${currentView === 'manage' ? 'active' : ''}`}
                    onClick={() => handleViewChange('manage')}
                >
                    📝 Manage Cards
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {currentView === 'dashboard' && (
                    <div className="dashboard-view">
                        <ReviewDashboard onStartReview={handleStartReview} />
                        {sessionComplete && (
                            <div className="session-complete-message">
                                <h3>🎉 Great job!</h3>
                                <p>You completed your review session. Keep up the good work!</p>
                            </div>
                        )}
                    </div>
                )}

                {currentView === 'review' && (
                    <div className="review-view">
                        <ReviewSession onSessionComplete={handleSessionComplete} />
                    </div>
                )}

                {currentView === 'manage' && (
                    <div className="manage-view">
                        <div className="flashcards-section">
                            <h2>Your Flashcards</h2>
                            <div className="flashcards">
                                {flashcards && flashcards.map((flashcard) => (
                                    <FlashcardDetails key={flashcard._id} flashcard={flashcard} />
                                ))}
                            </div>
                        </div>
                        <div className="form-section">
                            <FlashcardForm />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;