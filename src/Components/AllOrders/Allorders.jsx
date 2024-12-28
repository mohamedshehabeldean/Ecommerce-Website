import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { cartContext } from '../../Context/CartContext';
import { RotatingLines } from 'react-loader-spinner';
import { Helmet } from 'react-helmet';

function Allorders() {

    const [allOrders, setAllOrders] = useState(null);

    const cartOwner = localStorage.getItem('cartOwner');
    function getUserOrders() {
        axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${cartOwner}`)
            .then((res) => {
                console.log("res:", res.data);
                console.log("owner:", cartOwner);
                setAllOrders(res.data);

            })
            .catch((err) => {
                console.log("error:", err);

            })
    }
    useEffect(() => {
        getUserOrders();
    }, [])

    if (!allOrders) {
        return <div className="d-flex vh-100  bg-opacity-50 justify-content-center align-items-center">
            <RotatingLines
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
        <Helmet>
            <title>All orders</title>

        </Helmet>
        <div className="container">
            <div className="row">
                {allOrders.map((order, idx) => {
                    console.log("order", order.cartItems);

                    return <div key={idx} className="col-md-6 py-3">
                        <div className="order-card h-100">
                            <div className="container">
                                <div className="row gy-3">
                                    {order.cartItems.map((item, id) => (
                                        <div key={id} className="col-lg-4 col-md-6 ">
                                            <div className="item-card ">
                                                <img className='item-image w-100' src={item.product.imageCover} alt={item.product.title} />
                                                <h6 className='item-title text-center'>{item.product.title.split(' ').slice(0, 2).join(' ')}</h6>
                                                <p className='item-price'>Price: <span>{item.price} LE</span></p>
                                                <p className='item-count'>Count: <span>{item.count}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="order-summary">
                                <h5>Payment Method: <span>{order.paymentMethodType}</span></h5>
                                <h5>Order Price: <span>{order.totalOrderPrice} LE</span></h5>
                                <p className='order-delivery'>
                                    This order is delivering to <span>{order.shippingAddress.city}</span> on phone number: <span>{order.shippingAddress.phone}</span> with details: <span>{order.shippingAddress.details}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>

    </>
}

export default Allorders
