import React from 'react'
import CounterCls from '../CounterCls/CounterCls'
import CounterFunc from '../CounterFunc/CounterFunc'

function Test() {
    return <>
        <div className="container">
            <div className="row my-5">
                <div className="col-6">
                    <CounterCls name="sabry" gender="male" />
                </div>
                <div className="col-6">
                    <CounterFunc  />

                </div>
            </div>
        </div>

    </>
}

export default Test
