import { useState } from "react"
import { useFlashcardsContext } from "../hooks/useFlashcardsContext"
import {useAuthContext} from '../hooks/useAuthContexts'
import API_URL from '../config/api'

const FlashcardForm = () => {
    const { dispatch } = useFlashcardsContext()
    const { user } = useAuthContext()

    const [term, setTerm] = useState('')
    const [definition, setDefinition] = useState('')
    const [error, setError] = useState('')
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const flashcard = {term, definition}

        const response = await fetch(`${API_URL}/api/flashcards`, {
            method: 'POST',
            body: JSON.stringify(flashcard),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok){
            setTerm('')
            setDefinition('')
            setError(null)
            setEmptyFields([])
            console.log('new flashcard added', json)
            dispatch({type: 'CREATE_FLASHCARD', payload: json})
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}> 
            <h3>Add a New Flashcard</h3>

            <label>Term: </label>
            <input 
                type="text"
                onChange={(e) => setTerm(e.target.value)}
                value={term}
                className={emptyFields.includes('term') ? 'error' : ''}
            />
            
            <label>Definition: </label>
            <input 
                type="text"
                onChange={(e) => setDefinition(e.target.value)}
                value={definition}
                className={emptyFields.includes('definition') ? 'error' : ''}
            />

            <button>Add Flashcard</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default FlashcardForm