import { useState } from 'react'
import {useAuthContext} from './useAuthContexts'
import API_URL from '../config/api'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const login = async (emailOrUsername, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/api/user/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({emailOrUsername, password})
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            //update authcontext
            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false)
        }
    }

    return {login, isLoading, error}
}