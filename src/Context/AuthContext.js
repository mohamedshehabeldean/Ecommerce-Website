import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';

export const authContext = createContext();

function AuthContextProvider({ children }) {

    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);


    // when refresh page

    useEffect(function () {

        if (localStorage.getItem('tkn') != null) {
            setToken(localStorage.getItem('tkn'));
            getUserData();
            // setUserData(jwtDecode(localStorage.getItem('tkn')));
        }

    }, []);

    // jwt-decode
    function getUserData() {

       const userData= jwtDecode(localStorage.getItem('tkn'));
       setUserData(userData);
       console.log("userData",userData);
       

    }

    return <authContext.Provider value={{ token, setToken, userData,getUserData }}>
        {children}

    </authContext.Provider>
}

export default AuthContextProvider
