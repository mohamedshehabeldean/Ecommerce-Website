import React, { useContext, useEffect } from 'react'
import { cartContext } from '../../Context/CartContext';
import {RotatingLines } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function Cart() {


    const { allProducts, totalCartPrice, numOfCartItems, updateCount, deleteProduct, deleteAllItems } = useContext(cartContext);


    async function updateProductCount(id, count) {
        const res = await updateCount(id, count);

        if (res) {
            toast.success("product updated successfully", { position: 'top-center', duration: 2000 })
        } else {
            toast.error("Error occurred...", { duration: 2000, position: 'top-center' })

        }
    }

    async function deleteSpecificItem(id) {
        const res = await deleteProduct(id);
        if (res) {
            toast.success("product deleted successfully", { position: 'top-center', duration: 2000 })
        } else {
            toast.error("Error occurred...", { duration: 2000, position: 'top-center' })

        }

    }
    async function deleteAllProducts() {
        const res = await deleteAllItems();
        if (res) {
            toast.success("all products deleted successfully", { position: 'top-center', duration: 2000 })
        } else {
            toast.error("Error occurred...", { duration: 2000, position: 'top-center' })

        }

    }
    if (!allProducts) {
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
            <title>Cart</title>
        </Helmet>
        {allProducts.length == 0 ? <div className='d-flex justify-content-center mt-5'>
            <div>
                <p className='fw-bold text-center'>Your cart is empty !</p>
                <p style={{ "lineHeight": "2px", "color": "grey" }} className='text-center'>Looks like you haven't added anything to your cart yet.</p>
                <div className='d-flex justify-content-center'>

                    <img className='w-25 h-50 m-auto text-cener ' src={require('../../images/cart.jpg')} alt="" />
                </div>

            </div>

        </div> : <div className="container">
            <div className='d-flex justify-content-between mt-2'>

                <div>
                    <h2 c>Shop Cart</h2>
                    <h5 className='fw-bold'>Total Cart Price: <span className='text-main fw-bold'> {totalCartPrice} LE</span></h5>

                </div>
                <div>
                    <button onClick={() => deleteAllProducts()} className='btn btn-outline-danger'>Clear</button>
                </div>
            </div>

            {allProducts.map((product, idx) => <div key={idx} className="row border-1 border-bottom border-dark py-3 align-items-center  mb-1">
                <div className="col-md-1">
                    <figure>
                        <img className='w-100' src={product.product.imageCover} alt={product.product.title} />
                    </figure>

                </div>
                <div className="col-md-9">
                    <article>
                        <h3>{product.product.title}</h3>
                        <h5>{product.price}</h5>
                        <button onClick={() => { deleteSpecificItem(product.product.id) }} className='btn btn-outline-danger'>remove</button>
                        {/* <br />
                        1:{product._id} */}
                        <br />
                        {/* 2:{product.product.id} */}
                    </article>

                </div>
                <div className="col-md-2">
                    <div className='d-flex justify-content-between align-items-baseline'>
                        <button onClick={() => updateProductCount(product.product.id, product.count + 1)} className='btn btn-outline-success'>+</button>
                        <p >{product.count}</p>
                        <button disabled={product.count == 1} onClick={() => updateProductCount(product.product.id, product.count - 1)} className='btn btn-outline-success'>-</button>

                    </div>
                </div>
            </div>)}
            <Link to="/payment">
                <button className='btn btn-primary rounded-2 m-auto d-block mt-5' >confirm payment</button>
            </Link>
        </div>}



    </>
}

export default Cart
