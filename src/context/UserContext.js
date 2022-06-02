import React, { useReducer, createContext } from 'react'

import api from '../services/api'
import {decoder} from '../services/decoder'
const UserStateContext = createContext()
const UserDispatchContext = createContext()

const initialState = { email: '', isAuthenticated: '' }

const actions = {
  loginSucces: 'LOGIN_SUCCESS',
  loginFailure: 'LOGIN_FAILURE',
  singOut: 'SIGN_OUT_SUCCESS'
}

function userReducer (state, action) {
  switch (action.type) {
    case actions.loginSucces:
      return { ...state, isAuthenticated: true }
    case actions.loginFailure:
      return { ...state, isAuthenticated: false }
    case actions.signOut:
      return { ...state, isAuthenticated: false }
    case action.payload:
      return { email: action.payload }
    default:
      {
        return { ...state, isAuthenticated: false }
      }
  }
}

function UserProvider ({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  return (< UserStateContext.Provider value={state} >
    < UserDispatchContext.Provider value={dispatch} > {children}
    </UserDispatchContext.Provider> </UserStateContext.Provider>
  )
}

function useUserState () {
  const context = React.useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider')
  }
  return context
}

function useUserDispatch () {
  const context = React.useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider')
  }
  return context
}

// ###########################################################

async function singUp (name, email, password, setIsLoading, setError, setErrorMessage, setActiveTabId) {
  setIsLoading(true)
  const data = {
    email,
    name,
    password,
    cpf: '',
    description: '',
    age: 0,
    score: 0,
    profile: 'ADMIN'
  }
  setTimeout(() => {
    api.post('/v1/users', data)

      .then(data => {
        setIsLoading(false)
        setActiveTabId(0)
        setErrorMessage('Faça login para continuar')
      })

      .catch(err => {
        setIsLoading(false)
        setErrorMessage(err.message)
        setError(true)
      })
  }, 2000)
}

async function login (dispatch, login, password, history, setIsLoading, setError, setErrorMessage) {
  setIsLoading(true)
  const data = {
    email: login,
    password: password
  }

  try {
    const response = await api.post('/login', data)
    const {headers} = response
      localStorage.setItem('keepitoAuthorization', headers.authorization)
      setIsLoading(false)
      dispatch({ type: actions.loginSucces })
      history.push('/app/menu')
  } catch (error) {
      setError(true)
      //  dispatch({ type: actions.loginFailure });
      setIsLoading(false)
      setErrorMessage('Algo está errado com seu login ou senha :(')
      setError(true)
  }


  
     
    
}

function signOut (dispatch, history) {
  localStorage.removeItem('keepitoAuthorization')
  dispatch({ type: actions.singOut })
  history.push('/login')
}

export { UserProvider, useUserState, useUserDispatch, singUp, login, signOut }