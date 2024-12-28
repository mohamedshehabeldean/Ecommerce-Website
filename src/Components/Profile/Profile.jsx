import React, { useContext } from 'react'
import { authContext } from '../../Context/AuthContext';
import {RotatingLines } from 'react-loader-spinner';

function Profile() {

    const {userData}=useContext(authContext);

    if(!userData){
        
       return <div className="d-flex vh-100  bg-opacity-50 justify-content-center align-items-center">
           return <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    }
    
    return <>

<div className="container">
    <h1>hello ya {userData.name}</h1>
</div>
    
    
    </>
}

export default Profile
