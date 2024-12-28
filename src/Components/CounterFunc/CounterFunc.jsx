import React, { PureComponent } from 'react'

class CounterFunc extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            counter:0,

        }
    }
    change=(num)=>{
        const x=num;
        this.setState({counter:x+num})
        
    }

    render() {
        return <>
            <h1>the counter is {this.state.counter}</h1>
            <div onClick={()=>{this.change(1)}} className="btn btn-danger">change</div>
        </>
    }
}

export default CounterFunc