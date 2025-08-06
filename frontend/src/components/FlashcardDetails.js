import { useFlashcardsContext } from "../hooks/useFlashcardsContext"
//date fns
import { formatDistanceToNow } from "date-fns"
import { useAuthContext} from "../hooks/useAuthContexts"

const FlashcardDetails = ({ flashcard}) => {
    const { dispatch } = useFlashcardsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user){
            return
        }
        const response = await fetch('/api/flashcards/' + flashcard._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok){
            dispatch({type: 'DELETE_FLASHCARD' , payload: json})
        }
    }
    return (
        <div className="flashcard-details">
            <h4>{flashcard.term}</h4>
            <p>{flashcard.definition}</p>
            <p>{formatDistanceToNow(new Date(flashcard.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    )
}

export default FlashcardDetails