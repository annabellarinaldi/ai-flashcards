// frontend/src/pages/home.js - Updated with Document Upload
import { useEffect, useState } from "react";
import { useFlashcardsContext } from "../hooks/useFlashcardsContext"
import { useAuthContext } from '../hooks/useAuthContexts'
import API_URL from '../config/api'

//components
import FlashcardDetails from '../components/FlashcardDetails'
import FlashcardForm from '../components/FlashcardForm'
import ReviewDashboard from '../components/ReviewDashboard'
import ReviewSession from '../components/ReviewSession'
import DocumentUpload from '../components/DocumentUpload'
import FlashcardEditor from '../components/FlashcardEditor'

const Home = () => {
    const {flashcards, dispatch} = useFlashcardsContext()
    const {user} = useAuthContext()
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'review', 'manage', 'upload'
    const [sessionComplete, setSessionComplete] = useState(false)
    
    // Document upload states
    const [generatedFlashcards, setGeneratedFlashcards] = useState(null)
    const [showEditor, setShowEditor] = useState(false)

    useEffect(() => {
        const fetchFlashcards = async () => {
            const response = await fetch(`${API_URL}/api/flashcards`, {
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
        console.log('Session completed:', stats)
    }

    const handleViewChange = (view) => {
        setCurrentView(view)
        // Reset document upload states when switching views
        if (view !== 'upload') {
            setGeneratedFlashcards(null)
            setShowEditor(false)
        }
        // Reset session complete when switching away from dashboard
        if (view !== 'dashboard') {
            setSessionComplete(false)
        }
    }

    // Document upload handlers
    const handleFlashcardsGenerated = (result) => {
        console.log('Flashcards generated:', result)
        setGeneratedFlashcards(result)
        setShowEditor(true)
    }

    const handleSaveComplete = (result) => {
        console.log('Flashcards saved:', result)
        
        // Add new flashcards to the context
        if (result.flashcards && result.flashcards.length > 0) {
            result.flashcards.forEach(flashcard => {
                dispatch({type: 'CREATE_FLASHCARD', payload: flashcard})
            })
        }
        
        // Show success message
        setSuccessMessageCount(result.count)
        setShowSuccessMessage(true)
        
        // Clean up and redirect to study view
        setGeneratedFlashcards(null)
        setShowEditor(false)
        setCurrentView('dashboard')
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
        
        // Hide success message after 4 seconds
        setTimeout(() => {
            setShowSuccessMessage(false)
        }, 4000)
    }

    const handleCancelEditor = () => {
        setShowEditor(false)
        setGeneratedFlashcards(null)
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
                    className={`nav-btn ${currentView === 'upload' ? 'active' : ''}`}
                    onClick={() => handleViewChange('upload')}
                >
                    🤖 AI Generate
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

                {currentView === 'upload' && (
                    <div className="upload-view">
                        {!showEditor ? (
                            <DocumentUpload onFlashcardsGenerated={handleFlashcardsGenerated} />
                        ) : (
                            <FlashcardEditor 
                                generatedData={generatedFlashcards}
                                onSaveComplete={handleSaveComplete}
                                onCancel={handleCancelEditor}
                            />
                        )}
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