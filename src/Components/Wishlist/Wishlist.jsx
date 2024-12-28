import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { cartContext } from '../../Context/CartContext';
import toast from 'react-hot-toast';
import { easeInOut, motion } from "framer-motion";
import { Link } from 'react-router-dom';
import HomeStyle from '../Products/Product.module.css';
import {RotatingLines } from 'react-loader-spinner';
import { wishlistContext } from '../../Context/wishlist';

function Wishlist() {
    const { allProducts, addProductToWishlist, getUserWishlist, deleteProductFromWishlist } = useContext(wishlistContext);
    const { addProductToCart } = useContext(cartContext);
    const [wishlist, setWishlist] = useState(() => {
        // Restore wishlist from local storage on initial load
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : {};
    });

    // Sync wishlist with localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Delete specific product from wishlist
    async function deleteSpecificItem(id) {
        const res = await deleteProductFromWishlist(id);
        if (res) {
            // Remove product from wishlist using context and update local state
            setWishlist((prev) => {
                const updatedWishlist = { ...prev };
                delete updatedWishlist[id];
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist)); // Update localStorage
                return updatedWishlist;
            });
            toast.success("Product deleted successfully from your wishlist", { position: 'top-center', duration: 2000 });
        } else {
            toast.error("Error occurred while deleting product from wishlist", { duration: 2000, position: 'top-center' });
        }
    }

    // Add product to cart
    async function addProduct(id) {
        const result = await addProductToCart(id);
        if (result?.status === "success") {
            toast.success("Product added successfully to your cart", { duration: 2000, position: 'top-center' });
        } else {
            toast.error("Error occurred while adding to cart.", { duration: 2000, position: 'top-center' });
        }
    }

    // Fetch the wishlist when the component mounts or wishlist is updated
    useEffect(() => {
        getUserWishlist();
    }, [getUserWishlist]);

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

    return (
        <>
            <Helmet>
                <title>Wishlist</title>
            </Helmet>
            {allProducts.length === 0 ? (
                <div className="d-flex justify-content-center mt-5">
                    <div>
                        <p className="fw-bold text-center">Your wishlist is empty!</p>
                        <p style={{ lineHeight: "2px", color: "grey" }} className="text-center">
                            Looks like you haven't added anything to your wishlist yet.
                        </p>
                        <div className="d-flex justify-content-center">
                            <img width={"40%"} className="h-50 m-auto text-center mt-2" src={require('../../images/wishlist.png')} alt="" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mt-3 gy-3">
                    <div className="products row gy-3 mt-3">
                        {allProducts.map((product, idx) => (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.5, ease: easeInOut }}
                                key={idx}
                                className="col-lg-2 col-md-3 col-sm-4 col-6 overflow-hidden product"
                            >
                                <span
                                    role="button"
                                    onClick={() => deleteSpecificItem(product.id)}
                                    style={{ position: "relative", top: "4px", left: "80%" }}
                                >
                                    <i className="fa-solid fa-trash" style={{ color: "#f00000" }}></i>
                                </span>
                                <Link className='' to={`/productdetails/${product.id}`}>
                                    <div style={{ height: "350px", display: "flex", flexDirection: "column" }} className="mt-3">
                                        <img src={product.imageCover} alt="" className="w-100" />
                                        <h4 className="h6 text-main">{product.category.name}</h4>
                                        <h2 className="h5">{product.title.split(' ').slice(0, 2).join(' ')}</h2>
                                        <div className="d-flex justify-content-between">
                                            {product.priceAfterDiscount ? (
                                                <p><del>{product.price}</del> {product.priceAfterDiscount} EGP</p>
                                            ) : (
                                                <p>{product.price} EGP</p>
                                            )}
                                            <p>
                                                <span><i style={{ color: "gold" }} className="fa-solid fa-star"></i></span>
                                                {product.ratingsAverage}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <button onClick={() => addProduct(product.id)} className="btn bg-main text-white m-auto d-block add">
                                    <span><i className="fa-solid fa-cart-shopping"></i></span> Add to cart
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Wishlist;
