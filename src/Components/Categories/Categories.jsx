import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {RotatingLines } from 'react-loader-spinner';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { cartContext } from '../../Context/CartContext';
import toast from 'react-hot-toast';
import { easeInOut, motion } from "framer-motion";
import { wishlistContext } from '../../Context/wishlist';

function Categories() {

    async function getAllCategories() {
        return await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
    }
    const x = useQuery('getAllCategories', getAllCategories, {});
    const categories = x?.data?.data.data;
    console.log("data of categories", categories);

    // state
    const [AllPrWSCat, setAllPrWSCat] = useState(null);
    const { addProductToCart } = useContext(cartContext);
    const [hasFetched, setHasFetched] = useState(false); // Track if the API has been called
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


    async function GetAllProductsWithSpecificCategory(id) {
        await axios.get(`https://ecommerce.routemisr.com/api/v1/products?category[_id]=${id}`).then((res) => {
            console.log("res of GetPWSCategory:", res?.data.data);

            setAllPrWSCat(null);
            setTimeout(() => {
                setAllPrWSCat(res?.data.data);

            }, 1000);


        }).catch((err) => {
            console.log("the error of delete :", err);

        });
    }


    // get all products

    async function GetAllProducts() {
        await axios.get(`https://ecommerce.routemisr.com/api/v1/products`).then((res) => {
            console.log("res of GetPWSCategory:", res?.data.data);


            setAllPrWSCat(null);
            // setTimeout(() => {
            setAllPrWSCat(res?.data.data);

            // }, 1000);

        }).catch((err) => {
            console.log("the error of delete :", err);

        });
    }

    useEffect(() => {
        if (!hasFetched) { // Prevent multiple calls
            setHasFetched(true); // Set the flag
            GetAllProducts();
        }
    }, [hasFetched]);



    if (x?.isLoading) {
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
            <title>Categories</title>

        </Helmet >
        <div className="cont">
            <div className="ro w-100">
                <div className="cate ">
                    <div className="categories  ">
                        <div className='d-flex me-3'>

                            <span><i style={{ "color": "rgb(215, 215, 204)" }} className='fa-solid fa-circle me-2 fa-sm'></i></span>
                            <p onClick={GetAllProducts} role='button' className=' fw-bold text-main cat'>All Product</p>
                        </div>

                        {categories?.map((category, idx) => {

                            return <div className='d-flex me-3'>

                                <span><i style={{ "color": "rgb(215, 215, 204)" }} className='fa-solid fa-circle me-2 fa-sm'></i></span>
                                <p onClick={category.name == `Men's Fashion` || category.name == `Women's Fashion` || category.name == `Electronics` ? () => { GetAllProductsWithSpecificCategory(category._id) } : GetAllProducts} role='button' className=' fw-bold text-main cat'>{category.name} </p>
                                {/* <span>{category._id}</span> */}
                            </div>

                        })}





                    </div>

                </div>
                {AllPrWSCat ? <div className="content ">
                    <div className="products row gy-2 ">

                        {/* <div className="col-lg-3 col-md-4 col-sm-6 gy-2 ">
                            <div className=" bg-primary   me-1   ">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod aperiam nobis, doloremque iure magni maxime ratione? Perferendis pariatur ipsum delectus rerum harum, exercitationem sit minus sequi voluptas a sapiente aut quaerat quidem explicabo, quia sint natus totam doloremque corporis saepe magnam, maxime error! Quia sapiente temporibus aut laboriosam, illum maxime!

                            </div>
                        </div> */}

                        {AllPrWSCat?.map((product, id) => {
                            console.log("product", product);


                            return <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.5, ease: easeInOut }}
                                onHoverStart={event => { }}
                                onHoverEnd={event => { }} key={id} className="col-lg-3 col-md-4 col-sm-6  overflow-hidden product">

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
                                    <div style={{ height: "430px", display: "flex", flexDirection: "column" }} className=" mt-3 ">
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



                </div> : <div className="d-flex vh-100 w-75  bg-opacity-50 justify-content-center align-items-center">
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
                </div>}

            </div>
        </div>

    </>
}

export default Categories
