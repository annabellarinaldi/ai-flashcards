import { useEffect, useState } from "react";
import { useFlashcardsContext } from "../hooks/useFlashcardsContext"
import { useAuthContext } from '../hooks/useAuthContexts'

//components
import FlashcardDetails from '../components/FlashcardDetails'
import FlashcardForm from '../components/FlashcardForm'

const Home = () => {
    const {flashcards, dispatch} = useFlashcardsContext()
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchFlashcards = async () => {
            const response = await fetch('/api/flashcards', {
                headers: {
                    'Authorization': 'Bearer ${user.token}'
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

    return (
        <div className="home">
            <div className="flashcards">
                {flashcards && flashcards.map((flashcard) => (
                    <FlashcardDetails key={flashcard._id} flashcard={flashcard} />
                ))}
            </div>
            <FlashcardForm />
        </div>
    )
}

export default Home;