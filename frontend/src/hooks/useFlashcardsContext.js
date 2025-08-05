import { FlashcardsContext } from "../context/FlashcardContext";
import { useContext } from 'react'

export const useFlashcardsContext = () => {
    const context = useContext(FlashcardsContext)

    if (!context){
        throw Error('useFlashcardsContext must be used inside a FlashcardsContext provider')
    }
    
    return context
}