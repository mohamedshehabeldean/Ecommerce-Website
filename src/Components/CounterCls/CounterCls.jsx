import React, { useEffect, useState } from 'react';
import myImage from '../../images/banner-4.jpeg';

function CounterCls({name,age}) {

    console.log(name);
    

    // idea of flag to check if you inside component didMount or component didUpdate
    // const [flag, setFlag] = useState(false);
    // if(flag==false){

    //     flag=true;


    // }else{

    // }
    let [counter, setCounter] = useState(0);

    function changeCounter(count) {

        setCounter(count + 1);
    }

    // useEffect(function(){
    //      console.log("didmount");

    // },[])

    function clickEvent() {
        console.log("clicked...");


    }

    useEffect(function () {

        return function () {
        }
    }, [])


    return <>

        <h1>function component</h1>
        <h4>counter is: {counter}</h4>
        <div onClick={function () { changeCounter(counter) }} className="btn btn-danger">change</div>
        <img src={require('../../images/banner-4.jpeg')} alt="banner" />
    </>
}

export default CounterCls
