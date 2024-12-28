import React, { useCallback, useContext, useEffect, useState } from 'react';
import HomeStyle from './Product.module.css';
import axios from 'axios';
import {RotatingLines } from 'react-loader-spinner';
import { useQuery } from 'react-query';
import SimpleSlider from '../HomeSlider/HomeSlider';
import CategorySlider from '../CategorySlider/CategorySlider';
import { Link } from 'react-router-dom';
import { cartContext } from '../../Context/CartContext';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { easeInOut, motion } from "framer-motion";
import { wishlistContext } from '../../Context/wishlist';


function Products() {
    const [allProducts, setAllProducts] = useState([]);
    const [search, setSearch] = useState('');
    console.log(search);
    const { addProductToCart } = useContext(cartContext);
    const { addProductToWishlist, deleteProductFromWishlist } = useContext(wishlistContext); // Get context functions
    // Initialize wishlist state from localStorage on first load
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : {};
    });

    // Sync wishlist with localStorage when wishlist changes
    useEffect(() => {
        // Only sync if wishlist changes to avoid unnecessary writes
        if (Object.keys(wishlist).length) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist]);

    // Memoize toggleWishlist for performance optimization
    const toggleWishlist = useCallback((productId) => {
        setWishlist((prevWishlist) => {
            const updatedWishlist = { ...prevWishlist };

            if (updatedWishlist[productId]) {
                // Product exists in wishlist, remove it
                deleteProductFromWishlist(productId);
                delete updatedWishlist[productId];
                // toast.success("Product removed from wishlist.", { position: 'top-center', duration: 2000 });
            } else {
                // Product doesn't exist in wishlist, add it
                addProductToWishlist(productId);
                updatedWishlist[productId] = true; // Add to wishlist
                // toast.success("Product added to wishlist.", { position: 'top-center', duration: 2000 });
            }

            return updatedWishlist;
        });
    }, []);




    async function addProduct(id) {
        const result = await addProductToCart(id);
        console.log("sabry", result);

        // const messg = res.message;
        //    setMessage(messg);
        if (result?.status === "success") {
            console.log("Product added successfully to your cart");
            toast.success("Product added successfully to your cart", { duration: 2000, position: 'top-center' })

        } else {
            console.log("Error occurred...");
            toast.error("Error occurred...", { duration: 2000, position: 'top-center' })



        }



    }

    async function getAllProducts() {
        return await axios.get('https://ecommerce.routemisr.com/api/v1/products')
        // .then((res) => {
        //     setAllProducts(res.data.data);
        // })
        // .catch((err) => {
        //     console.log(err);
        // })

    }
    // cache data from a API
    const { isLoading, isError, isFetching, data, refetch } = useQuery('getAllProducts', getAllProducts, {
        // refetchOnMount:false, //to stop refetch data from an API
        // refetchInterval:3000
        // cacheTime:3000
        // to prevent function to call defalut in mounting phase
        // enabled:false
    });
    console.log("data :", data?.data.data);
    console.log("isLoading :", isLoading);
    console.log("isError :", isError);
    console.log("isFetching :", isFetching);


    const x = "mohamed sabry mahmoud shehab";
    const y = x.split(" ");
    for (var i = 0; i < 2; i++) {
        console.log(y[i]);


    }

    // useEffect(function () {
    //     getAllProducts();
    // }, []);

    // to use context
    const { addToCart } = useContext(cartContext);

    if (isLoading) {
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
                <title>Home</title>

            </Helmet>
            <div className="container mt-3 gy-3">
                <div className=" d-flex">
                    {/* {message?<div className="alert bg-success text-light">{message}</div>:""} */}
                    <div className="w-75">
                        <SimpleSlider />

                    </div>
                    <div className="w-25">
                        <div>
                            <img className='w-100' style={{ height: "200px" }} src={require('../../images/slider-image-2.jpeg')} alt="" />
                        </div>
                        <div>
                            <img className='w-100' style={{ height: "200px" }} src={require('../../images/slider-image-3.jpeg')} alt="" />
                        </div>
                    </div>
                </div>
                <CategorySlider />

                <div class="mb-3 mt-5 w-75 m-auto">
                    <input onChange={(e) => setSearch(e.target.value)} type="search" class="form-control" id="exampleFormControlInput1" placeholder="search..." />
                </div>
                <div className="products row gy-3 mt-3">

                    {data?.data.data.filter((product) => {
                        // Normalize search query and product properties for case-insensitive comparison
                        const searchQuery = search.toLocaleLowerCase();

                        // Return products where the title or category name includes the search query
                        return searchQuery === '' ||
                            product.title.toLocaleLowerCase().includes(searchQuery) ||
                            product.category.name.toLocaleLowerCase().includes(searchQuery);
                    }).map((product, idx) => {
                        console.log(product);


                        return <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.5, ease: easeInOut }}
                            onHoverStart={event => { }}
                            onHoverEnd={event => { }} key={idx} className="col-lg-2 col-md-3 col-sm-4 col-6 overflow-hidden product">{/*f00000*/}
                            <span
                                role="button"
                                onClick={() => toggleWishlist(product.id)}
                                style={{ position: "relative", top: "4px", left: "80%" }}
                            >
                                <i
                                    className="fa-solid fa-heart"
                                    style={{ color: wishlist[product.id] ? "#f00000" : "#808080" }}
                                ></i>
                            </span>


                            <Link className='' to={`/productdetails/${product.id}`}>
                                <div style={{ height: "350px", display: "flex", flexDirection: "column" }} className=" mt-3 ">
                                    {/* imageCover */}
                                    <img src={product.imageCover} alt="" className='w-100' />
                                    <h4 className='h6 text-main'>{product.category.name}</h4>
                                    <h2 className='h5'>{product.title.split(' ').slice(0, 2).join(' ')}</h2>
                                    <div className="d-flex justify-content-between ">

                                        {product.priceAfterDiscount ? <p><del>{product.price}</del> {product.priceAfterDiscount} EGP</p> :
                                            <p>{product.price} EGP</p>
                                        }

                                        <p> <span><i style={{ color: "gold" }} className='fa-solid fa-star'></i></span>{product.ratingsAverage}</p>
                                    </div>
                                    {/* <p>{product.id}</p> */}

                                </div>
                            </Link>
                            <button onClick={() => addProduct(product.id)} className="btn bg-main text-white m-auto d-block add "><span><i class="fa-solid fa-cart-shopping"></i></span> Add to cart</button>

                        </motion.div>
                    }
                    )}


                </div>
            </div>
            {
                // allProducts.length > 0 ? <div className="container">
                //     <div className="row gy-3">

                //         {allProducts.map((product, idx) => <div key={idx} className="col-md-2">
                //             <div className="product">
                //                 {/* imageCover */}
                //                 <img src={product.imageCover} alt="" className='w-100' />
                //                 <h4 className='h6 text-main'>{product.category.name}</h4>
                //                 <h2 className='h5'>{product.title.split(' ').slice(0, 2).join(' ')}</h2>
                //                 <div className="d-flex justify-content-between">

                //                     {product.priceAfterDiscount ? <p><del>{product.price}</del> {product.priceAfterDiscount}</p> :
                //                         <p>{product.price}</p>
                //                     }

                //                     <p> <span><i style={{ color: "yellowgreen" }} className='fa-solid fa-star'></i></span>{product.ratingsAverage}</p>
                //                 </div>

                //             </div>
                //         </div>
                //         )}


                //     </div>
                // </div> : <div className="d-flex vh-100 bg-primary bg-opacity-50 justify-content-center align-items-center">
                //     <FallingLines
                //         color="#4fa94d"
                //         width="100"
                //         visible={true}
                //         ariaLabel="falling-circles-loading"
                //     />
                // </div>
            }



        </>
    )
}

export default Products
