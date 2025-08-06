// frontend/src/components/FlashcardEditor.js
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContexts'

const FlashcardEditor = ({ generatedData, onSaveComplete, onCancel }) => {
    const { user } = useAuthContext()
    const [flashcards, setFlashcards] = useState(generatedData.flashcards || [])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const updateFlashcard = (index, field, value) => {
        const updated = [...flashcards]
        updated[index] = { ...updated[index], [field]: value }
        setFlashcards(updated)
    }

    const deleteFlashcard = (index) => {
        const updated = flashcards.filter((_, i) => i !== index)
        setFlashcards(updated)
    }

    const addFlashcard = () => {
        setFlashcards([...flashcards, { term: '', definition: '' }])
    }

    const saveFlashcards = async () => {
        if (!user) return

        // Filter out empty flashcards
        const validFlashcards = flashcards.filter(card => 
            card.term && card.definition && 
            card.term.trim().length > 0 && card.definition.trim().length > 0
        )

        if (validFlashcards.length === 0) {
            setError('Please create at least one flashcard with both term and definition.')
            return
        }

        try {
            setSaving(true)
            setError(null)

            const response = await fetch('/api/documents/save-flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ flashcards: validFlashcards })
            })

            const result = await response.json()

            if (response.ok) {
                console.log('✅ Flashcards saved successfully:', result)
                onSaveComplete(result)
            } else {
                setError(result.error || 'Failed to save flashcards')
            }

        } catch (error) {
            console.error('Save error:', error)
            setError('Network error. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flashcard-editor">
            <div className="editor-header">
                <h3>📝 Review Generated Flashcards</h3>
                <p className="editor-description">
                    Review and edit the AI-generated flashcards from <strong>{generatedData.filename}</strong>. 
                    You can modify, delete, or add new flashcards before saving.
                </p>
            </div>

            {error && (
                <div className="error editor-error">
                    {error}
                </div>
            )}

            <div className="flashcards-list">
                {flashcards.map((card, index) => (
                    <div key={index} className="flashcard-edit-item">
                        <div className="card-number">#{index + 1}</div>
                        
                        <div className="card-fields">
                            <div className="field-group">
                                <label>Term / Question:</label>
                                <input
                                    type="text"
                                    value={card.term}
                                    onChange={(e) => updateFlashcard(index, 'term', e.target.value)}
                                    placeholder="Enter the term or question"
                                    className="term-input"
                                />
                            </div>
                            
                            <div className="field-group">
                                <label>Definition / Answer:</label>
                                <textarea
                                    value={card.definition}
                                    onChange={(e) => updateFlashcard(index, 'definition', e.target.value)}
                                    placeholder="Enter the definition or answer"
                                    className="definition-input"
                                    rows="3"
                                />
                            </div>
                        </div>
                        
                        <button
                            className="delete-card-btn"
                            onClick={() => deleteFlashcard(index)}
                            title="Delete this flashcard"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            <div className="editor-actions">
                <button 
                    className="add-card-btn"
                    onClick={addFlashcard}
                >
                    ➕ Add New Flashcard
                </button>

                <div className="save-actions">
                    <button 
                        className="cancel-btn"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    
                    <button 
                        className="save-btn"
                        onClick={saveFlashcards}
                        disabled={saving || flashcards.length === 0}
                    >
                        {saving ? (
                            <>
                                <span className="loading-spinner">⏳</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                💾 Save {flashcards.filter(c => c.term && c.definition).length} Flashcards
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="editor-stats">
                <div className="stat">
                    <span className="stat-number">{flashcards.length}</span>
                    <span className="stat-label">Total Cards</span>
                </div>
                <div className="stat">
                    <span className="stat-number">
                        {flashcards.filter(c => c.term && c.definition && c.term.trim() && c.definition.trim()).length}
                    </span>
                    <span className="stat-label">Valid Cards</span>
                </div>
            </div>
        </div>
    )
}

export default FlashcardEditor