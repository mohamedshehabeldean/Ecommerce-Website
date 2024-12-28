import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    if(localStorage.getItem('tkn')==null){

        return <Navigate to='/login'/>

        
    }
    return <>
    {children}
    </>
}

export default ProtectedRoute
