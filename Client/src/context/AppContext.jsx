import React from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();


    const contextValue = {
        navigate : navigate,
    }

    return (
        <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>
    )
}

export default AppContextProvider