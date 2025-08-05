import { useAuthContext  } from './useAuthContexts'
import { useFlashcardsContext  } from './useFlashcardsContexts'
export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: flashcardsDispatch } = useFlaschardsContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
        flashcardsDispatch({type: 'SET_FLASHCARDS', payload: null})
    }

    return {logout}

}